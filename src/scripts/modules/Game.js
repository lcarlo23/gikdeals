import { loadTemplate } from "../utils";
import ExternalServices from "./ExternalServices";
import Store from "./Store";

export default class Game {
  constructor(data) {
    this.data = data;
    this.api = new ExternalServices();

    this.image =
      this.data.image || this.data.thumb || this.data.thumbnail || "";
    this.title =
      this.data.title?.split(" (")[0] ||
      this.data.external ||
      "No title available";
    this.store;
    this.sale = this.data.salePrice || this.data.cheapest || "";
    this.price = this.data.normalPrice || this.data.worth || "";
  }

  async createCard(parentElement, HTMLtemplate, search = false) {
    const template = await loadTemplate(HTMLtemplate);
    const card = document.createElement("div");

    if (!search) this.store = (await this.setStore()) || "";

    card.classList.add("card");
    if (this.sale === "0.00" || this.sale === "") {
      card.classList.add("free");
    }

    const cardContent = template
      .replace("{{img-bg}}", this.image)
      .replace("{{cover}}", this.image)
      .replace("{{title}}", this.title)
      .replace("{{platform}}", this.store)
      .replace("{{sale}}", this.sale)
      .replace("{{price}}", this.price);

    card.innerHTML = cardContent;
    parentElement.appendChild(card);
  }

  async createHero(parentElement) {
    parentElement.replaceChildren();

    const template = await loadTemplate("/templates/hero.html");
    const card = document.createElement("div");
    card.classList.add("hero-card");
    if (this.sale === "0.00" || this.sale === "") {
      card.classList.add("free");
    }

    this.store = await this.setStore();

    const cardContent = template
      .replace("{{img-bg}}", this.image)
      .replace("{{cover}}", this.image)
      .replace("{{title}}", this.title)
      .replace("{{platform}}", this.store)
      .replace("{{sale}}", this.sale)
      .replace("{{price}}", this.price);

    card.innerHTML = cardContent;
    parentElement.appendChild(card);

    const shuffleBtn = document.querySelector(".shuffle-button");

    shuffleBtn.addEventListener("click", async () => {
      const newDeal = await this.api.getRandomDeal();
      let newHero = new Game(newDeal);

      newHero.createHero(parentElement);
    });
  }

  getDiscount() {
    const discount = Math.round(((this.price - this.sale) / this.price) * 100);
    return `${discount}% OFF`;
  }

  async setStore() {
    const storeList = await this.api.getStoresList();

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
