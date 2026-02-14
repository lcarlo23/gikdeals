import { loadTemplate } from "./utils";
import ExternalServices from "./ExternalServices";
import Store from "./Store";
import FavoritesManager from "./FavoritesManager";

const api = new ExternalServices();
const favMan = new FavoritesManager();

export default class Game {
  constructor(data) {
    this.data = data;
    this.isFavorite = favMan.isFavorite(data);

    this.image =
      this.data.image || this.data.thumb || this.data.thumbnail || "";
    this.title =
      this.data.title?.split(" (")[0] ||
      this.data.external ||
      "No title available";
    this.store;

    const sale = this.data.salePrice || this.data.cheapest;
    this.salePrice = sale ? `$${sale}` : "";
    this.price = this.data.normalPrice
      ? `$${this.data.normalPrice}`
      : this.data.worth || "";
    this.id = this.data.gameID || this.data.id || "";
    this.deal = this.data.dealID || this.data.cheapestDealID || "";
  }

  async createCard(parentElement, HTMLtemplate, search = false) {
    const template = await loadTemplate(HTMLtemplate);
    const card = document.createElement("div");

    if (!search) this.store = (await this.setStore()) || "";
    if (search) this.price = `$${this.data.cheapest}`;
    card.classList.add("card");
    card.dataset.id = this.id;

    if (this.deal) card.dataset.deal = this.deal;

    if (this.salePrice === "$0.00" || this.salePrice === "") {
      card.classList.add("free");
    }

    const cardContent = template
      .replace("{{img-bg}}", this.image)
      .replace("{{cover}}", this.image)
      .replace("{{title}}", this.title)
      .replace("{{platform}}", this.store)
      .replace("{{sale}}", this.salePrice)
      .replace("{{price}}", this.price);

    card.innerHTML = cardContent;

    parentElement.appendChild(card);

    const fav = document.querySelector(`[data-id="${this.id}"] .favorite-icon`);
    if (this.isFavorite) fav.classList.add("is-active");
  }

  async createHero(parentElement, renMan) {
    parentElement.replaceChildren();

    const template = await loadTemplate("/templates/hero.html");
    const card = document.createElement("div");

    card.classList.add("hero-card");
    if (this.salePrice === "0.00" || this.salePrice === "") {
      card.classList.add("free");
    }

    const storePage = `https://www.cheapshark.com/redirect?dealID=${this.deal}`;

    this.store = await this.setStore();

    const cardContent = template
      .replace("{{img-bg}}", this.image)
      .replace("{{cover}}", this.image)
      .replace("{{title}}", this.title)
      .replace("{{platform}}", this.store)
      .replace("{{storePage}}", storePage)
      .replace("{{sale}}", this.salePrice)
      .replace("{{price}}", this.price);

    card.innerHTML = cardContent;
    parentElement.appendChild(card);

    const favorite = document.querySelector("#hero .favorite-icon");

    if (this.isFavorite) favorite.classList.add("is-active");

    favorite.addEventListener("click", () => {
      favMan.toggleFavorites(this.data);
      favorite.classList.toggle("is-active");

      const favoriteContainer = document.getElementById("fav-list");
      renMan.renderFavorites(favoriteContainer, true);
    });

    const shuffleBtn = document.querySelector(".shuffle-button");

    shuffleBtn.addEventListener("click", async () => {
      const newGame = await api.getRandomDeal();
      let newHero = new Game(newGame);

      newHero.createHero(parentElement, renMan);
    });
  }

  async setStore() {
    const storeList = await api.getStoresList();

    const storeData = this.data.platforms
      ? storeList.find((store) =>
          this.data.platforms
            .toLowerCase()
            .includes(store.storeName.toLowerCase()),
        )
      : storeList.find((store) => store.storeID === this.data.storeID);

    if (!storeData) return;

    const store = new Store(storeData);
    return store.getLogo();
  }
}
