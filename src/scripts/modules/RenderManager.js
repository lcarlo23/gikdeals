import ExternalServices from "./ExternalServices";
import Game from "./Game";

export default class RenderManager {
  constructor() {}

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
  }

  async renderSearch() {
    const params = new URLSearchParams(window.location.search);
    const term = params.get("term").replace("+", " ").toUpperCase();
    const title = document.getElementById("page-title");
    const container = document.querySelector(".cards-container");
    const api = new ExternalServices();
    const list = await api.searchDeals(term);

    title.textContent = term;

    this.renderGameList(list, container, 999, 0, true);
  }
}
