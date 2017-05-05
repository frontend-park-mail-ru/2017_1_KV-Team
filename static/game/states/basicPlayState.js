/**
 * Created by andreivinogradov on 03.05.17.
 */

import Phaser from 'phaser';
import battleFieldComponent from '../components/battleField';
import castleComponent from '../components/castle';
import descComponent from '../components/desc';
import topBarComponent from '../components/topBar';
import buttonComponent from '../components/button';
import healthbarComponent from '../components/healthbar';
import menuComponent from '../components/menu';

export default class BasicPlayState extends Phaser.State {
  init() {
    this.battleField = battleFieldComponent(this);
    console.log('from init: ' + this.battleField.height);
    this.castle = castleComponent(this);
    this.desc = descComponent(this);
    this.topBar = topBarComponent(this);
    this.menuButton = buttonComponent(
      this, 'Меню', this.game.width - 120, this.game.height - 60, 'button', this.showMenu);
    this.readyButton = buttonComponent(
      this, 'Готов', this.game.width - 120, this.game.height - 130, 'button', this.readyForNextRound);
    this.myHealthBar = healthbarComponent(this, this.game.gameInfo.me.nickname, 0, 25);
    this.enemyHealthBar =
      healthbarComponent(this, this.game.gameInfo.enemy.nickname, this.game.width - 310, 25);
    this.menu = menuComponent(this);
    this.menu.visible = false;
  }

  showMenu() {
    this.menu.visible = !this.menu.visible;
  }

  readyForNextRound() {

  }

  update() {
    let graveyard = this.game.graveyard;
    graveyard.forEach(sprite => sprite.destroy());
    graveyard = [];
  }

  preload(cards) {

  }

  create() {
    this.physics.startSystem(Phaser.Physics.ARCADE);
  }
}
