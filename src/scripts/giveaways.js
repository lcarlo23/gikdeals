import "/styles/main.css";

import RenderManager from "./modules/RenderManager";
import { loadHeaderFooter } from "./modules/utils";
import ExternalServices from "./modules/ExternalServices";

loadHeaderFooter();

document.addEventListener("DOMContentLoaded", async () => {
  const api = new ExternalServices();
  const storeList = await api.getStoresList();
  const list = await api.getGiveaways();

  const container = document.getElementById("giveaways");

  const giveawaysRender = new RenderManager(list, storeList, container);

  giveawaysRender.renderGameList(999, 0);
});
