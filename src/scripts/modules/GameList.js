import Game from "./Game";

export default class GameList {
  constructor() {}

  renderList(list, parentElement, end = 999, start = 0) {
    list.slice(start, start + end).forEach((item) => {
      const game = new Game(item);
      game.createCard(parentElement);
    });
  }
}
