import { cleanTitle, createCard, getData } from "./utils";

export async function renderCards(
  parentElement,
  data,
  deals = true,
  start = 0,
  end = undefined,
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
      title = item.title;
      store = storeList.filter((st) => st.storeID === item.storeID)[0]
        .storeName;
      sale = `$${item.salePrice}`;
      price = `$${item.normalPrice}`;
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
