/**
 * Created by andreivinogradov on 13.04.17.
 */

import Phaser from 'phaser';
import endPopupComponent from '../components/endPopup';

export default class GameEndState extends Phaser.State {
  create() {
    endPopupComponent(this.game);
  }
}
