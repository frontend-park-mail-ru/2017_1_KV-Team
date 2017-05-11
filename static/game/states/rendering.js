/**
 * Created by andreivinogradov on 13.04.17.
 */

import Phaser from 'phaser';
import BasicPlayState from './basicPlayState';

export default class RenderState extends Phaser.State {
  init(data) {
    this.data = data;
    // this.renderRound(data);
  }

  renderUnits({ units, actions }) {
    this.units = units.forEach((unit) => {

    });
  }

  // Тут подгружаем всех юнитов врага
  preload() {
    this.data.enemyUnits.forEach((unit) => {
      if (!this.game.cache.checkImageKey(`${unit.assotiatedCardAlias}_unit`)) {
        this.load.image(`${unit.assotiatedCardAlias}_unit`, this.game.cardsUrls[unit.assotiatedCardAlias].unit);
      }
    });
  }

  create() {
    console.log(this.data.enemyUnits);
    this.data.enemyUnits.forEach((unit) => {
      let x = null;
      let y = null;
      // Поправить динамические координаты
      switch (unit.startPoint.x) {
        case 1:
          x = 0;
          break;
        case 2:
          x = this.game.width - 215 - 50;
          break;
        case 3:
          x = this.game.width - 107 - 50;
          break;
        default:
      }

      switch (unit.startPoint.y) {
        case 1:
          y = 70;
          break;
        case 2:
          y = 177;
          break;
        case 3:
          y = 284;
          break;
        case 4:
          y = 391;
          break;
        default:
          console.log('gwgweg');
      }

      const unitSprite = this.add.sprite(x, y, `${unit.assotiatedCardAlias}_unit`);
      unitSprite.unitID = unit.unitID;
      unitSprite.width = 50;
      unitSprite.height = 50;
      console.log(unitSprite);
      this.game.gameInfo.enemy.units[unit.unitID] = unitSprite;
    });
  }

  // renderRound({ units, actions }) {
  //   const longestAction = Math.max(...actions.map(o => o.timeOffsetEnd));
  //
  //   actions.forEach((action) => {
  //     this.renderAction(action, longestAction);
  //   });
  // }
  //
  // tweenTint(spriteToTween, startColor, endColor, duration, offset) {
  //   const colorBlend = { step: 0 };
  //
  //   return this.add.tween(colorBlend).to({ step: 100 }, duration, Phaser.Easing.Default, false, offset)
  //     .onUpdateCallback(() => {
  //       spriteToTween.tint = Phaser.Color.interpolateColor(startColor, endColor, 100, colorBlend.step, 1);
  //     })
  //     .start();
  // };
  //
  // renderAction(action, longestAction) {
  //   const unit = this.game.gameInfo.me.units[action.unitID];
  //   const time = action.timeOffsetEnd - action.timeOffsetBegin;
  //
  //   let tween;
  //   switch (action.actiontType) {
  //     case 'move':
  //       const x = (this.game.width - 100) * action.actionParameters.distance;
  //       tween = this.add.tween(unit).to({ x }, time, null, true, action.timeOffsetBegin);
  //       break;
  //     case 'attack':
  //       this.tweenTint(unit, 0xffffff, 0x0000ff, time / 2, action.timeOffsetBegin);
  //       tween = this.tweenTint(unit, 0x0000ff, 0xffffff, time / 2, action.timeOffsetBegin + (time / 2));
  //       break;
  //     case 'die':
  //       tween = this.add.tween(unit).to({ alpha: 0.1 }, time, null, true, action.timeOffsetBegin);
  //       tween.onComplete.add(function () {
  //         unit.destroy();
  //         delete this.game.gameInfo.me.units[action.unitID];
  //       }, this);
  //       break;
  //     default:
  //   }

    // if (action.timeOffsetEnd === longestAction) {
    //   tween.onComplete.add(renderComplete, this);
    // }
 // }
}
