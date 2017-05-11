/**
 * Created by andreivinogradov on 03.05.17.
 */

export default class StateController {
  constructor(game) {
    this.game = game;
  }

  startGameplayState() {
  }

  startNextRound(data) {
    this.game.state.start('renderState', false, false, data);
  }
}
