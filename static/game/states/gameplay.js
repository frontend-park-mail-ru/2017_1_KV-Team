/**
 * Created by andreivinogradov on 13.04.17.
 */
import Phaser from 'phaser';
import BasicPlayState from './basicPlayState';
import cardComponent from '../components/card';

export default class GameplayState extends BasicPlayState {
  init() {
    super.init();
  }

  preload() {
    const cards = this.game.gameInfo.me.cards;
    cards.forEach((card) => {
      this.load.image(card.alias, card.url);
      this.load.image(`${card.alias}_unit`, card.unit);
    });
  }

  create() {
    const cards = this.game.gameInfo.me.cards;
    let nextCardOffset = 0;
    cards.forEach((card) => {
      cardComponent(this, card, nextCardOffset);
      nextCardOffset += 100;
    });
  }

  update() {
    super.update();

  }
}
