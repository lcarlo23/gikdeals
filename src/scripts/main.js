import "/styles/main.css";

import { renderCards, renderHero } from "/scripts/render";
import { getData } from "/scripts/utils";
import { renderHeaderFooter } from "./render";

(async () => {
  renderHeaderFooter();

  const heroContainer = document.getElementById("hero");
  const giveawaysContainer = document.querySelector(
    "#latest-giveaways .cards-container",
  );
  const dealsContainer = document.querySelector("#best-deals .cards-container");

  const giveaways = await getData(
    "https://gamerpower.p.rapidapi.com/api/giveaways",
    true,
  );
  const deals = await getData(
    "https://www.cheapshark.com/api/1.0/deals?pageNumber=1&pageSize=8",
  );

  // renderHero(heroContainer, giveaways);
  renderCards(giveawaysContainer, giveaways, false, 0, 4);
  renderCards(dealsContainer, deals, true);
})();
