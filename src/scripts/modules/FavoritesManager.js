export default class LocalStoreManager {
  constructor() {
    this.key = "favorites";
  }

  getFavorites() {
    const favorites = localStorage.getItem(this.key);
    return favorites ? JSON.parse(favorites) : [];
  }

  toggleFavorites(game) {
    let favorites = this.getFavorites();

    const id = this.checkID(game, favorites);

    if (id === -1) {
      favorites.push(game);
    } else {
      favorites.splice(id, 1);
    }

    localStorage.setItem(this.key, JSON.stringify(favorites));
  }

  isFavorite(game) {
    const favorites = this.getFavorites();

    const id = this.checkID(game, favorites);

    return id !== -1;
  }

  checkID(game, favorites) {
    const gameID = game.gameID || game.gameInfo?.gameID;
    const id = game.id;

    return favorites.findIndex((fav) => {
      const favGame = fav.gameID || fav.gameInfo?.gameID;
      const favId = fav.id;

      const matchGame = gameID && favGame && gameID === favGame;
      const matchId = id && favId && id === favId;

      return matchGame || matchId;
    });
  }
}
