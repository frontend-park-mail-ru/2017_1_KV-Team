/**
 * Created by andreivinogradov on 13.04.17.
 */


export default class GameplayState {
  init() {
  }

  preload(cards) {
    cards.forEach((card) => {
      this.load.image(card.alias, card.url);
      this.load.image(`${card.alias}_unit`, card.unit);
    });
  }

  create () {

  }

  update () {

  }
}
