/**
 * Created by andreivinogradov on 03.05.17.
 */
export default class Card {
  constructor(state, card, offset) {
    this.state = state;
    const cardGroup = state.add.group();
    cardGroup.data = {};
    cardGroup.data.side = card.side;
    cardGroup.data.alias = card.alias;
    const grid = state.game.grid;
    let showFunction;
    let getSquareGrid;
    if (state.game.mode === 'single') {
      showFunction = card.side === 'DEFENDER' ? grid.show.bind(grid) : grid.showEnemies.bind(grid);
      getSquareGrid = card.side === 'DEFENDER' ? grid.getSquareGrid.bind(grid) : grid.getEnemiesSquareGrid.bind(grid);
    } else {
      showFunction = grid.show.bind(grid);
      getSquareGrid = grid.getSquareGrid.bind(grid);
    }


    const cardSprite =
      state.add.sprite((state.game.width / 2) + offset, state.game.height - 130, card.alias);
    cardGroup.add(cardSprite);
    cardSprite.width = 100;
    cardSprite.height = 125;
    cardSprite.inputEnabled = true;
    cardSprite.input.enableDrag(true);
    cardSprite.originalPosition = cardSprite.position.clone();
    state.game.physics.arcade.enable(cardSprite);

    cardSprite.events.onDragStop.add(function (currentSprite) {
      this.onStopDrag(currentSprite, getSquareGrid());
      state.dragCard = {};
      grid.hide();
    }, this);

    cardSprite.events.onDragStart.add(function (currentSprite) {
      state.dragCard = {
        isDragging: true,
        group: cardGroup,
        element: currentSprite,
        side: currentSprite.parent.data.side,
      };
      showFunction();
    }, this);

    const redPointer = state.add.sprite((state.game.width / 2) + offset, state.game.height - 130, 'triangle');
    cardGroup.add(redPointer);
    redPointer.width = 25;
    redPointer.height = 25;
    redPointer.inputEnabled = true;
    redPointer.input.enableDrag(true);
    redPointer.originalPosition = redPointer.position.clone();
    state.game.physics.arcade.enable(redPointer);

    redPointer.events.onDragStop.add(function (currentSprite) {
      this.onStopDrag(currentSprite, getSquareGrid());
      state.dragCard = {};
      grid.hide();
    }, this);

    redPointer.events.onDragStart.add(function (currentSprite) {
      state.dragCard = {
        isDragging: true,
        group: cardGroup,
        element: currentSprite,
        side: currentSprite.parent.data.side,
      };
      showFunction();
    }, this);

    this.cardGroup = cardGroup;
    state.world.bringToTop(cardGroup);
  }

  getCardGroup() {
    return this.cardGroup;
  }

  setCoord(x, y = this.state.game.height - 130) {
    this.cardGroup.children.forEach((element) => {
      element.x = x;
      element.y = y;
      element.originalPosition = element.position.clone();
    });
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
      const { x, y } = group.data.gridIndex;
      const unit = group.spawnUnit(card.key);
      const rectCell = this.state.game.grid.findRectCell(x, y);
      unit.setBornPlace(group, rectCell);
      group.kill();
      rectCell.kill();
      this.state.game.physics.arcade.enable(unit.getUnitSprite());

      if (this.state.game.mode === 'multi' || sprite.parent.data.side === 'DEFENDER') {
        this.state.game.gameInfo.me.units[card.key] = unit;
        if (this.state.game.mode === 'multi') {
          this.state.game.nextRoundInfo.cards.push({
            pos: { x, y },
            alias: pointer.parent.data.alias,
          });
        } else {
          this.state.game.nextRoundInfoSingle.defence.cards.push({
            pos: { x, y },
            alias: pointer.parent.data.alias,
          });
        }
      } else {
        this.state.game.gameInfo.me.units[card.key] = unit;
        this.state.game.nextRoundInfoSingle.attack.cards.push({
          pos: { x, y },
          alias: pointer.parent.data.alias,
        });
      }
      console.log('---------------');
      console.log(card.key);
      console.log(this.state.game.gameInfo.me.units);
      this.state.game.nextRoundInfo.cards.push({
        pos: { x, y },
        alias: pointer.parent.data.alias,
      });
      this.state.game.graveyard.push(sprite.parent);
      delete this.state.game.gameInfo.me.cards[card.key];
    })) {
      this.state.dragCard.group.forEach((cardElement) => {
        cardElement.position.copyFrom(cardElement.originalPosition);
      });
    }
  }
}
