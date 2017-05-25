/**
 * Created by andreivinogradov on 01.04.17.
 */
import Emitter from '../emmiter/emitter';

export default class Mediator {
  constructor(game) {
    this.emitter = new Emitter(game);
    game.emitter = this.emitter;
    console.log(game);
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
      case 'defence_win':
      case 'continous':
        this.emitter.renderRound(message);
        break;
      case 'cards':
        this.emitter.nextRound(message);
        break;
      default:
    }
  }

  off(message) {
    this.emitter.off(message);
  }
}
