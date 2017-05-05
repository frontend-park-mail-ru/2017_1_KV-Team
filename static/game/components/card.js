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
      const grid = state.grid;
      this.onStopDrag(currentSprite, state.grid.getSquareGrid());
      state.dragCard = {};
      grid.hide();
    }, this);

    cardSprite.events.onDragStart.add(function (currentSprite) {
      const grid = state.grid;

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
  }

  onDragStart() {
    this.state.grid.show();
  }

  onStopDrag(currentSprite, endSprite) {
    console.log('drag stopped');
    console.log(this);
    console.log(endSprite);

    const pointer = currentSprite.parent.children[1];
    const card = currentSprite.parent.children[0];
    if (!this.state.game.physics.arcade.overlap(pointer, endSprite, (sprite, group) => {
        const unit = this.state.add.sprite(group.x + 12, group.y + 12, `${card.key}_unit`);
        unit.width = 50;
        unit.height = 50;
        unit.data.alias = card.key;
        this.state.game.physics.arcade.enable(unit);
        this.state.game.gameInfo.me.units[card.key] = unit;
        // if (pointer.parent.data.side === 'attack') {
        //   this.state.game.gameInfo.me.nextRoundInfo.attackSide.cards.push({
        //     pos: {
        //       x: group.data.gridIndex.x,
        //       y: group.data.gridIndex.y,
        //     },
        //     alias: pointer.parent.data.alias,
        //   });
        // } else {
        //   this.game.mine.nextRoundInfo.defenceSide.cards.push({
        //     pos: {
        //       x: group.data.gridIndex.x,
        //       y: group.data.gridIndex.y,
        //     },
        //     alias: pointer.parent.data.alias,
        //   });
        // }
       this.state.game.graveyard.push(sprite.parent);
      })) {
      this.state.dragCard.group.forEach((cardElement) => {
        cardElement.position.copyFrom(cardElement.originalPosition);
      });
    }
  }
}

// export default function (state, card, offset) {
//   const cardGroup = state.add.group();
//
//   const cardSprite =
//     state.add.sprite((state.game.width / 2) + offset, state.game.height - 130, card.alias);
//   cardSprite.width = 100;
//   cardSprite.height = 125;
//   cardSprite.inputEnabled = true;
//   cardSprite.input.enableDrag(true);
//   cardSprite.originalPosition = cardSprite.position.clone();
//   state.game.physics.arcade.enable(cardSprite);
//
//   const redPointer = state.add.sprite((state.game.width / 2) + offset, state.game.height - 130, 'triangle');
//   redPointer.width = 25;
//   redPointer.height = 25;
//   redPointer.inputEnabled = true;
//   redPointer.input.enableDrag(true);
//   redPointer.originalPosition = redPointer.position.clone();
//   state.game.physics.arcade.enable(redPointer);
//
//   cardGroup.add(cardSprite);
//   cardGroup.add(redPointer);
//   cardGroup.data = {};
//   cardGroup.data.side = card.side;
//   cardGroup.data.alias = card.alias;
//   // cardSprite.events.onDragStop.add(function (currentSprite) {
//   //   const grid = currentSprite.parent.data.side === 'attack' ?
//   //     this.game.mine.attackGrid : this.game.mine.defendGrid;
//   //   stopDrag.call(this, currentSprite, grid);
//   //   this.game.mine.dragCard = {};
//   // }, this);
//   // cardSprite.events.onDragStart.add(function (currentSprite) {
//   //   this.game.mine.dragCard = {
//   //     isDragging: true,
//   //     group: cardGroup,
//   //     element: currentSprite,
//   //     side: currentSprite.parent.data.side,
//   //   };
//   //   if (currentSprite.parent.data.side === 'attack') {
//   //     this.game.mine.attackGrid.visible = true;
//   //     this.game.mine.attackGridRect.visible = true;
//   //   } else {
//   //     this.game.mine.defendGrid.visible = true;
//   //     this.game.mine.defendGridRect.visible = true;
//   //   }
//   // }, this);
//
//   // redPointer.events.onDragStop.add(function (currentSprite) {
//   //   const grid = currentSprite.parent.data.side === 'attack' ?
//   //     this.game.mine.attackGrid : this.game.mine.defendGrid;
//   //   stopDrag.call(this, currentSprite, grid);
//   //   this.game.mine.dragCard = {};
//   // }, this);
//   // redPointer.events.onDragStart.add(function (currentSprite) {
//   //   this.game.mine.dragCard = {
//   //     isDragging: true,
//   //     group: cardGroup,
//   //     element: currentSprite,
//   //     side: currentSprite.parent.data.side,
//   //   };
//   //   if (currentSprite.parent.data.side === 'attack') {
//   //     this.game.mine.attackGrid.visible = true;
//   //     this.game.mine.attackGridRect.visible = true;
//   //   } else {
//   //     this.game.mine.defendGrid.visible = true;
//   //     this.game.mine.defendGridRect.visible = true;
//   //   }
//   // }, this);
//   return cardGroup;
// }
