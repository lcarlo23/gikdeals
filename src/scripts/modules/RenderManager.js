import { loadTemplate } from "./utils";
import ExternalServices from "./ExternalServices";
import Game from "./Game";
import Store from "./Store";
import FavoritesManager from "./FavoritesManager";

export default class RenderManager {
  constructor(
    list,
    storeList,
    parentElement,
    isDeal = false,
    isSearch = false,
  ) {
    this.list = list;
    this.storeList = storeList;
    this.parent = parentElement;

    this.api = new ExternalServices();
    this.favMan = new FavoritesManager();

    this.sort = "DealRating";
    this.storeFilter = "reset";
    this.originalList = list;
    this.end = 999;
    this.start = 0;
    this.sorted = false;
    this.store = "";
    this.isDeal = isDeal;
    this.isSearch = isSearch;

    this.loadFilters();
    this.loadEvents();
  }

  async loadFilters() {
    const sortPanel = this.parent.querySelector(".sort-panel");
    const sortTemplate = await loadTemplate(
      this.isDeal && !this.isSearch
        ? "/templates/sort-panel-deal.html"
        : "/templates/sort-panel.html",
    );

    if (sortPanel) sortPanel.innerHTML = sortTemplate;

    const filterPanel = this.parent.querySelector(".filter-panel");
    const storeFilter = this.parent.querySelector(".filter-div.store");

    if (filterPanel) {
      let filterStore = [];

      if (this.isDeal && !this.isSearch) {
        this.storeList.forEach((store) => filterStore.push(store.storeName));
      } else {
        filterStore = await this.loadStoreList(this.list);
      }
      filterStore.forEach((store) => {
        if (store) {
          const btn = document.createElement("button");
          btn.dataset.filter = store;
          btn.textContent = store;

          storeFilter?.appendChild(btn);
        }
      });
    }
  }

  async loadEvents() {
    this.parent.addEventListener("click", (e) => {
      const target = e.target;

      const sort = target.closest(".sort");
      const filter = target.closest(".filter");
      const sortData = target.closest("[data-sort]");
      const filterData = target.closest("[data-filter]");
      const card = target.closest(".card");
      const fav = target.closest(".favorite-btn");

      const sortPanel = this.parent.querySelector(".sort-panel");
      const filterPanel = this.parent.querySelector(".filter-panel");

      const id = card?.dataset.id;

      if (fav) {
        this.updateFavorites(id, e.target);
        return;
      }

      if (card) this.renderModal(id, !isNaN(Number(id)));

      if (sort) {
        sortPanel.classList.toggle("is-active");
        filterPanel.classList.remove("is-active");
      } else if (filter) {
        filterPanel.classList.toggle("is-active");
        sortPanel.classList.remove("is-active");
      } else {
        sortPanel.classList.remove("is-active");
        filterPanel.classList.remove("is-active");
      }

      if (sortData) {
        const btn = sortData.dataset.sort;

        this.sort = btn;

        sortPanel.classList.remove("is-active");
        this.applyFilterSort();
      }

      if (filterData) {
        const btn = filterData.dataset.filter;

        this.storeFilter = btn;

        filterPanel.classList.remove("is-active");
        this.applyFilterSort();
      }
    });
  }

  async renderGameList(end = this.end, start = this.start) {
    this.end = end;
    this.start = start;

    this.updateActiveFilters();

    const container = this.parent.querySelector(".cards-container");
    if (container) container.replaceChildren();

    for (const item of this.list.slice(start, start + end)) {
      const game = new Game(item, this.storeList);

      const card = await game.createCard();

      container.appendChild(card);

      const fav = card.querySelector(`[data-id="${game.id}"] .favorite-btn`);
      if (!this.isDeal) fav.remove();
      if (game.isFavorite && fav) fav.classList.add("is-active");
    }
  }

