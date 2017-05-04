/**
 * Created by andreivinogradov on 03.05.17.
 */

import 'pixi';
import 'p2';
import Phaser from 'phaser';
import BootState from './states/boot';
import PreloadState from './states/preload';
import GameplayState from './states/gameplay';
import Chat from '../components/chat/chat';

class Game extends Phaser.Game {
  constructor({ gameID, enemyUsername, allowedCards, side }, myUsername) {
    super('100%', '100%', Phaser.AUTO, 'game');

    this.state.add('bootState', BootState, false);
    this.state.add('preloadState', PreloadState, false);
    this.state.add('gameplayState', GameplayState, false);

    this.state.start('bootState');

    const cardsUrls = {
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

    this.gameInfo = {
      side,
      gameID,
      me: {
        units: null,
        nickname: myUsername,
        health: 100,
        cards: [],
      },
      enemy: {
        units: null,
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
    new Game(options, this.app.username);
  }
}

