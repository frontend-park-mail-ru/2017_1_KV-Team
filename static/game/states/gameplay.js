/**
 * Created by andreivinogradov on 13.04.17.
 */
import Phaser from 'phaser';
import BasicPlayState from './basicPlayState';
import CardComponent from '../components/card';
import GridComponent from '../components/grid';

export default class GameplayState extends Phaser.State {
  init() {
    this.game.grid = new GridComponent(this, this.game.gameInfo.side, 0, 0);
    this.game.grid.hide();
    this.dragCard = {};
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
      new CardComponent(this, card, nextCardOffset);
      nextCardOffset += 100;
    });
  }

  update() {
    let graveyard = this.game.graveyard;
    graveyard.forEach(sprite => sprite.destroy());
    graveyard = [];


    if (this.dragCard.isDragging) {
      const grid = this.game.grid.getSquareGrid();
      grid.forEach((element) => {
        element.alpha = 0;
      });

      this.dragCard.group.forEach((cardElement) => {
        cardElement.position.copyFrom(this.dragCard.element.position);
      });
      const pointer = this.dragCard.group.children[1];
      if (!this.game.physics.arcade.overlap(pointer, grid, function (sprite, group) {
        group.alpha = 1;
      })) {
        console.log('they are not colliding!');
      }
    }
  }
}
