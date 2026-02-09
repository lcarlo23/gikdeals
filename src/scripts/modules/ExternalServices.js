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
    const randomNumber = Math.floor(Math.random() * 16);
    const deals = await this.getDeals(15);
    return deals[randomNumber];
  }

  async getStoresList() {
    const stores = await this.getData(`${this.cheapSharkURL}stores`);
    return stores;
  }
}
