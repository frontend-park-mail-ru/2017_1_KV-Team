/**
 * Created by andreivinogradov on 11.05.17.
 */

import Phaser from 'phaser';
import battleFieldComponent from '../components/battleField';
import CastleComponent from '../components/castle';
import descComponent from '../components/desc';
import TopBarComponent from '../components/topBar';
import buttonComponent from '../components/button';
import healthbarComponent from '../components/healthbar';
import GridComponent from '../components/grid';
import menuComponent from '../components/menu';

export default class UILloadState extends Phaser.State {
  create() {
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.battleField = battleFieldComponent(this.game);
    this.game.castle = new CastleComponent(this.game);
    this.game.desc = descComponent(this.game);
    this.game.topBar = new TopBarComponent(this.game);
    this.game.menuButton = buttonComponent(
      this.game, 'Меню', this.game.width - 120, this.game.height - 40, 'button', this.showMenu.bind(this));
    this.game.readyButton = buttonComponent(
      this.game, 'Готов', this.game.width - 120, this.game.height - 110, 'button', this.readyForNextRound.bind(this));
    this.game.myHealthBar = healthbarComponent(this.game, this.game.gameInfo.me.nickname, 0, 25);
    this.game.enemyHealthBar =
      healthbarComponent(this.game, this.game.gameInfo.enemy.nickname, this.game.width - 310, 25);
    this.game.grid = new GridComponent(this.game, this.game.gameInfo.side, 0, 0);
    this.game.menu = menuComponent(this.game);
    this.game.grid.hide();
    this.game.menu.visible = false;
    this.state.start('gameplayState', false, false, this.game.allowedCards);
  }

  showMenu() {
    this.game.menu.visible = !this.game.menu.visible;
  }

  readyForNextRound() {
    this.game.gameSocket.send(this.game.nextRoundInfo);
  }
}
