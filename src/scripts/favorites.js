import "/styles/main.css";

import RenderManager from "./modules/RenderManager";
import { loadHeaderFooter } from "./modules/utils";
import ExternalServices from "./modules/ExternalServices";
import FavoritesManager from "./modules/FavoritesManager";

loadHeaderFooter();

document.addEventListener("DOMContentLoaded", async () => {
  document.body.classList.add("is-loading");
  const favMan = new FavoritesManager();
  const favorites = favMan.getFavorites();

  if (favorites.length > 0) {
    const api = new ExternalServices();
    const storeList = await api.getStoresList();

    const container = document.getElementById("deals");

    const favRender = new RenderManager(
      favorites,
      storeList,
      container,
      true,
      true,
    );

    favRender.renderGameList();
  }

  document.body.classList.remove("is-loading");
});
