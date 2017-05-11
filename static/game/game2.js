/**
 * Created by andreivinogradov on 03.05.17.
 */

import 'pixi';
import 'p2';
import Phaser from 'phaser';
import BootState from './states/boot';
import PreloadState from './states/preload';
import GameplayState from './states/gameplay';
import RenderState from './states/rendering';
import UILoadState from './states/UILloadState';

import Chat from '../components/chat/chat';
import StateController from './stateController';

class Game extends Phaser.Game {
  constructor({ gameID, enemyUsername, allowedCards, side }, myUsername, gameSocket) {
    super('100%', '100%', Phaser.AUTO, 'game');

    this.state.add('bootState', BootState, false);
    this.state.add('preloadState', PreloadState, false);
    this.state.add('uiLoadState', UILoadState, false);
    this.state.add('gameplayState', GameplayState, false);
    this.state.add('renderState', RenderState, false);

    this.state.start('bootState');

    const cardsUrls = {
      a: {
        url: 'game/assets/cards/a.jpg',
        unit: 'game/assets/units/a.png',
      },
      b: {
        url: 'game/assets/cards/b.jpg',
        unit: 'game/assets/units/b.png',
      },
      c: {
        url: 'game/assets/cards/c.jpg',
        unit: 'game/assets/units/tower.png',
      },
      d: {
        url: 'game/assets/cards/d.jpg',
        unit: 'game/assets/units/tower.png',
      },
    };

    this.gameID = gameID;
    this.gameSocket = gameSocket;
    this.myStateController = new StateController(this);

    this.nextRoundInfo = {
      status: 'ready',
      gameID: this.gameID,
      cards: [],
    };

    this.gameInfo = {
      side,
      gameID,
      me: {
        units: {},
        nickname: myUsername,
        health: 100,
        cards: [],
      },
      enemy: {
        units: {},
        nickname: enemyUsername,
        health: 100,
      },
    };

    this.gameInfo.me.cards.push(...allowedCards.map((card) => {
      return {
        alias: card.alias,
        side,
        url: cardsUrls[card.alias].url,
        unit: cardsUrls[card.alias].unit,
      };
    }));

    this.graveyard = [];
    this.cardsUrls = cardsUrls;
  }
}

export default class GameController {
  constructor(app) {
    this.app = app;
  }

  start() {
    console.log('игра запущена!');
    console.log('подключаю чат!');
  }

  init(options) {
    this.gameInstance = new Game(options, this.app.username, this.app.gameSocket);
  }
}

