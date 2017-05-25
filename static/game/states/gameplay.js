/**
 * Created by andreivinogradov on 13.04.17.
 */
import Phaser from 'phaser';
import CardComponent from '../components/card';

export default class GameplayState extends Phaser.State {
  init(allowedCards) {
    this.dragCard = {};
    this.allowedCards = allowedCards;
  }

  preload() {
    console.log('hello from preload!');

    this.allowedCards.forEach((card) => {
      this.load.image(card.alias, this.game.cardsUrls[card.alias].url);
      this.load.image(`${card.alias}_unit`, this.game.cardsUrls[card.alias].unit);
    });

    console.log('hello from preload!');
  }

  create() {
    this.game.topBar.updateCounter();
    const cards = this.game.gameInfo.me.cards;
    const currentCardsNumber = Object.keys(cards).length;

    let cardPos = this.game.width / 2;

    Object.keys(cards).forEach((key) => {
      cards[key].setCoord(cardPos);
      cardPos += 120;
    });

    let nextCardOffset = 120 * currentCardsNumber;

    this.allowedCards.forEach((card) => {
      console.log(card.side);
      cards[card.alias] = new CardComponent(this, {
        side: card.side,
        alias: card.alias,
      }, nextCardOffset);
      nextCardOffset += 120;
    });
  }

  update() {
    let graveyard = this.game.graveyard;
    graveyard.forEach(sprite => sprite.destroy());
    graveyard = [];

    this.game.world.bringToTop(this.game.menu);

    if (this.dragCard.isDragging) {
      const grid = this.game.grid.getSquareGrid();
      const enemyGrid = this.game.grid.getEnemiesSquareGrid();
      grid.forEach((element) => {
        element.alpha = 0;
      });
      enemyGrid.forEach((element) => {
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

      if (!this.game.physics.arcade.overlap(pointer, enemyGrid, function (sprite, group) {
          group.alpha = 1;
      })) {
        console.log('they are not colliding!');
      }
    }
  }
}
