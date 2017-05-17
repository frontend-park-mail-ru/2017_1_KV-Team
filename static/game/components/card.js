/**
 * Created by andreivinogradov on 03.05.17.
 */
export default class Card {
  constructor(state, card, offset) {
    this.state = state;
    const cardGroup = state.add.group();

    const cardSprite =
      state.add.sprite((state.game.width / 2) + offset, state.game.height - 130, card.alias);
    cardSprite.width = 100;
    cardSprite.height = 125;
    cardSprite.inputEnabled = true;
    cardSprite.input.enableDrag(true);
    cardSprite.originalPosition = cardSprite.position.clone();
    state.game.physics.arcade.enable(cardSprite);

    cardSprite.events.onDragStop.add(function (currentSprite) {
      const grid = state.game.grid;
      this.onStopDrag(currentSprite, state.game.grid.getSquareGrid());
      state.dragCard = {};
      grid.hide();
    }, this);

    cardSprite.events.onDragStart.add(function (currentSprite) {
      const grid = state.game.grid;

      state.dragCard = {
        isDragging: true,
        group: cardGroup,
        element: currentSprite,
        side: currentSprite.parent.data.side,
      };
      grid.show();
    }, this);

    const redPointer = state.add.sprite((state.game.width / 2) + offset, state.game.height - 130, 'triangle');
    redPointer.width = 25;
    redPointer.height = 25;
    redPointer.inputEnabled = true;
    redPointer.input.enableDrag(true);
    redPointer.originalPosition = redPointer.position.clone();
    state.game.physics.arcade.enable(redPointer);

    cardGroup.add(cardSprite);
    cardGroup.add(redPointer);
    cardGroup.data = {};
    cardGroup.data.side = card.side;
    cardGroup.data.alias = card.alias;

    this.cardGroup = cardGroup;
    state.world.bringToTop(cardGroup);
  }

  onDragStart() {
    this.state.game.grid.show();
  }

  onStopDrag(currentSprite, endSprite) {
    console.log('drag stopped');
    console.log(this);
    console.log(endSprite);

    const pointer = currentSprite.parent.children[1];
    const card = currentSprite.parent.children[0];

    if (!this.state.game.physics.arcade.overlap(pointer, endSprite, (sprite, group) => {
      const unit = group.spawnUnit(card.key);
      unit.data.alias = card.key;
      this.state.game.physics.arcade.enable(unit);
      this.state.game.gameInfo.me.units[card.key] = unit;
      this.state.game.nextRoundInfo.cards.push({
        pos: {
          x: group.data.gridIndex.x,
          y: group.data.gridIndex.y,
        },
        alias: pointer.parent.data.alias,
      });
      this.state.game.graveyard.push(sprite.parent);
    })) {
      this.state.dragCard.group.forEach((cardElement) => {
        cardElement.position.copyFrom(cardElement.originalPosition);
      });
    }
  }
}
