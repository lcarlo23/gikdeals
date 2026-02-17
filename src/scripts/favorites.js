import "/styles/main.css";

import RenderManager from "./modules/RenderManager";
import { loadHeaderFooter } from "./modules/utils";
import ExternalServices from "./modules/ExternalServices";
import FavoritesManager from "./modules/FavoritesManager";

loadHeaderFooter();

document.addEventListener("DOMContentLoaded", async () => {
  const favMan = new FavoritesManager();
  const favorites = favMan.getFavorites();

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

  favRender.renderGameList(999, 0);
});
