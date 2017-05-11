/**
 * Created by andreivinogradov on 13.04.17.
 */

import Phaser from 'phaser';

export default class BootState extends Phaser.State {
  preload() {
    this.load.image('loadingScreenBackground', 'game/assets/gamefield2.jpg');
  }

  create() {
    const loadingScreenBackground = this.add.sprite(0, 0, 'loadingScreenBackground');
    loadingScreenBackground.width = 800;
    loadingScreenBackground.height = 550;
    this.state.start('preloadState');
  }
}
