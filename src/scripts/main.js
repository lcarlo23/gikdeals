import "/styles/main.css";

import ExternalServices from "./modules/ExternalServices";
import RenderManager from "./modules/RenderManager";
import Game from "./modules/Game";
import { loadHeaderFooter } from "./utils";

loadHeaderFooter();

document.addEventListener("DOMContentLoaded", async () => {
  const api = new ExternalServices();
  const gameList = new RenderManager();
  const randomDeal = await api.getRandomDeal();
  const hero = await new Game(randomDeal);
  const giveaways = await api.getGiveaways();
  const deals = await api.getDeals();

  const heroContainer = document.getElementById("hero");
  const dealsContainer = document.querySelector("#best-deals .cards-container");
  const giveawaysContainer = document.querySelector(
    "#latest-giveaways .cards-container",
  );

  gameList.renderGameList(giveaways, giveawaysContainer, 4);
  gameList.renderGameList(deals, dealsContainer, 8);
  hero.createHero(heroContainer);
});
