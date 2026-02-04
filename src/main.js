import "/src/styles/global.css";
import "/src/styles/reset.css";

import { renderGiveaways } from "./scripts/render";

(async () => {
  const giveawaysDiv = document.getElementById("latest-giveaways");
  const url = "/json/gamerpower.json";

  renderGiveaways(giveawaysDiv, 4, url);
})();
