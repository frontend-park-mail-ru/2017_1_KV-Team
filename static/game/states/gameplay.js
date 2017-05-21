/**
 * Created by andreivinogradov on 13.04.17.
 */
import Phaser from 'phaser';
import BasicPlayState from './basicPlayState';
import CardComponent from '../components/card';
import GridComponent from '../components/grid';

export default class GameplayState extends Phaser.State {
  init(allowedCards) {
    this.game.grid = new GridComponent(this, this.game.gameInfo.side, 0, 0);
    this.game.grid.hide();
    this.dragCard = {};
    this.allowedCards = allowedCards;
  }

  preload() {
    console.log('hello from preload!');
    const cards = this.game.gameInfo.me.cards;
    this.currentCardsNumber = Object.keys(cards).length;

    this.allowedCards.forEach((card) => {
      cards[card.alias] = {
        alias: card.alias,
        side: this.game.gameInfo.side,
        url: this.game.cardsUrls[card.alias].url,
        unit: this.game.cardsUrls[card.alias].unit,
      };
    });

    Object.keys(cards).forEach((card) => {
      this.load.image(card, cards[card].url);
      this.load.image(`${card}_unit`, cards[card].unit);
    });
    console.log('hello from preload!');
  }

  create() {
    this.game.topBar.updateCounter();
    const cards = this.game.gameInfo.me.cards;

    let nextCardOffset = 120 * this.currentCardsNumber;
    Object.keys(cards).forEach((card) => {
      new CardComponent(this, cards[card], nextCardOffset);
      nextCardOffset += 120;
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
