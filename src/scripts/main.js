import "/styles/main.css";

import ExternalServices from "./modules/ExternalServices";
import RenderManager from "./modules/RenderManager";
import Game from "./modules/Game";
import { loadHeaderFooter } from "./modules/utils";

loadHeaderFooter();

document.addEventListener("DOMContentLoaded", async () => {
  const heroContainer = document.getElementById("hero");
  const favoriteContainer = document.getElementById("fav-list");
  const dealsContainer = document.querySelector("#best-deals");
  const giveawaysContainer = document.querySelector("#latest-giveaways");

  const api = new ExternalServices();

  const randomDeal = await api.getRandomDeal();
  const giveaways = await api.getGiveaways();
  const deals = await api.getDeals();
  const storeList = await api.getStoresList();

  const giveawaysRender = new RenderManager(
    giveaways,
    storeList,
    giveawaysContainer,
  );
  const dealsRender = new RenderManager(deals, storeList, dealsContainer);

  const hero = new Game(randomDeal, storeList);
  hero.createHero(heroContainer, dealsRender);

  dealsRender.renderFavorites(favoriteContainer, true);

  dealsRender.renderGameList(8);
  giveawaysRender.renderGameList(4);
});
