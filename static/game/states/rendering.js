/**
 * Created by andreivinogradov on 13.04.17.
 */

import Phaser from 'phaser';

export default class RenderState extends Phaser.State {
  init(data) {
    this.data = data;
    this.game.activeTweensCount = data.actions.length;
  }

  // Тут подгружаем всех юнитов врага
  preload() {
    this.data.enemyUnits.forEach((unit) => {
      if (!this.game.gameInfo.enemy.units[unit.unitID]) {
        this.load.image(`${unit.assotiatedCardAlias}_unit`, this.game.cardsUrls[unit.assotiatedCardAlias].unit);
      }
    });
  }

  create() {
    const myUnits = this.game.gameInfo.me.units;
    // Меняем свои ключи своих юнитов на UUID
    this.data.myUnits.forEach((unit) => {
      if (!myUnits[unit.unitID]) {
        myUnits[unit.unitID] = myUnits[unit.assotiatedCardAlias];
        myUnits[unit.unitID].setUnitID(unit.unitID);
        delete myUnits[unit.assotiatedCardAlias];
      }
      console.log('________________________');
      console.log(unit.assotiatedCardAlias);
      console.log(this.game.gameInfo.me.units);
      console.log('________________________');
    });

    // Создаем и сохраняем вражеские юниты
    this.data.enemyUnits.forEach((unit) => {
      if (!this.game.gameInfo.enemy.units[unit.unitID]) {
        const { x, y } = unit.startPoint;
        const cell = this.game.grid.findGridCell(x, y);
        const rectCell = this.game.grid.findEnemyRectCell(x, y);
        const unitObj = cell.spawnUnit(unit.assotiatedCardAlias, true);
        unitObj.setBornPlace(cell, rectCell);
        cell.kill();
        rectCell.kill();
        unitObj.setUnitID(unit.unitID);
        this.game.gameInfo.enemy.units[unit.unitID] = unitObj;
      }
    });

    // После того как все заспаунены, начинаем отрисовку
    this.renderRound(this.data);
  }

  update() {
    console.log(this.game.activeTweensCount);
    if (this.game.activeTweensCount === 0) {
      this.game.activeTweensCount = undefined;
      this.renderComplete();
    }
  }

  renderRound({ actions }) {
    actions.forEach((action) => {
      this.renderAction(action);
    });
  }

  renderComplete() {
    console.log('Рендер завершен!');
    this.game.gameSocket.send(this.game.renderCompleteInfo);
  }

  renderAction(action) {
    let unit;
    if (this.game.gameInfo.me.units[action.unitID]) {
      unit = this.game.gameInfo.me.units[action.unitID];
    } else {
      unit = this.game.gameInfo.enemy.units[action.unitID];
    }
    const time = action.timeOffsetEnd - action.timeOffsetBegin;

    console.log(action.actionType, unit);
    console.log(this.game.gameInfo.enemy.units);
    console.log(this.game.gameInfo.me.units);
    let victim;
    switch (action.actionType) {
      case 'move':
        const x = this.game.width * action.actionParameters.distance;
        unit.move(x, time, action.timeOffsetBegin);
        break;
      case 'castleattack':
        victim = this.game.gameInfo.me.units[action.actionParameters.victim]
          || this.game.gameInfo.enemy.units[action.actionParameters.victim];
        this.game.castle.attack(victim, action.actionParameters.tower, time, action.timeOffsetBegin);
        break;
      case 'attack':
        victim = this.game.gameInfo.me.units[action.actionParameters.victim]
          || this.game.gameInfo.enemy.units[action.actionParameters.victim];
        unit.attack(time, action.timeOffsetBegin, victim);
        break;
      case 'getdamage':
        unit.getDamage(time, action.timeOffsetBegin);
        break;
      case 'die':
        unit.die(time, action.timeOffsetBegin);
        break;
      default:
    }
  }
}
