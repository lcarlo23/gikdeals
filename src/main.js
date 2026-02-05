import "/src/styles/main.css";

import { renderCards, renderHero } from "./scripts/render";

(() => {
  const heroContainer = document.getElementById("hero");
  const giveawaysContainer = document.getElementById("latest-giveaways");
  const dealsContainer = document.getElementById("best-deals");
  const giveaways = "/json/gamerpower.json";
  const deals = "/json/cheapshark.json";

  renderHero(heroContainer, giveaways);
  renderCards(giveawaysContainer, giveaways, false, 1, 4);
  renderCards(dealsContainer, deals, true, 0, 8);
})();
