/**
 * Created by andreivinogradov on 03.05.17.
 */

export default function (state, card, offset) {
  const cardGroup = state.add.group();

  const cardSprite =
    state.add.sprite((state.game.width / 2) + offset, state.game.height - 130, card.alias);
  cardSprite.width = 100;
  cardSprite.height = 125;
  cardSprite.inputEnabled = true;
  cardSprite.input.enableDrag(true);
  cardSprite.originalPosition = cardSprite.position.clone();
  state.game.physics.arcade.enable(cardSprite);

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
  // cardSprite.events.onDragStop.add(function (currentSprite) {
  //   const grid = currentSprite.parent.data.side === 'attack' ?
  //     this.game.mine.attackGrid : this.game.mine.defendGrid;
  //   stopDrag.call(this, currentSprite, grid);
  //   this.game.mine.dragCard = {};
  // }, this);
  // cardSprite.events.onDragStart.add(function (currentSprite) {
  //   this.game.mine.dragCard = {
  //     isDragging: true,
  //     group: cardGroup,
  //     element: currentSprite,
  //     side: currentSprite.parent.data.side,
  //   };
  //   if (currentSprite.parent.data.side === 'attack') {
  //     this.game.mine.attackGrid.visible = true;
  //     this.game.mine.attackGridRect.visible = true;
  //   } else {
  //     this.game.mine.defendGrid.visible = true;
  //     this.game.mine.defendGridRect.visible = true;
  //   }
  // }, this);

  // redPointer.events.onDragStop.add(function (currentSprite) {
  //   const grid = currentSprite.parent.data.side === 'attack' ?
  //     this.game.mine.attackGrid : this.game.mine.defendGrid;
  //   stopDrag.call(this, currentSprite, grid);
  //   this.game.mine.dragCard = {};
  // }, this);
  // redPointer.events.onDragStart.add(function (currentSprite) {
  //   this.game.mine.dragCard = {
  //     isDragging: true,
  //     group: cardGroup,
  //     element: currentSprite,
  //     side: currentSprite.parent.data.side,
  //   };
  //   if (currentSprite.parent.data.side === 'attack') {
  //     this.game.mine.attackGrid.visible = true;
  //     this.game.mine.attackGridRect.visible = true;
  //   } else {
  //     this.game.mine.defendGrid.visible = true;
  //     this.game.mine.defendGridRect.visible = true;
  //   }
  // }, this);
  return cardGroup;
}
