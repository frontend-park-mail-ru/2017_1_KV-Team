/**
 * Created by maxim on 14.05.17.
 */

import Move from './Move.js';
import processMove from './MoveProcessor.js'
import CardManager from './CardManager.js';

const uuidV4 = require('uuid/v4');

export default class Match {
  serializeMoveResults(move, myUnits, enemyUnits, actions) {
    if (move.currentCastleHP <= 0 || move.currentMove >= this.settings.maxMovesCount) {
      const winner = move.currentCastleHP <= 0 ? 'attack_win' : 'defence_win';
      return {
        status: winner,
        gameID: this.gameID,
        currentMove: move.currentMove,
        castleHP: move.initialCastleHP,
        myUnits,
        enemyUnits,
        actions,
      };
    } else {
      return {
        status: 'continous',
        gameID: this.gameID,
        currentMove: move.currentMove,
        castleHP: move.initialCastleHP,
        myUnits,
        enemyUnits,
        actions,
      };
    }
  }
  startMatch(
    username,
    maxCastleHP,
    maxMovesCount,
    maxCastleRange,
    castleAttack,
    castleTimeAttack) {
    this.cardManager = new CardManager();
    
    this.settings = {};
    this.settings.maxCastleHP = maxCastleHP;
    this.settings.maxMovesCount = maxMovesCount;
    this.settings.maxCastleRange = maxCastleRange;
    this.settings.castleAttack = castleAttack;
    this.settings.castleTimeAttack = castleTimeAttack;
    this.moves = [];
    this.gameID = uuidV4();
    this.attackAvailableCards = [];
    this.defenceAvailableCards = [];
    
    const attackCards = this.cardManager.getCardsForMove('ATTACKER', 1);
    const defenceCards = this.cardManager.getCardsForMove('DEFENDER', 1);
    this.attackAvailableCards = attackCards;
    this.defenceAvailableCards = defenceCards;

    return {
      attack: {
        gameID: this.gameID,
        status: 'start',
        side: 'attack',
        enemyUsername: username,
        movesCount: this.settings.maxMovesCount,
        castleMaxHP: this.settings.maxCastleHP,
        allowedCards: attackCards.map(c => ({ alias: c.alias, side: c.side })),
      },
      defence: {
        gameID: this.gameID,
        status: 'start',
        side: 'defence',
        enemyUsername: username,
        movesCount: this.settings.maxMovesCount,
        castleMaxHP: this.settings.maxCastleHP,
        allowedCards: defenceCards.map(c => ({ alias: c.alias, side: c.side })),
      },
    };
  }
  ready(readyData) {
    console.log('ready data into match', readyData);
    const attackReadyData = readyData.attack;
    const defenceReadyData = readyData.defence;
    // Из выбранных карт удаляем карты, которые не были разрешены
    const chosenAttackCards = attackReadyData.cards
      .filter(
        card => this.attackAvailableCards.reduce((n, c) => n + (card.alias === c.alias), 0) !== 0)
      .map(card => this.cardManager.getCard(card.alias, card.pos));
    const chosenDefenceCards =
      defenceReadyData.cards.filter(
        card => this.defenceAvailableCards.reduce((n, c) => n + (card.alias === c.alias), 0) !== 0)
      .map(card => this.cardManager.getCard(card.alias, card.pos));
    const move = new Move();
    if (this.moves.length !== 0) {
      const prevMove = this.moves[this.moves.length - 1];
      move.initBasedOnPreviousMove(prevMove);
    } else {
      move.initFirstMove(this.settings.maxCastleHP);
    }
    processMove(this.settings, chosenAttackCards, chosenDefenceCards, move);
    this.moves.push(move);
    const attackUnits = move.units
      .filter(u => u.side === 'ATTACKER')
      .map((u) => {
        return {
          unitID: u.unitID,
          assotiatedCardAlias: u.assotiatedCardAlias,
          maxHP: u.maxHP,
          currentHP: u.currentHP,
        };
      });
    const defenceUnits = move.units
      .filter(u => u.side === 'DEFENDER')
      .map((u) => {
        return {
          unitID: u.unitID,
          assotiatedCardAlias: u.assotiatedCardAlias,
          maxHP: u.maxHP,
          currentHP: u.currentHP,
        };
      });
    const actions = move.actions
      .map((a) => {
        return {
          unitID: a.actor.unitID,
          actionType: a.type,
          actionParameters: a.actionParams,
          timeOffsetBegin: a.beginOffset,
          timeOffsetEnd: a.endOffset,
        };
      });
    console.log('out', actions);
    return this.serializeMoveResults(move, defenceUnits, attackUnits, actions);
  }
  renderComplete(renderCompleteData) {
    const move = this.moves[this.moves.length - 1];
    console.log('into render complete', this.moves.length, move);
    if (move.currentCastleHP > 0 && move.currentMove < this.settings.maxMovesCount) {
      const attackCards = this.cardManager.getCardsForMove('ATTACKER', move.currentMove + 1);
      const defenceCards = this.cardManager.getCardsForMove('DEFENDER', move.currentMove + 1);
      this.attackAvailableCards = attackCards;
      this.defenceAvailableCards = defenceCards;
      const allCards = attackCards.concat(defenceCards).map(c => ({ alias: c.alias, side: c.side }));
      console.log(allCards);
      return {
        allowedCards: allCards,
      };
    }
    console.log('finish');
  }
}
/*
const match = new Match();
const data = match.startMatch('name', 1, 2, 0.15, 1, 500);
console.log(data);
const attackReadyData = {
  status: 'ready',
  gameID: match.gameID,
  cards: [
    {
      alias: data.attack.allowedCards[0],
      pos: {
        x: 0,
        y: 0,
      },
    },
  ],
};
const defenceReadyData = {
  status: 'ready',
  gameID: match.gameID,
  cards: [
    {
      alias: data.defence.allowedCards[0],
      pos: {
        x: 1,
        y: 0,
      },
    },
  ],
};
const data2 = match.ready({
  attack: attackReadyData,
  defence: defenceReadyData,
});

console.log(data2);

const data3 = match.renderComplete({
  attack: {
    gameID: match.gameID,
    status: 'render_complete',
  },
  defence: {
    gameID: match.gameID,
    status: 'render_complete',
  },
});
console.log(data3);
const attackReadyData1 = {
  status: 'ready',
  gameID: match.gameID,
  cards: [
    {
      alias: data3.attack.allowedCards[0],
      pos: {
        x: 0,
        y: 0,
      },
    },
    {
      alias: data3.attack.allowedCards[1],
      pos: {
        x: 0,
        y: 1,
      },
    },
  ],
};
const defenceReadyData1 = {
  status: 'ready',
  gameID: match.gameID,
  cards: [
    {
      alias: data3.defence.allowedCards[0],
      pos: {
        x: 1,
        y: 0,
      },
    },
    {
      alias: data3.defence.allowedCards[1],
      pos: {
        x: 1,
        y: 1,
      },
    },
  ],
};
const data4 = match.ready({
  attack: attackReadyData1,
  defence: defenceReadyData1,
});
console.log(data4);

const data5 = match.renderComplete({
  attack: {
    gameID: match.gameID,
    status: 'render_complete',
  },
  defence: {
    gameID: match.gameID,
    status: 'render_complete',
  },
});
console.log(data5);
*/