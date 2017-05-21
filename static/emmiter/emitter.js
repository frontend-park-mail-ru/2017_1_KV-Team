/**
 * Created by andreivinogradov on 01.04.17.
 */

export default class Emitter {
  constructor(game) {
    this.game = game;
  }

  on(message) {
    console.log(message);
  }

  gameStart(message) {
    this.game.app.enablePlayLink();
    this.game.app.router.route('play');
    this.game.init(message);
  }

  lastRound(message) {
    console.log(message);
    console.log('AFTER PARSE');
    this.game.gameInstance.myStateController.renderRound(message);
  }

  renderRound(message) {
    console.log(message);
    this.game.gameInstance.myStateController.renderRound(message);
  }

  nextRound(message) {
    console.log(message);
    this.game.gameInstance.myStateController.startNextRound(message);
  }

  emit(status, data) {
    console.log(message);
  }

  off(message) {
    console.log(message);
  }
}
