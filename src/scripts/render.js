import { createCard, getData } from "./utils";

export async function renderGiveaways(parentElement, quantity, url) {
  const giveaways = await getData(url);

  giveaways.slice(0, quantity).forEach((item) => {
    createCard(
      item.image,
      item.title,
      item.platforms,
      item.worth,
      parentElement,
    );
  });
}
