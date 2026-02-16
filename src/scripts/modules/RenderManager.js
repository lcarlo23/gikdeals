import { loadTemplate } from "./utils";
import ExternalServices from "./ExternalServices";
import Game from "./Game";
import Store from "./Store";
import FavoritesManager from "./FavoritesManager";

export default class RenderManager {
  constructor() {
    this.api = new ExternalServices();
    this.favMan = new FavoritesManager();
  }

  renderListEvents(list, parentElement, end = 999, start = 0, search = false) {
    parentElement.addEventListener("click", (e) => {
      const target = e.target;
      const sort = target.closest(".sort");
      const filter = target.closest(".filter");
      const sortPanel = parentElement.querySelector(".sort-panel");
      const filterPanel = parentElement.querySelector(".filter-panel");
      const sortData = target.closest("[data-sort]");
      const filterData = target.closest("[data-filter]");
      const card = e.target.closest(".card");
      const fav = e.target.closest(".favorite-btn");
      const id = card?.dataset.id;

      if (fav) {
        this.updateFavorites(id, e.target);
        return;
      }

      if (card) this.renderModal(id, !isNaN(Number(id)));

      if (sort) {
        sortPanel.classList.toggle("is-active");
      }
      if (filter) {
        filterPanel.classList.toggle("is-active");
      }

      if (sortData) {
        const btn = sortData.dataset.sort;
        let newList;

        if (btn === "name-asc") {
          newList = list.toSorted((a, b) => {
            const aTitle = a.title.trim().toLowerCase();
            const bTitle = b.title.trim().toLowerCase();

            return aTitle.localeCompare(bTitle);
          });
        }

        if (btn === "name-desc") {
          newList = list.toSorted((a, b) => {
            const aTitle = a.title.trim().toLowerCase();
            const bTitle = b.title.trim().toLowerCase();

            return bTitle.localeCompare(aTitle);
          });
        }

        if (btn === "lower") {
          newList = list.toSorted((a, b) => {
            const aPrice = parseFloat(a.salePrice || a.price);
            const bPrice = parseFloat(b.salePrice || b.price);

            return aPrice - bPrice;
          });
        }

        if (btn === "higher") {
          newList = list.toSorted((a, b) => {
            const aPrice = parseFloat(a.salePrice || a.price);
            const bPrice = parseFloat(b.salePrice || b.price);

            return bPrice - aPrice;
          });
        }

        if (btn === "store")
          this.renderGameList(newList, parentElement, end, start, search);

        sortPanel.classList.remove("is-active");
        filterPanel.classList.remove("is-active");
      }
    });
  }

  async renderGameList(
    list,
    parentElement,
    end = 999,
    start = 0,
    search = false,
  ) {
    const container = parentElement.querySelector(".cards-container");

    container.replaceChildren();

    const template = "/templates/card.html";
    const searchTemplate = "/templates/search-card.html";

    for (const item of list.slice(start, start + end)) {
      const game = new Game(item);

      const card = !search
        ? await game.createCard(template)
        : await game.createCard(searchTemplate, true);

      container.appendChild(card);

      const fav = document.querySelector(
        `[data-id="${this.id}"] .favorite-btn`,
      );
      if (this.isFavorite) fav.classList.add("is-active");
    }
  }

  async renderSearch() {
    const params = new URLSearchParams(window.location.search);
    const term = params.get("term").replace("+", " ").toUpperCase();
    const title = document.getElementById("page-title");
    const container = document.getElementById("deals");
    const list = await this.api.searchDeals(term);

    title.textContent = term;

    this.renderListEvents(list, container, 999, 0, true);
    this.renderGameList(list, container, 999, 0, true);
  }

