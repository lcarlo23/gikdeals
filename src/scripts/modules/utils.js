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

  const pageTitle = document.getElementById("page-title");
  const nav = document.querySelectorAll("header nav a");

  navSelector(nav, pageTitle);

  const search = document.getElementById("search");

  search.addEventListener("focus", () => {
    search.classList.add("is-active");
  });
  search.addEventListener("blur", () => {
    search.classList.remove("is-active");
  });
}

export function navSelector(nav, pageTitle) {
  nav.forEach((link) => {
    if (pageTitle?.textContent === link.textContent)
      link.classList.add("is-active");
  });
}
