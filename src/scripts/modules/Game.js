import { loadTemplate } from "../utils";
import ExternalServices from "./ExternalServices";
import Store from "./Store";

export default class Game {
  constructor(data) {
    this.data = data;

    this.image = this.data.image || this.data.thumb || this.data.thumbnail;
    this.title =
      this.data.title.split(" (")[0] ||
      this.data.external ||
      "No title available";
    this.store;
    this.sale = this.data.salePrice || this.data.cheapest || "";
    this.price = this.data.normalPrice || this.data.worth || "";
  }

  async createCard(parentElement) {
    const template = await loadTemplate("/templates/card.html");
    const card = document.createElement("div");

    this.store = await this.setStore();

    card.classList.add("card");

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

  getDiscount() {
    const discount = Math.round(((this.price - this.sale) / this.price) * 100);
    return `${discount}% OFF`;
  }

  async setStore() {
    const api = new ExternalServices();
    const storesList = await api.getStoresList();

    const storeData = this.data.platforms
      ? storesList.filter((store) =>
          this.data.platforms
            .toLowerCase()
            .includes(store.storeName.toLowerCase()),
        )[0]
      : storesList.filter((store) => store.storeID === this.data.storeID)[0];

    const store = new Store(storeData);

    return store.getLogo();
  }
}
