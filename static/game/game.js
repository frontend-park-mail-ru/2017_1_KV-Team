/**
 * Created by andreivinogradov on 01.04.17.
 */
import 'pixi';
import 'p2';
import Phaser from 'phaser';
import BootState from './states/boot';
import PreloadState from './states/preload';
import Chat from '../components/chat/chat';
import Transport from '../transports/transport';


class GameMy extends Phaser.Game {
  constructor() {
    super('100%', '100%', Phaser.AUTO, 'game');

    this.state.add('bootState', BootState, false);
    this.state.add('preloadState', PreloadState, false);

    this.state.start('bootState');
  }

}

function overGrid() {
  console.log('over grid');
}

function outGrid() {
  console.log('out grid');
}

function renderComplete() {
  const menu = this.add.sprite(400, 200, 'popup');
  menu.anchor.setTo(0.5, 0.5);

  const label = this.add.text(400, 200, 'Игра окончена', { font: '30px Arial', fill: '#000' });
  label.anchor.setTo(0.5, 0.5);

  this.mine.transport.defenceSocket.send(this.mine.renderCompleteInfo);
  this.mine.transport.attackSocket.send(this.mine.renderCompleteInfo);
}

function tweenTint(spriteToTween, startColor, endColor, duration, offset) {
  const colorBlend = { step: 0 };

  return this.add.tween(colorBlend).to({ step: 100 }, duration, Phaser.Easing.Default, false, offset)
    .onUpdateCallback(() => {
      spriteToTween.tint = Phaser.Color.interpolateColor(startColor, endColor, 100, colorBlend.step, 1);
    })
    .start();
};

function renderAction(action, longestAction) {
  const unit = this.mine.units[action.unitID];
  const time = action.timeOffsetEnd - action.timeOffsetBegin;

  let tween;
  switch (action.actiontType) {
    case 'move':
      const x = (this.width - 100) * action.actionParameters.distance;
      tween = this.add.tween(unit).to({ x }, time, null, true, action.timeOffsetBegin);
      break;
    case 'attack':
      tweenTint.call(this, unit, 0xffffff, 0x0000ff, time / 2, action.timeOffsetBegin);
      tween = tweenTint.call(this, unit, 0x0000ff, 0xffffff, time / 2, action.timeOffsetBegin + time / 2);
      break;
    case 'die':
      tween = this.add.tween(unit).to({ alpha: 0.1 }, time, null, true, action.timeOffsetBegin);
      tween.onComplete.add(function () {
        unit.destroy();
        delete this.mine.units[action.unitID];
      }, this);
      break;
    default:
  }

  if (action.timeOffsetEnd === longestAction) {
    tween.onComplete.add(renderComplete, this);
  }
}

function startDrag() {
  console.log('drag started');
  console.log(this);
  this.game.mine.attackGrid.visible = true;
}

function stopDrag(currentSprite, endSprite) {
  console.log('drag stopped');
  console.log(this);
  console.log(endSprite);

  const pointer = currentSprite.parent.children[1];
  const card = currentSprite.parent.children[0];
  if (!this.game.physics.arcade.overlap(pointer, endSprite, (sprite, group) => {
    const unit = this.game.add.sprite(group.x + 12, group.y + 12, `${card.key}_unit`);
    unit.width = 50;
    unit.height = 50;
    unit.data.alias = card.key;
    this.game.physics.arcade.enable(unit);
    this.game.mine.units[card.key] = unit;
    if (pointer.parent.data.side === 'attack') {
      this.game.mine.nextRoundInfo.attackSide.cards.push({
        pos: {
          x: group.data.gridIndex.x,
          y: group.data.gridIndex.y,
        },
        alias: pointer.parent.data.alias,
      });
    } else {
      this.game.mine.nextRoundInfo.defenceSide.cards.push({
        pos: {
          x: group.data.gridIndex.x,
          y: group.data.gridIndex.y,
        },
        alias: pointer.parent.data.alias,
      });
    }
    this.game.mine.graveyard.push(sprite.parent);
  })) {
    this.game.mine.dragCard.group.forEach((cardElement) => {
      cardElement.position.copyFrom(cardElement.originalPosition);
    });
  }

  this.game.mine.attackGrid.visible = false;
  this.game.mine.defendGrid.visible = false;
  this.game.mine.attackGridRect.visible = false;
  this.game.mine.defendGridRect.visible = false;
}

function readyForNextRound() {
  console.log('ready for next round!');
  this.game.mine.transport.defenceSocket.send(this.game.mine.nextRoundInfo.defenceSide);
  this.game.mine.transport.attackSocket.send(this.game.mine.nextRoundInfo.attackSide);
}

function showMenu() {
  console.log('menu shown!');
}

