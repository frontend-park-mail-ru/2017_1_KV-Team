/**
 * Created by andreivinogradov on 13.04.17.
 */
import Phaser from 'phaser';

export default class PreloadState extends Phaser.State {
  init() {
    const box = this.make.graphics(0, 0);
    box.lineStyle(8, 0xFF0000, 0.8);
    box.beginFill(0xFF700B, 1);
    box.drawRect(-50, -50, 100, 100);
    box.endFill();
    this.spinner = this.add.sprite(this.world.centerX, this.world.centerY, box.generateTexture());
    this.spinner.anchor.set(0.5);
    const style = {
      font: '32px Arial', fill: '#ffffff', align: 'center' };
    this.text = this.add.text(400, 300, 'Loading: 0%', style); this.text.anchor.x = 0.5;
  }

  preload() {
    this.game.load.image('gamefield', '../assets/gamefield2.jpg');
    this.game.load.image('bottombar', '../assets/bottombar.jpg');
    this.game.load.image('button', '../assets/button.jpg');
    this.game.load.image('healthbar', '../assets/healthbar.png');
    this.game.load.image('wall', '../assets/castle_wall.jpg');
    this.game.load.image('castleTower', '../assets/castle_tower.png');
    this.game.load.image('triangle', '../assets/triangle.png');
    this.game.load.image('gridHighlight', '../assets/gridHighlight.png');
    this.game.load.image('popup', '../assets/popup.png');
    this.load.onFileComplete.add(this.fileLoaded, this);
  }

  fileLoaded(progress) {
    this.text.text = `Loading ${progress}%`;
  }

  loadUpdate() {
    this.spinner.rotation += 0.05;
  }

  create() {
    this.add.tween(this.spinner.scale).to(
      { x: 0, y: 0 }, 1000, 'Elastic.easeIn', true, 250);
    this.add.tween(this.text).to(
      { alpha: 0 }, 1000, 'Linear', true);
    // this.state.start('GameplayState');
  }
}
