import "/styles/main.css";

import RenderManager from "./modules/RenderManager";
import { loadHeaderFooter } from "./utils";

loadHeaderFooter();

document.addEventListener("DOMContentLoaded", async () => {
  const renderer = new RenderManager();

  await renderer.renderSearch();
});
