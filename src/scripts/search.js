import "/styles/main.css";

import { renderHeaderFooter, renderSearch, renderSearchTitle } from "./render";

(async () => {
  renderHeaderFooter();
  renderSearch();
  renderSearchTitle();
})();
