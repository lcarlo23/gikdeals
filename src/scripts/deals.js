import "/styles/main.css";

import RenderManager from "./modules/RenderManager";
import { loadHeaderFooter } from "./modules/utils";
import ExternalServices from "./modules/ExternalServices";

loadHeaderFooter();

document.addEventListener("DOMContentLoaded", async () => {
  const api = new ExternalServices();
  const storeList = await api.getStoresList();
  const list = await api.getDeals();

  const container = document.getElementById("deals");

  const dealsRender = new RenderManager(list, storeList, container, true);

  dealsRender.renderGameList(999, 0);
});
