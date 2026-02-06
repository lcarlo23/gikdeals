export async function getData(url, rapidapi = false) {
  const options = {
    method: "GET",
    headers: {
      "x-rapidapi-key": import.meta.env.VITE_RAPIDAPI_KEY,
      "x-rapidapi-host": "gamerpower.p.rapidapi.com",
    },
  };

  try {
    const response = rapidapi ? await fetch(url, options) : await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}

export async function createCard(image, title, platform, sale, price) {
  const template = await loadTemplate("/templates/card.html");
  const card = document.createElement("div");

  card.classList.add("card");

  const cardContent = template
    .replace("{{img-bg}}", image)
    .replace("{{cover}}", image)
    .replace("{{title}}", title)
    .replace("{{platform}}", platform)
    .replace("{{sale}}", sale)
    .replace("{{price}}", price);

  card.innerHTML = cardContent;
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
