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

  card.classList.add("card");

  card.innerHTML = `
  <img src="${image}" />
  <h4 class="title">${title}</h4>
  <div class="details-container">
  <p class="platform">${platform}</p>
  <p class="price">${price}</p>
  </div>
  `;

  parent.appendChild(card);
}
