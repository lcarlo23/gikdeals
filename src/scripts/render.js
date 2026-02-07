import { cleanTitle, getSearchData } from "./utils";

export async function renderHero(parentElement, data) {
  const game = data[0];
  const title = cleanTitle(game.title);

  parentElement.appendChild(card);
}

export async function renderSearch() {
  const data = await getSearchData();
  const cardsContainer = document.querySelector(".cards-container");

  renderCards(cardsContainer, data);
}

export function renderSearchTitle() {
  const params = new URLSearchParams(window.location.search);
  const term = params.get("term").replace("+", " ").toUpperCase();
  const title = document.getElementById("page-title");

  title.textContent = term;
}
