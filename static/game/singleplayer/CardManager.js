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
      range: 0.05,
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
      side: 'DEFENDER',
      maxHP: 1,
      attack: 1,
      timeAttack: 300,
      range: 0.2,
      velocity: 0,
    };
    this.cards.d = {
      alias: 'd',
      side: 'DEFENDER',
      maxHP: 1,
      attack: 1,
      timeAttack: 300,
      range: 0.2,
      velocity: 0,
    };
  }

  getCardsForMove(side, move) {
    const onlySelectedSide = Object.values(this.cards)
      .filter(p => p.side === side);
    const numberOfCardsForMove = Math.min(move, 4);
    const indexes = [];
    while (indexes.length < numberOfCardsForMove) {
      const randomIndex = Math.floor(Math.random() * onlySelectedSide.length);
      if (indexes.indexOf(randomIndex) === -1) {
        indexes.push(randomIndex);
      }
    }
    return indexes.map(idx => onlySelectedSide[idx]);
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

