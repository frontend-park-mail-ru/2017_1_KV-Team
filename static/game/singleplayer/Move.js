/**
 * Created by maxim on 14.05.17.
 */

import Unit from './Unit.js';

export default class Move{
  // Первый ход
  initFirstMove(maxCastleHP) {
    this.currentMove = 1;
    this.initialCastleHP = maxCastleHP;
    this.currentCastleHP = maxCastleHP;
    this.units = [];
    this.aliveUnits = [];
    this.actions = [];
    return this;
  }
  // Построение на основе предыдущего хода
  initBasedOnPreviousMove(prevMove) {
    this.currentMove = prevMove.currentMove + 1;
    this.initialCastleHP = prevMove.currentCastleHP;
    this.currentCastleHP = prevMove.currentCastleHP;
    this.units = prevMove.aliveUnits.map(unit => new Unit().copy(unit));
    this.aliveUnits = prevMove.aliveUnits.map(unit => new Unit().copy(unit));
    this.actions = [];
    return this;
  }
  decrementCastleHP(value) {
    this.currentCastleHP = (this.currentCastleHP - value > 0) ?
                            this.currentCastleHP - value :
                            0;
    return this.currentCastleHP;
  }
  addUnit(unit) {
    // Кидаем в оба массива
    // в первом будут хранится изначальные данные
    // над вторым будет вестись обработка
    // Предполагается, что массив будет заполнен до начала обработки
    this.units = this.units.filter( u => u.startPoint !== unit.startPoint);
    this.aliveUnits = this.aliveUnits.filter( u => u.startPoint !== unit.startPoint);
    this.units.push(new Unit().copy(unit));
    this.aliveUnits.push(unit);
  }
  addAction(action) {
    this.actions.push(action);
  }
}
