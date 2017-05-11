/**
 * Created by andreivinogradov on 11.05.17.
 */

import Phaser from 'phaser';
import battleFieldComponent from '../components/battleField';
import castleComponent from '../components/castle';
import descComponent from '../components/desc';
import topBarComponent from '../components/topBar';
import buttonComponent from '../components/button';
import healthbarComponent from '../components/healthbar';
import menuComponent from '../components/menu';

export default class UILloadState extends Phaser.State {
  create() {
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.battleField = battleFieldComponent(this.game);
    this.game.castle = castleComponent(this.game);
    this.game.desc = descComponent(this.game);
    this.game.topBar = topBarComponent(this.game);
    this.game.menuButton = buttonComponent(
      this.game, 'Меню', this.game.width - 120, this.game.height - 60, 'button', this.showMenu.bind(this));
    this.game.readyButton = buttonComponent(
      this.game, 'Готов', this.game.width - 120, this.game.height - 130, 'button', this.readyForNextRound.bind(this));
    this.game.myHealthBar = healthbarComponent(this.game, this.game.gameInfo.me.nickname, 0, 25);
    this.game.enemyHealthBar =
      healthbarComponent(this.game, this.game.gameInfo.enemy.nickname, this.game.width - 310, 25);
    this.game.menu = menuComponent(this.game);
    this.game.menu.visible = false;
    this.state.start('gameplayState', false);
  }

  showMenu() {
    this.game.menu.visible = !this.game.menu.visible;
  }

  readyForNextRound() {
    this.game.gameSocket.send(this.game.nextRoundInfo);
  }
}
