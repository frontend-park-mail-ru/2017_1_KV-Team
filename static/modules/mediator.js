/**
 * Created by andreivinogradov on 01.04.17.
 */
const Emitter = require('../emmiter/emitter.js');

class Mediator {
  constructor(game) {
    this.emitter = new Emitter(game);
  }

  on(message) {
  }

  emit(message) {
    console.log(message);
    switch (message.status) {
      case 'start':
        this.emitter.gameStart(message);
        break;
      case 'attack_win':
        this.emitter.lastRound(message);
        break;
      case 'defence_win':
        this.emitter.lastRound(message);
        break;
      default:
    }
  }

  off(message) {
    this.emitter.off(message);
  }
}

module.exports = Mediator;
