/**
 * Created by andreivinogradov on 04.05.17.
 */
import Unit from './unit';

export default class Grid {
  constructor(state, side, x, y) {
    this.createOneSquare = this.createOneSquare.bind(this);
    this.createOneGridRect = Grid.createOneGridRect.bind(this);
    const squareSize = (state.height - 220) / 4;
    const defenceGrid = state.add.group();
    const defenceGridRect = state.add.group();
    const attackGrid = state.add.group();
    const attackGridRect = state.add.group();

    Grid.squareCreator(
      0,
      70,
      squareSize,
      'down',
      4,
      state,
      this.createOneSquare,
      0).forEach((square) => {
        attackGrid.add(square);
      });

    Grid.squareCreator(
      0,
      70,
      squareSize,
      'down',
      4,
      state,
      this.createOneGridRect,
      0).forEach((square) => {
        attackGridRect.add(square);
      });

    const startDefendGridAt = state.width - (squareSize * 2) - 50;

    Grid.squareCreator(
      startDefendGridAt,
      70,
      squareSize,
      'down',
      4,
      state,
      this.createOneSquare,
      1).forEach((square) => {
        defenceGrid.add(square);
      });

    Grid.squareCreator(
      startDefendGridAt + squareSize,
      70,
      squareSize,
      'down',
      4,
      state,
      this.createOneSquare,
      2).forEach((square) => {
        defenceGrid.add(square);
      });

    Grid.squareCreator(
      startDefendGridAt,
      70,
      squareSize,
      'down',
      4,
      state,
      this.createOneGridRect,
      1).forEach((square) => {
        defenceGridRect.add(square);
      });

    Grid.squareCreator(
      startDefendGridAt + squareSize,
      70,
      squareSize,
      'down',
      4,
      state,
      this.createOneGridRect,
      2).forEach((square) => {
        defenceGridRect.add(square);
      });

    if (side === 'attack') {
      this.myGrid = attackGrid;
      this.myGridRect = attackGridRect;
      this.enemyGrid = defenceGrid;
      this.enemyGridRect = defenceGridRect;
    } else {
      this.myGrid = defenceGrid;
      this.myGridRect = defenceGridRect;
      this.enemyGrid = attackGrid;
      this.enemyGridRect = attackGridRect;
    }

    this.enemyGrid.visible = false;
    this.enemyGridRect.visible = false;

    this.squareSize = squareSize;
    this.state = state;
  }

  hide() {
    this.myGrid.visible = false;
    this.myGridRect.visible = false;
  }

  show() {
    this.myGrid.visible = true;
    this.myGridRect.visible = true;
  }

  getSquareGrid() {
    return this.myGrid;
  }

  createOneSquare(x, y, size, game, column, row) {
    const squareSprite = game.add.sprite(x, y, 'gridHighlight');
    squareSprite.width = size;
    squareSprite.height = size;
    squareSprite.inputEnabled = true;
    squareSprite.data.gridIndex = { x: column, y: row };
    squareSprite.spawnUnit = (key, enemy) => new Unit(
        this.state,
        squareSprite.centerX,
        squareSprite.centerY,
        squareSprite.height,
        key,
        enemy);
    game.physics.arcade.enable(squareSprite);
    return squareSprite;
  }

  findGridCell(x, y) {
    return this.enemyGrid.children.find(item =>
      item.data.gridIndex.x === x && item.data.gridIndex.y === y);
  }

  findEnemyRectCell(x, y) {
    return this.enemyGridRect.children.find(item =>
      item.data.gridIndex.x === x && item.data.gridIndex.y === y);
  }

  findRectCell(x, y) {
    return this.myGridRect.children.find((item) => {
      return item.data.gridIndex.x === x && item.data.gridIndex.y === y;
    });
  }

  static createOneGridRect(x, y, size, game, column, row) {
    const squareGraphics = game.add.graphics();
    squareGraphics.lineStyle(2, 0x0000FF, 1);
    squareGraphics.drawRect(x, y, size, size);
    squareGraphics.boundsPadding = 0;
    squareGraphics.data.gridIndex = { x: column, y: row };
    return squareGraphics;
  }

  static squareCreator(x, y, size, direction, times, game, func, column) {
    const squares = [];
    const xOffset = (direction === 'left') ? -size : direction === 'right' ? size : 0;
    const yOffset = (direction === 'down') ? size : direction === 'up' ? -size : 0;

    for (let i = 0; i < times; i += 1) {
      squares.push(func(x, y, size, game, column, i));
      x += xOffset;
      y += yOffset;
    }
    return squares;
  }
}
