/**
 * Created by maxim on 14.05.17.
 */

const uuidV4 = require('uuid/v4');


export default class Unit {
  // Фиктивный юнит, например, башенка замка
  initFictive(id, fictiveAlias) {
    this.unitID = id;
    this.assotiatedCardAlias = fictiveAlias;
    return this;
  }
  // Новый юнит на основе карточки
  initNew(card, startPoint) {
    this.unitID = uuidV4();
    this.assotiatedCardAlias = card.alias;
    this.side = card.side;
    this.maxHP = card.maxHP;
    this.currentHP = card.maxHP;
    this.attack = card.attack;
    this.timeAttack = card.timeAttack;
    this.range = card.range;
    this.velocity = card.velocity;
    this.startPoint = startPoint;
    this.positionOffset = 0;
    return this;
  }
  // Юнит, выживший с предыдущего хода
  initAlived(card, unitID, startPoint, currentHP) {
    this.unitID = unitID;
    this.assotiatedCardAlias = card.alias;
    this.side = card.side;
    this.maxHP = card.maxHP;
    this.attack = card.attack;
    this.timeAttack = card.timeAttack;
    this.range = card.range;
    this.velocity = card.velocity;
    this.startPoint = startPoint;
    this.currentHP = currentHP;
    this.positionOffset = 0;
    return this;
  }
  // Копия текущего состояния юнита
  copy(unit) {
    this.unitID = unit.unitID;
    this.assotiatedCardAlias = unit.assotiatedCardAlias;
    this.side = unit.side;
    this.maxHP = unit.maxHP;
    this.attack = unit.attack;
    this.timeAttack = unit.timeAttack;
    this.range = unit.range;
    this.velocity = unit.velocity;
    this.startPoint = unit.startPoint;
    this.currentHP = unit.currentHP;
    this.positionOffset = unit.positionOffset;
    return this;
  }
  decrementHP(value) {
    this.currentHP = (this.currentHP - value > 0) ?
                      this.currentHP - value :
                      0;
    return this.currentHP;
  }
  incrementOffset(offset) {
    this.positionOffset = (this.positionOffset + offset <= 1) ?
                           this.positionOffset + offset :
                           1;
  }
}
