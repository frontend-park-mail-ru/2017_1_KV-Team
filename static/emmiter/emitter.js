/**
 * Created by andreivinogradov on 01.04.17.
 */

class Emitter {
  constructor(game) {
    this.game = game;
  }

  on(message) {
    console.log(message);
  }

  gameStart(message) {
    this.game.init(message);
  }

  lastRound(message) {
    this.game.startLastRound(message);
  }

  emit(message) {
    console.log(message);
  }

  off(message) {
    console.log(message);
  }
}

module.exports = Emitter;
