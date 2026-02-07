export default class Store {
  constructor(data) {
    this.data = data;
    this.cheapSharkURL = "https://www.cheapshark.com";
  }

  getLogo() {
    return `${this.cheapSharkURL}${this.data.images.logo}`;
  }

  getIcon() {
    return `${this.cheapSharkURL}${this.data.images.icon}`;
  }

  getBanner() {
    return `${this.cheapSharkURL}${this.data.images.banner}`;
  }

  getName() {
    return this.data.storeName;
  }
}
