/**
 * Created by andreivinogradov on 13.04.17.
 */

import Phaser from 'phaser';
import BasicPlayState from './basicPlayState';

export default class RenderState extends Phaser.State {
  init(data) {
    this.data = data;
  }

  // Тут подгружаем всех юнитов врага
  preload() {
    this.data.enemyUnits.forEach((unit) => {
      // if (!this.game.cache.checkImageKey(`${unit.assotiatedCardAlias}_unit`)) {
        this.load.image(`${unit.assotiatedCardAlias}_unit`, this.game.cardsUrls[unit.assotiatedCardAlias].unit);
      // }
    });
  }

  create() {
    // Меняем свои ключи своих юнитов на UUID
    this.data.myUnits.forEach((unit) => {
      this.game.gameInfo.me.units[unit.unitID] =
        this.game.gameInfo.me.units[unit.assotiatedCardAlias];
      this.game.gameInfo.me.units[unit.unitID].unitID = unit.unitID;
      delete this.game.gameInfo.me.units[unit.assotiatedCardAlias];
    });

    // Создаем и сохраняем вражеские юниты
    this.data.enemyUnits.forEach((unit) => {
      const cell = this.game.grid.findGridCell(unit.startPoint.x, unit.startPoint.y);
      const unitSprite = cell.spawnUnit(unit.assotiatedCardAlias);
      unitSprite.unitID = unit.unitID;
      this.game.gameInfo.enemy.units[unit.unitID] = unitSprite;
    });

    // После того как все заспаунены, начинаем отрисовку
    this.renderRound(this.data);
  }

  renderRound({ actions }) {
    // Сортируем экшены в порядке окончания, чтобы самое длинное действие было в конце
    const sortedActions = actions.sort(action => action.timeOffsetEnd);
    sortedActions.forEach((action, index) => {
      const isLongest = index === sortedActions.length - 1;
      this.renderAction(action, isLongest);
    });
  }

  tweenTint(spriteToTween, startColor, endColor, duration, offset) {
    const colorBlend = { step: 0 };

    return this.add.tween(colorBlend).to({ step: 100 }, duration, Phaser.Easing.Default, false, offset)
      .onUpdateCallback(() => {
        spriteToTween.tint = Phaser.Color.interpolateColor(startColor, endColor, 100, colorBlend.step, 1);
      })
      .start();
  }

  renderComplete() {
    console.log('Рендер завершен!');
    // const menu = this.add.sprite(400, 200, 'popup');
    // menu.anchor.setTo(0.5, 0.5);
    //
    // const label = this.add.text(400, 200, 'Игра окончена', { font: '30px Arial', fill: '#000' });
    // label.anchor.setTo(0.5, 0.5);
    //
    // this.mine.transport.defenceSocket.send(this.mine.renderCompleteInfo);
    // this.mine.transport.attackSocket.send(this.mine.renderCompleteInfo);
  }

  renderAction(action, isLongest) {
    let unit;
    let units;
    if (this.game.gameInfo.me.units[action.unitID]) {
      unit = this.game.gameInfo.me.units[action.unitID];
      units = this.game.gameInfo.me.units;
    } else {
      unit = this.game.gameInfo.enemy.units[action.unitID];
      units = this.game.gameInfo.enemy.units;
    }
    const time = action.timeOffsetEnd - action.timeOffsetBegin;

    console.log(action.actionType, unit);
    console.log(units);
    console.log(this.game.gameInfo.enemy.units);
    console.log(this.game.gameInfo.me.units);
    let tween;
    switch (action.actionType) {
      case 'move':
        console.log(unit);
        const x = this.game.width * action.actionParameters.distance;
        tween = this.add.tween(unit).to({ x }, time, null, true, action.timeOffsetBegin);
        break;
      case 'attack':
        this.tweenTint(unit, 0xffffff, 0x0000ff, time / 2, action.timeOffsetBegin);
        tween = this.tweenTint(unit, 0x0000ff, 0xffffff, time / 2, action.timeOffsetBegin + (time / 2));
        const victim = this.game.gameInfo.me.units[action.actionParameters.victim]
          || this.game.gameInfo.enemy.units[action.actionParameters.victim];
        const timer = this.game.time.create();
        timer.add(action.timeOffsetBegin, () => {
          const shot = this.add.graphics(0, 0);
          shot.lineStyle(1, 0x0088FF, 1);
          shot.beginFill();
          shot.moveTo(unit.x, unit.y);
          shot.lineTo(victim.x, victim.y);
          shot.endFill();

          const shotTween = this.add.tween(shot).to({ alpha: 0.1 }, time, null, true, 0);
          shotTween.onComplete.add(() => {
            shot.destroy();
          });
        });
        timer.start();
        break;
      case 'getdamage':
        tween = this.add.tween(unit).to({ alpha: 0.1 }, time, null, true, action.timeOffsetBegin);
        break;
      case 'die':
        tween = this.add.tween(unit).to({ alpha: 0.1 }, time, null, true, action.timeOffsetBegin);
        tween.onComplete.add(function () {
          unit.destroy();
          delete units[action.unitID];
        }, this);
        break;
      default:
    }

    if (isLongest) {
      tween.onComplete.add(this.renderComplete, this);
    }
  }
}
