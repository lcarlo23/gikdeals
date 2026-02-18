import "/styles/main.css";

import RenderManager from "./modules/RenderManager";
import { loadHeaderFooter, saveSearch } from "./modules/utils";
import ExternalServices from "./modules/ExternalServices";

loadHeaderFooter();

document.addEventListener("DOMContentLoaded", async () => {
  document.body.classList.add("is-loading");
  const params = new URLSearchParams(window.location.search);
  const term = params.get("term").replace("+", " ").toUpperCase();
  const titleElement = document.getElementById("page-title");
  const container = document.getElementById("deals");

  saveSearch(term);

  titleElement.textContent = term;

  const api = new ExternalServices();
  const list = await api.getDeals(999, `&title=${term}`);
  const storeList = await api.getStoresList();

  const searchRender = new RenderManager(
    list,
    storeList,
    container,
    true,
    true,
    true,
  );

  searchRender.renderGameList();

  document.body.classList.remove("is-loading");
});
