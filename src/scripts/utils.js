import ExternalServices from "./modules/ExternalServices";
import RenderManager from "./modules/RenderManager";

export async function loadTemplate(path) {
  const response = await fetch(path);
  const template = await response.text();
  return template;
}

export async function loadHeaderFooter() {
  const headerContainer = document.querySelector("header");
  const footerContainer = document.querySelector("footer");
  const header = await loadTemplate("/templates/header.html");
  const footer = await loadTemplate("/templates/footer.html");

  headerContainer.innerHTML = header;
  footerContainer.innerHTML = footer;
}
