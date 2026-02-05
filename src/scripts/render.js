import { createCard, getData } from "./utils";

export async function renderCards(
  parentElement,
  url,
  deals = true,
  start = 0,
  end = undefined,
) {
  const gameList = await getData(url);
  const container = document.createElement("div");
  const storeList = await getData("/json/cheapshark_stores.json");

  container.classList.add("cards-container");

  gameList.slice(start, end + start).forEach(async (item) => {
    let store = item.platforms;

    if (deals) {
      store = storeList.filter((st) => st.storeID === item.storeID)[0]
        .storeName;
    }

    createCard(
      item.thumbnail ?? item.thumb,
      item.title,
      store,
      item.worth ?? `$${item.salePrice}`,
      container,
    );
  });

  parentElement.appendChild(container);
}

export async function renderHero(parentElement, url) {
  const gameList = await getData(url);

  gameList.slice(0, 1).forEach(async (item) => {
    createCard(
      item.image,
      item.title,
      item.platforms,
      item.worth,
      parentElement,
    );
  });
}
