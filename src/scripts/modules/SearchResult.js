import { loadTemplate } from "../utils";
import ExternalServices from "./ExternalServices";

export default class SearchResult {
  constructor(data) {
    this.data = data;
    this.api = new ExternalServices();

    this.image = this.data.thumb || "";
    this.title = this.data.external || "No title available";
    this.price = this.data.cheapest || "";
  }

  async createCard(parentElement) {
    const template = await loadTemplate("/templates/card.html");
    const card = document.createElement("div");

    card.classList.add("card");
    if (this.sale === "0.00" || this.sale === "") {
      card.classList.add("free");
    }

    const cardContent = template
      .replace("{{img-bg}}", this.image)
      .replace("{{cover}}", this.image)
      .replace("{{title}}", this.title)
      .replace("{{sale}}", this.sale)
      .replace("{{price}}", this.price);

    card.innerHTML = cardContent;
    parentElement.appendChild(card);
  }

  getDiscount() {
    const discount = Math.round(((this.price - this.sale) / this.price) * 100);
    return `${discount}% OFF`;
  }
}
