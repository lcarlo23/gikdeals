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

  renderGameList(list, parentElement, end = 999, start = 0, search = false) {
    list.slice(start, start + end).forEach((item) => {
      const game = new Game(item);

      !search
        ? game.createCard(parentElement, "/templates/card.html")
        : game.createCard(
            parentElement,
            "/templates/search-card.html",
            (search = true),
          );
    });

    parentElement.addEventListener("click", async (e) => {
      const card = e.target.closest(".card");
      const fav = e.target.closest(".favorite-btn");

      if (!card && !fav) {
        return;
      }

      const id = card.dataset.id;

      if (fav) {
        this.updateFavorites(id, e.target);
        return;
      }

      this.renderModal(id, !isNaN(Number(id)));
    });
  }

  async renderSearch() {
    const params = new URLSearchParams(window.location.search);
    const term = params.get("term").replace("+", " ").toUpperCase();
    const title = document.getElementById("page-title");
    const container = document.querySelector(".cards-container");
    const list = await this.api.searchDeals(term);

    title.textContent = term;

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

    if (!isCard) card.classList.toggle("is-active");
    if (hero && !isHero) hero.classList.toggle("is-active");

    const favoriteContainer = document.getElementById("fav-list");
    if (favoriteContainer) this.renderFavorites(favoriteContainer, true);
  }
}
