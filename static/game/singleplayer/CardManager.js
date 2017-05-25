/**
 * Created by maxim on 13.05.17.
 */

export default class CardManager {
  constructor() {
    this.cards = {};
    this.cards.a = {
      alias: 'a',
      side: 'ATTACKER',
      maxHP: 1,
      attack: 1,
      timeAttack: 300,
      range: 0.1,
      velocity: 0.2,
    };
    this.cards.b = {
      alias: 'b',
      side: 'ATTACKER',
      maxHP: 1,
      attack: 1,
      timeAttack: 300,
      range: 0.1,
      velocity: 0.2,
    };
    this.cards.c = {
      alias: 'c',
      side: 'ATTACKER',
      maxHP: 1,
      attack: 1,
      timeAttack: 300,
      range: 0.1,
      velocity: 0.2,
    };
    this.cards.d = {
      alias: 'd',
      side: 'ATTACKER',
      maxHP: 1,
      attack: 1,
      timeAttack: 300,
      range: 0.1,
      velocity: 0.2,
    };
    this.cards.e = {
      alias: 'e',
      side: 'DEFENDER',
      maxHP: 1,
      attack: 1,
      timeAttack: 300,
      range: 0.2,
      velocity: 0,
    };
    this.cards.f = {
      alias: 'f',
      side: 'DEFENDER',
      maxHP: 1,
      attack: 1,
      timeAttack: 300,
      range: 0.2,
      velocity: 0,
    };
    this.cards.g = {
      alias: 'g',
      side: 'DEFENDER',
      maxHP: 1,
      attack: 1,
      timeAttack: 300,
      range: 0.2,
      velocity: 0,
    };
    this.cards.k = {
      alias: 'k',
      side: 'DEFENDER',
      maxHP: 1,
      attack: 1,
      timeAttack: 300,
      range: 0.2,
      velocity: 0,
    };
    this.cardsPool = {};
    Object.values(this.cards).forEach((card) => {
      this.cardsPool[card.alias] = card;
    });
  }

  getCardsForMove(side, move) {
    const onlySelectedSide = Object.values(this.cardsPool)
      .filter(p => p.side === side);
    const numberOfCardsForMove = Math.min(move, 4, onlySelectedSide.length);
    const indexes = [];
    while (indexes.length < numberOfCardsForMove) {
      const randomIndex = Math.floor(Math.random() * onlySelectedSide.length);
      if (indexes.indexOf(randomIndex) === -1) {
        indexes.push(randomIndex);
      }
    }
    const cardsForMove = indexes.map(idx => onlySelectedSide[idx]);
    cardsForMove.forEach((card) => {
      delete this.cardsPool[card.alias];
    });
    return cardsForMove;
  }
  getCard(alias, pos) {
    const template = this.cards[alias];
    if (template) {
      return {
        alias: template.alias,
        side: template.side,
        maxHP: template.maxHP,
        attack: template.attack,
        timeAttack: template.timeAttack,
        range: template.range,
        velocity: template.velocity,
        pos,
      };
    }
    return undefined;
  }
}

