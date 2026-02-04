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

export function createCard(image, title, platform, price, parentElement) {
  const parent = parentElement;
  const card = document.createElement("div");

  card.innerHTML = `
  <img src="${image}" />
  <p>${title}</p>
  <p>${platform}</p>
  <p>${price}</p>
  `;

  parent.appendChild(card);
}