  async renderModal(id, giveaway = false) {
    let template = giveaway
      ? await loadTemplate("/templates/modal-giveaway.html")
      : await loadTemplate("/templates/modal.html");

    const modal = document.createElement("dialog");
    const body = document.querySelector("body");

    modal.classList.add("modal");
    modal.dataset.id = id;

    let game;
    let storeData;
    let image;
    let title;
    let releaseDate;
    let sale;
    let price;
    let storePage;

    const storeList = await this.api.getStoresList();

    if (!giveaway) {
      game = await this.api.getGameById(id);
      game = game.gameInfo;

      storeData = storeList.find((store) => store.storeID === game.storeID);

      image = game.thumb;
      title = game.name;

      releaseDate = new Date(game.releaseDate * 1000).toLocaleDateString();

      sale = game.salePrice;
      price = game.retailPrice;

      storePage = `https://www.cheapshark.com/redirect?dealID=${id}`;
    } else {
      game = await this.api.getGameById(id, true);

      storeData = storeList.find((store) =>
        game.platforms.toLowerCase().includes(store.storeName.toLowerCase()),
      );

      image = game.image;
      title = game.title;

      releaseDate = new Date(game.published_date).toLocaleDateString();

      price = game.worth;

      storePage = game.open_giveaway_url;
    }

    let store;

    if (storeData) store = new Store(storeData);

    let modalContent = template
      .replace("{{img-bg}}", image)
      .replace("{{cover}}", image)
      .replace("{{title}}", title)
      .replace("{{releaseDate}}", releaseDate)
      .replace("{{storeName}}", store?.getName() || "")
      .replace("{{platform}}", store?.getLogo() || "")
      .replace("{{price}}", price)
      .replace("{{storePage}}", storePage);

    if (!giveaway) {
      modalContent = modalContent
        .replace(
          "{{steamRatingText}}",
          game.steamRatingText?.toUpperCase() || "No ratings",
        )
        .replace("{{steamRatingPercent}}", game.steamRatingPercent)
        .replace(
          "{{steamRatingCount}}",
          Number(game.steamRatingCount).toLocaleString(),
        )
        .replace("{{metacriticScore}}", game.metacriticScore)
        .replace("{{sale}}", sale);
    } else {
      modalContent = modalContent.replace(
        "{{instructions}}",
        game.instructions,
      );
    }

    modal.innerHTML = modalContent;

    body.appendChild(modal);

    modal.showModal();

    const favMan = new FavoritesManager();
    const favBtn = document.querySelector(
      `dialog[data-id="${id}"] .favorite-btn`,
    );
    const isFavorite = favMan.isFavorite(game);
    if (isFavorite) favBtn.classList.add("is-active");

    modal.addEventListener("close", () => {
      modal.remove();
    });

    modal.addEventListener("click", async (e) => {
      const isFavBtn = e.target.closest(".favorite-btn");
      const closeBtn = e.target.closest(".close-btn");

      if (isFavBtn) {
        const id = modal.dataset.id;
        this.updateFavorites(id, e.target);
        return;
      }

      if (closeBtn) modal.remove();
    });
  }

  renderFavorites(parentElement, list = false) {
    parentElement.innerHTML = "";

    const favMan = new FavoritesManager();
    const favorites = favMan.getFavorites();

    if (favorites.length === 0) {
      parentElement.innerHTML = `<p class="no-fav">NO FAVORITES YET<br>You can add/remove a game from this list by clicking on the star icon</p>`;
      return;
    }

    if (list) {
      const favList = favorites.slice(-5).toReversed();

      favList.forEach((fav) => {
        const card = document.createElement("div");
        card.classList.add("card-list");

        card.innerHTML = `
          <img src="${fav.thumb || fav.gameInfo?.thumb || fav.thumbnail}" width="80" height="80" />
          <p class="fav-title">${fav.title || fav.name || fav.gameInfo.name}</p>
        `;

        parentElement.appendChild(card);
      });
    }
  }

  async updateFavorites(id, target) {
    const game = await this.api.getGameById(id, !isNaN(Number(id)));
    const card = document.querySelector(`.card[data-id="${id}"] .favorite-btn`);
    const hero = document.querySelector(
      `.hero-card[data-id="${id}"] .favorite-btn`,
    );

    this.favMan.toggleFavorites(game);

    target.classList.toggle("is-active");
    const isCard = target.closest(".card");
    const isHero = target.closest(".hero-card");

    if (card && !isCard) card.classList.toggle("is-active");
    if (hero && !isHero) hero.classList.toggle("is-active");

    const favoriteContainer = document.getElementById("fav-list");
    if (favoriteContainer) this.renderFavorites(favoriteContainer, true);
  }
}
