import ExternalServices from "./modules/ExternalServices";
import GameList from "./modules/GameList";
import Game from "./modules/Game";
import { loadHeaderFooter } from "./utils";
import "/styles/main.css";

loadHeaderFooter();

document.addEventListener("DOMContentLoaded", async () => {
  const api = new ExternalServices();
  const gameList = new GameList();
  const randomDeal = await api.getRandomDeal();
  const hero = await new Game(randomDeal);
  const giveaways = await api.getGiveaways();
  const deals = await api.getDeals();

  const dealsContainer = document.querySelector("#best-deals .cards-container");
  const heroContainer = document.getElementById("hero");
  const giveawaysContainer = document.querySelector(
    "#latest-giveaways .cards-container",
  );

  gameList.renderList(giveaways, giveawaysContainer, 4);
  gameList.renderList(deals, dealsContainer, 8);
  hero.createHero(heroContainer);
});
