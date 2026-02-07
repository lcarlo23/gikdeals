import ExternalServices from "./modules/ExternalServices";
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

(async () => {
  const giveaways = await api.getGiveaways();
  const deals = await api.getDeals();

  gameList.renderList(giveaways, giveawaysContainer, 4);
  gameList.renderList(deals, dealsContainer, 8);
})();