  async loadStoreList(list) {
    let availableStores = [];

    list.forEach((item) => {
      const game = new Game(item, this.storeList);
      const store = game.store?.getName() || "";

      const inList = availableStores.findIndex((item) => item === store);
      if (inList === -1) availableStores.push(store);
    });
    return availableStores;
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

    if (!giveaway) {
      game = await this.api.getGameById(id);
      game = game.gameInfo;

      storeData = this.storeList.find(
        (store) => store.storeID === game.storeID,
      );

      image = game.thumb;
      title = game.name;

      releaseDate = new Date(game.releaseDate * 1000).toLocaleDateString();

      sale = game.salePrice;
      price = game.retailPrice;

      storePage = `https://www.cheapshark.com/redirect?dealID=${id}`;
    } else {
      game = await this.api.getGameById(id, true);

      storeData = this.storeList.find((store) =>
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

  renderFavorites(element = this.parent, list = false) {
    element.innerHTML = "";

    const favMan = new FavoritesManager();
    const favorites = favMan.getFavorites();

    if (favorites.length === 0) {
      element.innerHTML = `<p class="no-fav">NO FAVORITES YET<br>You can add/remove a game from this list by clicking on the star icon</p>`;
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

        element.appendChild(card);
      });
    }
  }

  async updateFavorites(id, target) {
    const game = await this.api.getGameById(id, !isNaN(Number(id)));
    const card = document.querySelector(`.card[data-id="${id}"] .favorite-btn`);
    const hero = document.querySelector(
      `.hero-card[data-id="${id}"] .favorite-btn`,
    );

    game.gameInfo.dealID = id;

    this.favMan.toggleFavorites(game.gameInfo);

    target.classList.toggle("is-active");

    const isCard = target.closest(".card");
    const isHero = target.closest(".hero-card");

    if (card && !isCard) card.classList.toggle("is-active");
    if (hero && !isHero) hero.classList.toggle("is-active");

    const favoriteContainer = document.getElementById("fav-list");
    if (favoriteContainer) this.renderFavorites(favoriteContainer, true);

    this.renderGameList();
  }

  async applyFilterSort() {
    this.list = [...this.originalList];

    if (this.storeFilter === "reset") {
      this.storeFilter = "all";
      this.store = "";
    }

    if (this.storeFilter !== "all") {
      if (this.isDeal && !this.isSearch) {
        this.store = this.storeList.find(
          (store) => store.storeName === this.storeFilter,
        );
        const newList = await this.api.getDeals(
          this.end,
          `&storeID=${this.store.storeID}`,
        );
        this.list = newList;
      } else {
        this.list = this.list.filter((item) => {
          const game = new Game(item, this.storeList);
          return game.store?.getName() === this.storeFilter;
        });
      }
    }

    if (this.isDeal && !this.isSearch) {
      this.list = await this.api.getDeals(
        this.end,
        this.store?.storeID
          ? `&storeID=${this.store.storeID}&sortBy=${this.sort}`
          : `&sortBy=${this.sort}`,
      );
    } else if (!this.isDeal || this.isSearch) {
      this.list.sort((a, b) => {
        if (this.sort === "name-asc") {
          const aTitle = a.title.trim().toLowerCase();
          const bTitle = b.title.trim().toLowerCase();

          return aTitle.localeCompare(bTitle);
        }
        if (this.sort === "name-desc") {
          const aTitle = a.title.trim().toLowerCase();
          const bTitle = b.title.trim().toLowerCase();

          return bTitle.localeCompare(aTitle);
        }
        if (this.sort === "lower") {
          const aPrice = parseFloat(a.salePrice || a.price);
          const bPrice = parseFloat(b.salePrice || b.price);

          return aPrice - bPrice;
        }
        if (this.sort === "higher") {
          const aPrice = parseFloat(a.salePrice || a.price);
          const bPrice = parseFloat(b.salePrice || b.price);

          return bPrice - aPrice;
        }
        if (this.sort === "ending") {
          const aDate =
            a.date !== "N/A" ? new Date(a.end_date).getTime() : Infinity;
          const bDate =
            b.date !== "N/A" ? new Date(b.end_date).getTime() : Infinity;

          return aDate - bDate;
        }
        if (this.sort === "new") {
          this.list = [...this.originalList];
        }

        if (this.sort === "reset") {
          this.list = [...this.originalList];
          this.sort = "";
        }
      });
    }

    this.renderGameList();
  }

  updateActiveFilters() {
    const sortBtns = this.parent.querySelectorAll("[data-sort]");
    const filterBtns = this.parent.querySelectorAll("[data-filter]");

    sortBtns.forEach((btn) =>
      btn.classList.toggle("is-active", btn.dataset.sort === this.sort),
    );
    filterBtns.forEach((btn) =>
      btn.classList.toggle(
        "is-active",
        btn.dataset.filter === this.storeFilter,
      ),
    );
  }
}
