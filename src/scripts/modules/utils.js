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
  const recent = document.getElementById("recent-search");

  search.addEventListener("focusin", () => {
    search.classList.add("is-active");
    recentSearches(recent);
  });
  search.addEventListener("focusout", () => {
    search.classList.remove("is-active");
    recent.classList.remove("is-active");
  });
}

export function saveSearch(term) {
  const searches = getSearch();

  if (searches.includes(term)) return;

  searches.unshift(term);

  if (searches.length > 5) searches.pop();

  localStorage.setItem("searches", JSON.stringify(searches));
}

function navSelector(nav, pageTitle) {
  nav.forEach((link) => {
    if (pageTitle?.textContent === link.textContent)
      link.classList.add("is-active");
  });
}

export function getSearch() {
  const searches = localStorage.getItem("searches");
  return searches ? JSON.parse(searches) : [];
}

export function recentSearches(element) {
  const list = element.querySelector(".list");
  list.replaceChildren();
  const searches = getSearch();

  if (searches.length === 0) {
    list.innerHTML = "<p>No recent searches available</p>";
  } else {
    searches.forEach((search) => {
      const btn = document.createElement("button");
      btn.textContent = search.toLowerCase();

      btn.addEventListener("mousedown", () => {
        window.location.href = `/search/?term=${encodeURIComponent(search)}`;
      });

      list.appendChild(btn);
    });
  }

  element.classList.add("is-active");
}

export function getViewed() {
  const viewed = localStorage.getItem("viewed");
  return viewed ? JSON.parse(viewed) : [];
}

export function saveViewed(card) {
  const viewed = getViewed();

  if (viewed.includes(card)) return;

  viewed.push(card);

  localStorage.setItem("viewed", JSON.stringify(viewed));
}

export function isViewed(id) {
  const viewed = getViewed();

  return viewed.includes(String(id));
}
