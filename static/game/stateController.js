/**
 * Created by andreivinogradov on 03.05.17.
 */

export default class StateController {
  constructor(game) {
    this.game = game;
  }

  startGameplayState() {
  }

  renderRound(data) {
    this.game.state.start('renderState', false, false, data);
  }

  startNextRound(data) {
    this.game.state.start('gameplayState', false, false, data.allowedCards);
  }
}