function createOneGridRect(x, y, size, game) {
  const squareGraphics = game.add.graphics();
  squareGraphics.lineStyle(2, 0x0000FF, 1);
  squareGraphics.drawRect(x, y, size, size);
  squareGraphics.boundsPadding = 0;
  return squareGraphics;
}

function createOneSquare(x, y, size, game, column, row) {
  const squareSprite = game.add.sprite(x, y, 'gridHighlight');
  squareSprite.width = size;
  squareSprite.height = size;
  squareSprite.inputEnabled = true;
  squareSprite.data.gridIndex = { x: column, y: row };
  squareSprite.events.onInputOver.add(overGrid, this);
  squareSprite.events.onInputOut.add(outGrid, this);
  game.physics.arcade.enable(squareSprite);
  return squareSprite;
}

function squareCreator(x, y, size, direction, times, game, func, column) {
  const squares = [];
  const xOffset = direction === 'left' ? -size : direction === 'right' ? size : 0;
  const yOffset = direction === 'down' ? size : direction === 'up' ? -size : 0;

  for (let i = 0; i < times; i++) {
    squares.push(func(x, y, size, game, column, i));
    x += xOffset;
    y += yOffset;
  }
  return squares;
}

function preload() {
  this.game.load.image('gamefield', 'assets/gamefield2.jpg');
  this.game.load.image('bottombar', 'assets/bottombar.jpg');
  this.game.load.image('button', 'assets/button.jpg');
  this.game.load.image('healthbar', 'assets/healthbar.png');
  this.game.load.image('wall', 'assets/castle_wall.jpg');
  this.game.load.image('castleTower', 'assets/castle_tower.png');
  this.game.load.image('triangle', 'assets/triangle.png');
  this.game.load.image('gridHighlight', 'assets/gridHighlight.png');
  this.game.load.image('popup', 'assets/popup.png');

  this.game.mine.cards.forEach((card) => {
    this.game.load.image(card.alias, card.url);
    this.game.load.image(`${card.alias}_unit`, card.unit);
  });
}

