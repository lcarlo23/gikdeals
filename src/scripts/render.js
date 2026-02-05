import { cleanTitle, createCard, getData } from "./utils";

export async function renderCards(
  parentElement,
  url,
  deals = true,
  start = 0,
  end = undefined,
) {
  const gameList = await getData(url);
  const storeList = await getData("/json/cheapshark_stores.json");

  gameList.slice(start, end + start).forEach(async (item) => {
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

    createCard(image, title, store, sale, price, parentElement);
  });
}

export async function renderHero(parentElement, url) {
  const game = (await getData(url))[0];
  const title = cleanTitle(game.title);
  const sale = "FREE";

  createCard(
    game.image,
    title,
    game.platforms,
    sale,
    game.worth,
    parentElement,
  );
}
