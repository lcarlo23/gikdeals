import "/styles/main.css";

import { renderCards, renderHero } from "/scripts/render";
import { getData } from "/scripts/utils";
import { renderTemplate } from "./render";

(async () => {
  const heroContainer = document.getElementById("hero");
  const giveawaysContainer = document.querySelector(
    "#latest-giveaways .cards-container",
  );
  const dealsContainer = document.querySelector("#best-deals .cards-container");
  const header = document.querySelector("header");

  const giveaways = await getData("/json/gamerpower.json");
  const deals = await getData("/json/cheapshark.json");

  renderTemplate("/assets/templates/header.html", header);
  renderHero(heroContainer, giveaways);
  renderCards(giveawaysContainer, giveaways, false, 1, 4);
  renderCards(dealsContainer, deals, true, 0, 8);
})();