function create() {
  this.game.physics.startSystem(Phaser.Physics.ARCADE);
  const container = document.querySelector('.game');

  const gamefield = this.game.add.sprite(0, 70, 'gamefield');
  this.game.physics.arcade.enable(gamefield);
  const wall = this.game.add.sprite(750, 70, 'wall');
  const castleTowerTop = this.game.add.sprite(750, 75, 'castleTower');
  const castleTowerBot = this.game.add.sprite(750, 310, 'castleTower');
  const bottombar = this.game.add.sprite(0, 370, 'bottombar');
  const topbar = this.game.add.sprite(0, 0, 'bottombar');
  const menuButton = this.game.add.button(670, 460, 'button', showMenu, this, 2, 1, 0);
  const readyButton = this.game.add.button(670, 390, 'button', readyForNextRound, this, 2, 1, 0);
  // readyButton.onInputOver.add(over, this);
  // readyButton.onInputOut.add(out, this);
  // readyButton.onInputUp.add(up, this);

  this.game.mine.attackGrid = this.game.add.group();
  squareCreator(0, 70, 75, 'down', 4, this.game, createOneSquare, 0).forEach((square) => {
    this.game.mine.attackGrid.add(square);
  });

  this.game.mine.attackGridRect = this.game.add.group();
  squareCreator(0, 70, 75, 'down', 4, this.game, createOneGridRect).forEach((square) => {
    this.game.mine.attackGridRect.add(square);
  });

  this.game.mine.defendGrid = this.game.add.group();
  squareCreator(600, 70, 75, 'down', 4, this.game, createOneSquare, 1).forEach((square) => {
    this.game.mine.defendGrid.add(square);
  });
  squareCreator(675, 70, 75, 'down', 4, this.game, createOneSquare, 2).forEach((square) => {
    this.game.mine.defendGrid.add(square);
  });

  this.game.mine.defendGridRect = this.game.add.group();
  squareCreator(600, 70, 75, 'down', 4, this.game, createOneGridRect).forEach((square) => {
    this.game.mine.defendGridRect.add(square);
  });
  squareCreator(675, 70, 75, 'down', 4, this.game, createOneGridRect).forEach((square) => {
    this.game.mine.defendGridRect.add(square);
  });

  this.game.mine.attackGrid.visible = false;
  this.game.mine.defendGrid.visible = false;
  this.game.mine.attackGridRect.visible = false;
  this.game.mine.defendGridRect.visible = false;

  const myHealthBar = this.game.add.sprite(0, 20, 'healthbar');
  const enemyHealthBar = this.game.add.sprite(500, 20, 'healthbar');

  let nextCardOffset = 0;
  this.game.mine.cards.forEach((card) => {
    const cardGroup = this.game.add.group();

    const cardSprite = this.game.add.sprite(350 + nextCardOffset, 390, card.alias);
    cardSprite.width = 100;
    cardSprite.height = 125;
    cardSprite.inputEnabled = true;
    cardSprite.input.enableDrag(true);
    cardSprite.originalPosition = cardSprite.position.clone();
    this.game.physics.arcade.enable(cardSprite);

    const redPointer = this.game.add.sprite(350 + nextCardOffset, 390, 'triangle');
    redPointer.width = 25;
    redPointer.height = 25;
    redPointer.inputEnabled = true;
    redPointer.input.enableDrag(true);
    redPointer.originalPosition = redPointer.position.clone();
    this.game.physics.arcade.enable(redPointer);

    cardGroup.add(cardSprite);
    cardGroup.add(redPointer);
    cardGroup.data = {};
    cardGroup.data.side = card.side;
    cardGroup.data.alias = card.alias;
    cardSprite.events.onDragStop.add(function (currentSprite) {
      const grid = currentSprite.parent.data.side === 'attack' ?
        this.game.mine.attackGrid : this.game.mine.defendGrid;
      stopDrag.call(this, currentSprite, grid);
      this.game.mine.dragCard = {};
    }, this);
    cardSprite.events.onDragStart.add(function (currentSprite) {
      this.game.mine.dragCard = {
        isDragging: true,
        group: cardGroup,
        element: currentSprite,
        side: currentSprite.parent.data.side,
      };
      if (currentSprite.parent.data.side === 'attack') {
        this.game.mine.attackGrid.visible = true;
        this.game.mine.attackGridRect.visible = true;
      } else {
        this.game.mine.defendGrid.visible = true;
        this.game.mine.defendGridRect.visible = true;
      }
    }, this);

    redPointer.events.onDragStop.add(function (currentSprite) {
      const grid = currentSprite.parent.data.side === 'attack' ?
        this.game.mine.attackGrid : this.game.mine.defendGrid;
      stopDrag.call(this, currentSprite, grid);
      this.game.mine.dragCard = {};
    }, this);
    redPointer.events.onDragStart.add(function (currentSprite) {
      this.game.mine.dragCard = {
        isDragging: true,
        group: cardGroup,
        element: currentSprite,
        side: currentSprite.parent.data.side,
      };
      if (currentSprite.parent.data.side === 'attack') {
        this.game.mine.attackGrid.visible = true;
        this.game.mine.attackGridRect.visible = true;
      } else {
        this.game.mine.defendGrid.visible = true;
        this.game.mine.defendGridRect.visible = true;
      }
    }, this);

    nextCardOffset += 100;
  });

  castleTowerTop.width = 50;
  castleTowerTop.height = 50;
  castleTowerBot.width = 50;
  castleTowerBot.height = 50;
  myHealthBar.width = 300;
  myHealthBar.height = 40;
  enemyHealthBar.width = 300;
  enemyHealthBar.height = 40;

  const style = {
    font: '20px Fira Sans',
    fill: '#fff',
    boundsAlignH: 'center',
    boundsAlignV: 'middle',
  };
  const menuText = this.game.add.text(0, 0, 'Меню', style);
  menuText.setTextBounds(670, 464, 100, 40);
  const readyText = this.game.add.text(0, 0, 'Готов', style);
  readyText.setTextBounds(670, 392, 100, 40);

  const counterText = this.game.add.text(400, 20, '1', Object.assign({}, style, {
    font: '30px Fira Sans',
  }));

  const myUsername = this.game.add.text(118, 0, this.game.mine.username, Object.assign({}, style, {
    font: '24px Fira Sans',
  }));

  const enemyUsername = this.game.add.text(618, 0, this.game.mine.enemyUsername,
    Object.assign({}, style, {
    font: '24px Fira Sans',
  }));

  readyButton.width = 100;
  readyButton.height = 40;
  menuButton.width = 100;
  menuButton.height = 40;
  bottombar.width = container.offsetWidth;
  bottombar.height = 150;
  topbar.width = container.offsetWidth;
  topbar.height = 70;
  gamefield.width = container.offsetWidth;
  gamefield.height = container.offsetHeight;

  // window.graphics = graphics;
}

// Павлова Анастасия Вениаминовна

function update() {
  let graveyard = this.game.mine.graveyard;
  for (const key in graveyard) {
    graveyard[key].destroy();
  }

  graveyard = [];

  if (this.game.mine.dragCard.isDragging) {
    const grid = this.game.mine.dragCard.side === 'attack' ?
      this.game.mine.attackGrid : this.game.mine.defendGrid;

    grid.forEach((element) => {
      element.alpha = 0;
    });

    this.game.mine.dragCard.group.forEach((cardElement) => {
      cardElement.position.copyFrom(this.game.mine.dragCard.element.position);
    });
    const pointer = this.game.mine.dragCard.group.children[1];
    if (!this.game.physics.arcade.overlap(pointer, grid, function (sprite, group) {
      group.alpha = 1;
    })) {
      console.log('they are not colliding!');
    }
  }
}

