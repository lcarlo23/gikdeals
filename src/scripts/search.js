import "/styles/main.css";

import RenderManager from "./modules/RenderManager";
import { loadHeaderFooter } from "./utils";

loadHeaderFooter();

document.addEventListener("DOMContentLoaded", async () => {
  const render = new RenderManager();

  await render.renderSearch();
});
