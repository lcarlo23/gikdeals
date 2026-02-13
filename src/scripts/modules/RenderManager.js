import { loadTemplate } from "../utils";
import ExternalServices from "./ExternalServices";
import Game from "./Game";
import Store from "./Store";

export default class RenderManager {
  constructor() {
    this.api = new ExternalServices();
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

    parentElement.addEventListener("click", (e) => {
      const card = e.target.closest(".card");

      if (card) {
        const id = card.dataset.deal;

        this.renderModal(id);
      }
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

  async renderModal(id) {
    const template = await loadTemplate("/templates/modal.html");
    const modal = document.createElement("dialog");
    const body = document.querySelector("body");

    modal.classList.add("modal");

    const game = await this.api.getGameById(id);

    const storeList = await this.api.getStoresList();
    const storeData = storeList.find(
      (store) => store.storeID === game.gameInfo.storeID,
    );
    const store = new Store(storeData);

    const info = game.gameInfo;
    const releaseDate = new Date(info.releaseDate * 1000).toLocaleDateString();
    const storePage = `https://www.cheapshark.com/redirect?dealID=${id}`;

    const modalContent = template
      .replace("{{img-bg}}", info.thumb)
      .replace("{{cover}}", info.thumb)
      .replace("{{title}}", info.name)
      .replace("{{releaseDate}}", releaseDate)
      .replace(
        "{{steamRatingText}}",
        info.steamRatingText?.toUpperCase() || "No ratings",
      )
      .replace("{{steamRatingPercent}}", info.steamRatingPercent)
      .replace(
        "{{steamRatingCount}}",
        Number(info.steamRatingCount).toLocaleString(),
      )
      .replace("{{metacriticScore}}", info.metacriticScore)
      .replace("{{storeName}}", store.getName())
      .replace("{{platform}}", store.getLogo())
      .replace("{{sale}}", info.salePrice)
      .replace("{{price}}", info.retailPrice)
      .replace("{{storePage}}", storePage);

    modal.innerHTML = modalContent;

    modal.addEventListener("close", () => {
      modal.remove();
    });

    body.appendChild(modal);

    modal.showModal();
  }
}
