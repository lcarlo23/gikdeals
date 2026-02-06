import {
  cleanTitle,
  createCard,
  getData,
  loadTemplate,
  getSearchData,
} from "./utils";

export async function renderCards(
  parentElement,
  data,
  deals = true,
  start = 0,
  end = 9999,
) {
  const storeList = await getData("/json/cheapshark_stores.json");

  data.slice(start, end + start).forEach(async (item) => {
    let image;
    let title;
    let store;
    let sale;
    let price;

    if (deals) {
      image = item.thumb;
      title = item.title || item.external;
      store = item.storeID
        ? storeList.filter((st) => st.storeID === item.storeID)[0].storeName
        : "";
      sale = item.salePrice
        ? `$${item.salePrice}`
        : `lower price: $${item.cheapest}`;
      price = item.normalPrice ? `$${item.normalPrice}` : "";
    } else {
      image = item.thumbnail;
      title = cleanTitle(item.title);
      store = item.platforms;
      sale = "FREE";
      price = item.worth;
    }

    const card = createCard(image, title, store, sale, price);

    card.dataset.id = item.id ?? item.gameID;

    parentElement.appendChild(card);
  });
}

export async function renderHero(parentElement, data) {
  const game = data[0];
  const title = cleanTitle(game.title);
  const sale = "FREE";

  const card = createCard(game.image, title, game.platforms, sale, game.worth);

  parentElement.appendChild(card);
}

export async function renderTemplate(path, parentElement) {
  const template = await loadTemplate(path);
  parentElement.innerHTML = template;
}

export function renderHeaderFooter() {
  const header = document.querySelector("header");
  const footer = document.querySelector("footer");
  const headerPath = "/assets/templates/header.html";
  const footerPath = "/assets/templates/footer.html";

  renderTemplate(headerPath, header);
  renderTemplate(footerPath, footer);
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
