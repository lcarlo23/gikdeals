import ExternalServices from "./modules/ExternalServices";
import Game from "./modules/Game";
import GameList from "./modules/GameList";
import { loadHeaderFooter } from "./utils";
import "/styles/main.css";

loadHeaderFooter();

const api = new ExternalServices();
const gameList = new GameList();
const giveawaysContainer = document.querySelector(
  "#latest-giveaways .cards-container",
);
const dealsContainer = document.querySelector("#best-deals .cards-container");
const heroContainer = document.getElementById("hero");

(async () => {
  const giveaways = await api.getGiveaways();
  const deals = await api.getDeals();
  const randomDeal = await api.getRandomDeal();
  const hero = new Game(randomDeal);

  gameList.renderList(giveaways, giveawaysContainer, 4);
  gameList.renderList(deals, dealsContainer, 8);
  hero.createHero(heroContainer);
})();
