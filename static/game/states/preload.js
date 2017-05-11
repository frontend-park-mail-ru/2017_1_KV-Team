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
      font: '32px Arial', fill: '#ffffff', align: 'center',
    };
    this.text = this.add.text(400, 300, 'Loading: 0%', style);
    this.text.anchor.x = 0.5;
  }

  preload() {
    this.load.image('gamefield', 'game/assets/gamefield2.jpg');
    this.load.image('bottombar', 'game/assets/bottombar.jpg');
    this.load.image('button', 'game/assets/button.jpg');
    this.load.image('healthbar', 'game/assets/healthbar.png');
    this.load.image('wall', 'game/assets/castle_wall.jpg');
    this.load.image('castleTower', 'game/assets/castle_tower.png');
    this.load.image('triangle', 'game/assets/triangle.png');
    this.load.image('gridHighlight', 'game/assets/gridHighlight.png');
    this.load.image('popup', 'game/assets/popup.png');
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

    this.state.start('uiLoadState', true, false);
  }
}
