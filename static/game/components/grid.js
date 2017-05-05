/**
 * Created by andreivinogradov on 04.05.17.
 */


export default class Grid {
  constructor(state, side, x, y) {
    this.createOneSquare = this.createOneSquare.bind(this);
    this.createOneGridRect = Grid.createOneGridRect.bind(this);
    const squareSize = (state.game.height - 220) / 4;
    const grid = state.add.group();
    const gridRect = state.add.group();

    console.log('from Grid: ' + squareSize);

    if (side === 'attack') {
      Grid.squareCreator(
        0,
        70,
        squareSize,
        'down',
        4,
        state,
        this.createOneSquare,
        0).forEach((square) => {
          grid.add(square);
        });

      Grid.squareCreator(
        0,
        70,
        squareSize,
        'down',
        4,
        state,
        this.createOneGridRect).forEach((square) => {
          gridRect.add(square);
        });
    } else {
      const startDefendGridAt = state.game.width - (squareSize * 2) - 50;

      Grid.squareCreator(
        startDefendGridAt,
        70,
        squareSize,
        'down',
        4,
        state,
        this.createOneSquare,
        1).forEach((square) => {
          grid.add(square);
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
          grid.add(square);
        });

      Grid.squareCreator(
        startDefendGridAt,
        70,
        squareSize,
        'down',
        4,
        state,
        this.createOneGridRect).forEach((square) => {
          gridRect.add(square);
        });

      Grid.squareCreator(
        startDefendGridAt + squareSize,
        70,
        squareSize,
        'down',
        4,
        state,
        this.createOneGridRect).forEach((square) => {
          gridRect.add(square);
        });
    }

    this.grid = grid;
    this.gridRect = gridRect;
  }

  hide() {
    this.grid.visible = false;
    this.gridRect.visible = false;
  }

  show() {
    this.grid.visible = true;
    this.gridRect.visible = true;
  }

  getSquareGrid() {
    return this.grid;
  }

  createOneSquare(x, y, size, game, column, row) {
    const squareSprite = game.add.sprite(x, y, 'gridHighlight');
    squareSprite.width = size;
    squareSprite.height = size;
    squareSprite.inputEnabled = true;
    squareSprite.data.gridIndex = { x: column, y: row };
    squareSprite.events.onInputOver.add(Grid.overGrid, this);
    squareSprite.events.onInputOut.add(Grid.outGrid, this);
    game.physics.arcade.enable(squareSprite);
    return squareSprite;
  }

  static createOneGridRect(x, y, size, game) {
    const squareGraphics = game.add.graphics();
    squareGraphics.lineStyle(2, 0x0000FF, 1);
    squareGraphics.drawRect(x, y, size, size);
    squareGraphics.boundsPadding = 0;
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

  static overGrid() {
    console.log('over grid');
  }

  static outGrid() {
    console.log('out grid');
  }
}