export default class Game {
  constructor(app) {
    this.app = app;
    this.isInited = false;
    this.roundStarted = false;

    this.cards = {
      a: {
        url: 'assets/cards/a.jpg',
        unit: 'assets/units/c.png',
      },
      b: {
        url: 'assets/cards/b.jpg',
        unit: 'assets/units/tower.png',
      },
      c: {
        url: 'assets/cards/c.jpg',
        unit: 'assets/units/tower.png',
      },
      d: {
        url: 'assets/cards/d.jpg',
        unit: 'assets/units/d.png',
      },
    };
  }

  start() {
    console.log('игра запущена!');
    console.log('подключаю чат!');
    this.renderChat();
  }

  init({ gameID, enemyUsername, allowedCards, side }) {
    if (!this.isInited) {
      new GameMy();
      // const container = document.querySelector('.game');
      // this.enemyUsername = enemyUsername;
      // this.gameID = gameID;
      // this.allowedCards = allowedCards;
      // this.isInited = true;
      // const chatContainer = document.querySelector('.chat-container');
      // chatContainer.classList.add('chat-container_visible');
      // const loader = document.querySelector('.loader');
      // loader.remove();
      //
      // this.game = new Phaser.Game(
      //   container.offsetWidth,
      //   container.offsetHeight,
      //   Phaser.AUTO,
      //   'game'
        // ,
        // {
        //   preload,
        //   create,
        //   update,
        // }
        // );

      // this.game.state.add('bootState', bootState);
      // this.game.state.add('preloadState', preloadState);
      // this.game.state.start('bootState');

      // this.game.mine = {};
      // this.game.mine.cards = [];
      // this.game.mine.dragCard = {};
      // this.game.mine.username = this.app.username;
      // this.game.mine.enemyUsername = enemyUsername;
      // this.game.mine.units = {};
      // this.game.mine.renderCompleteInfo = {
      //   status: 'render_complete',
      //   gameID: this.gameID,
      // };
      // this.game.mine.renderAction = renderAction.bind(this.game);
      // this.game.mine.nextRoundInfo = {
      //   attackSide: {
      //     status: 'ready',
      //     gameID: this.gameID,
      //     cards: [],
      //   },
      //   defenceSide: {
      //     status: 'ready',
      //     gameID: this.gameID,
      //     cards: [],
      //   },
      // };
      // this.game.mine.transport = {
      //   attackSocket: this.attackSocket,
      //   defenceSocket: this.defenceSocket,
      // };
      // this.game.mine.graveyard = [];
    }

    // this.game.mine.cards.push(...allowedCards.map((card) => {
    //   return {
    //     alias: card.alias,
    //     side,
    //     url: this.cards[card.alias].url,
    //     unit: this.cards[card.alias].unit,
    //   };
    // }));
  }

  startLastRound({ units, actions, status }) {
    if (this.roundStarted) {
      return;
    }

    this.roundStarted = true;
    units.forEach((unit) => {
      this.game.mine.units[unit.unitID] = this.game.mine.units[unit.assotiatedCardAlias];
      this.game.mine.units[unit.unitID].unitID = unit.unitID;
      delete this.game.mine.units[unit.assotiatedCardAlias];
    });

    const longestAction = Math.max(...actions.map(o => o.timeOffsetEnd));

    actions.forEach((action) => {
      this.game.mine.renderAction(action, longestAction);
    });
    console.log(this.game.mine.units);
  }

  startSingle() {
    this.attackSocket = {};
    this.defenceSocket = {};
    const x = new Promise((resolve) => {
      setTimeout(() => {
        this.attackSocket = new Transport('ws://localhost:8082/connect?type=singleplayer', this);
        this.defenceSocket = new Transport('ws://localhost:8082/connect?type=singleplayer', this);
        resolve();
      }, 2000);
    });

    return new Promise((resolve) => {
      x.then(() =>
        Promise.all([this.attackSocket.waitOpened(), this.defenceSocket.waitOpened()]).then(() => {
          this.app.game.start();
          resolve('');
        }));
    });
  }

  renderChat() {
    this.chat = new Chat({
      parent: document.querySelector('.chat-container'),
    });

    this.chat.set({
      username: this.app.username,
      messages: [],
    })
      .render();

    // document.querySelector('.chat-container').prependChild(this.chat.parent);
  }
}

// module.exports = Game;
