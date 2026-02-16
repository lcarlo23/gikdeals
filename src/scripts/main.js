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
  const renMan = new RenderManager();

  const randomDeal = await api.getRandomDeal();
  const giveaways = await api.getGiveaways();
  const deals = await api.getDeals();

  const hero = new Game(randomDeal);

  hero.createHero(heroContainer, renMan);

  renMan.renderFavorites(favoriteContainer, true);
  renMan.renderListEvents(giveaways, giveawaysContainer, 4);
  renMan.renderGameList(giveaways, giveawaysContainer, 4);
  renMan.renderListEvents(deals, dealsContainer, 8);
  renMan.renderGameList(deals, dealsContainer, 8);
});
