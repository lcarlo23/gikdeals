import { loadTemplate } from "./utils";
import ExternalServices from "./ExternalServices";
import Store from "./Store";
import FavoritesManager from "./FavoritesManager";

const api = new ExternalServices();
const favMan = new FavoritesManager();

export default class Game {
  constructor(data, storeList) {
    this.data = data;
    this.storeList = storeList;
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
    this.id =
      this.data.dealID || this.data.id || this.data.cheapestDealID || "";
    this.date = this.data.end_date || "";

    this.setStore();
  }

  async createCard() {
    const template = await loadTemplate("/templates/card.html");
    const card = document.createElement("div");

    card.classList.add("card");
    card.dataset.id = this.id;

    if (this.salePrice === "") {
      card.classList.add("free");
    }

    const cardContent = template
      .replace("{{img-bg}}", this.image)
      .replace("{{cover}}", this.image)
      .replace("{{title}}", this.title)
      .replace("{{platform}}", this.store?.getLogo() || "")
      .replace("{{sale}}", this.salePrice)
      .replace("{{price}}", this.price);

    card.innerHTML = cardContent;

    return card;
  }

  async createHero(parentElement, renMan) {
    parentElement.replaceChildren();

    const template = await loadTemplate("/templates/hero.html");
    const card = document.createElement("div");

    card.classList.add("hero-card");
    if (this.salePrice === "0.00" || this.salePrice === "") {
      card.classList.add("free");
    }

    const storePage = `https://www.cheapshark.com/redirect?dealID=${this.id}`;

    await this.setStore();

    const cardContent = template
      .replace("{{img-bg}}", this.image)
      .replace("{{cover}}", this.image)
      .replace("{{title}}", this.title)
      .replace("{{platform}}", this.store?.getLogo())
      .replace("{{storePage}}", storePage)
      .replace("{{sale}}", this.salePrice)
      .replace("{{price}}", this.price);

    card.innerHTML = cardContent;
    card.dataset.id = this.id;

    parentElement.appendChild(card);

    const favorite = document.querySelector("#hero .favorite-btn");

    if (this.isFavorite) favorite.classList.add("is-active");

    favorite.addEventListener("click", (e) => {
      const favoriteContainer = document.getElementById("fav-list");

      renMan.updateFavorites(this.id, e.target);
      renMan.renderFavorites(favoriteContainer, true);
    });

    const shuffleBtn = document.querySelector(".shuffle-button");

    shuffleBtn.addEventListener("click", async () => {
      const newGame = await api.getRandomDeal();
      let newHero = new Game(newGame, this.storeList);

      newHero.createHero(parentElement, renMan);
    });
  }

  setStore() {
    const storeData = this.data.platforms
      ? this.storeList.find((store) =>
          this.data.platforms
            .toLowerCase()
            .includes(store.storeName?.toLowerCase()),
        )
      : this.storeList.find((store) => store.storeID === this.data.storeID);

    if (!storeData) return;

    this.store = new Store(storeData);
  }
}
