import { renderCards } from "./render";

export async function getData(url) {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}

export function createCard(image, title, platform, sale, price) {
  const card = document.createElement("div");

  card.classList.add("card");

  card.innerHTML = `
  <div class="img-container">
    <img src="${image}" />
  </div>
  <div class="description">
    <h4 class="title">${title}</h4>
    <div class="platform">
      <p>${platform}</p>
      <div class="price">
        <p class="sale">${sale}</p>
        <p class="normal-price">${price}</p>
      </div>
    </div>
  </div>
  `;

  return card;
}

export function cleanTitle(title) {
  return title.split(" (")[0];
}

export async function loadTemplate(path) {
  const response = await fetch(path);
  const template = await response.text();
  return template;
}

export async function getSearchData() {
  const params = new URLSearchParams(window.location.search);
  const term = params.get("term");
  const data = await getData(
    `https://www.cheapshark.com/api/1.0/games?title=${term}`,
  );

  return data;
}
