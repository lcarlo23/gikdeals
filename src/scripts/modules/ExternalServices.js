export default class ExternalServices {
  constructor() {
    this.gamerPowerURL = "https://gamerpower.p.rapidapi.com/api/";
    this.cheapSharkURL = "https://www.cheapshark.com/api/1.0/";
    this.options = {
      method: "GET",
      headers: {
        "x-rapidapi-key": import.meta.env.VITE_RAPIDAPI_KEY,
        "x-rapidapi-host": "gamerpower.p.rapidapi.com",
      },
    };
  }

  async getData(url, options = undefined) {
    try {
      const response = await fetch(url, options);

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(error);
    }
  }

  async getGiveaways() {
    const giveaways = await this.getData(
      `${this.gamerPowerURL}giveaways`,
      this.options,
    );
    return giveaways;
  }

  async getDeals(limit = 60) {
    const deals = await this.getData(
      `${this.cheapSharkURL}deals?pageSize=${limit}`,
    );
    return deals;
  }

  async searchDeals(term) {
    const deals = await this.getData(
      `${this.cheapSharkURL}games?title=${term}`,
    );
    return deals;
  }

  async getRandomDeal() {
    const deals = await this.getDeals(10);

    if (!deals || deals.length === 0) return null;

    const randomNumber = Math.floor(Math.random() * deals.length);
    return deals[randomNumber];
  }

  async getStoresList() {
    const stores = await this.getData(`${this.cheapSharkURL}stores`);
    return stores;
  }

  async getGameById(id, giveaway = false) {
    let game;

    if (!giveaway) {
      game = await this.getData(`${this.cheapSharkURL}deals?id=${id}`);
    } else {
      game = await this.getData(
        `${this.gamerPowerURL}giveaway?id=${id}`,
        this.options,
      );
    }

    return game;
  }
}
