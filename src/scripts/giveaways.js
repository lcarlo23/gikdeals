import "/styles/main.css";

import RenderManager from "./modules/RenderManager";
import { loadHeaderFooter } from "./modules/utils";
import ExternalServices from "./modules/ExternalServices";

loadHeaderFooter();

document.addEventListener("DOMContentLoaded", async () => {
  document.body.classList.add("is-loading");
  const api = new ExternalServices();
  const storeList = await api.getStoresList();
  const list = await api.getGiveaways();

  const container = document.getElementById("giveaways");

  const giveawaysRender = new RenderManager(list, storeList, container);

  giveawaysRender.renderGameList(999, 0);

  document.body.classList.remove("is-loading");
});
