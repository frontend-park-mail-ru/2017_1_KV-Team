/**
 * Created by andreivinogradov on 20.05.17.
 */
import Phaser from 'phaser';

class Unit {
  constructor(state, x, y, squareSize, key, enemy) {
    const unit = state.add.sprite(x, y, `${key}_unit`);
    unit.anchor.set(0.5);
    const k = unit.height / unit.width;
    unit.height = squareSize - (squareSize * 0.2);
    unit.width = unit.height / k;
    this.unit = unit;
    this.state = state;
    this.alias = key;

    if (enemy) {
      this.unitsThisSide = state.gameInfo.enemy.units;
    } else {
      this.unitsThisSide = state.gameInfo.me.units;
    }
  }

  setBornPlace(cell, rectCell) {
    this.bornPlace = { cell, rectCell };
    console.log(this.bornPlace);
  }

  getUnitSprite() {
    return this.unit;
  }

  setUnitID(unitID) {
    this.unitID = unitID;
  }

  attack(time, offset, victim) {
    if (!victim) {
      victim = { centerX: this.state.castle.getWall().x, centerY: this.unit.centerY };
    } else {
      victim = victim.getUnitSprite();
    }
    const tween1 = this.tweenTint(this.unit, 0xffffff, 0x0000ff, time / 2, offset);
    // this.state.addTweensCount(tween1);

    const tween = this.tweenTint(this.unit, 0x0000ff, 0xffffff, time / 2, offset + (time / 2));
    // this.state.addTweensCount(tween);

    const timer = this.state.time.create();
    timer.add(offset, () => {
      const shot = this.state.add.graphics(0, 0);
      shot.lineStyle(1, 0x0088FF, 1);
      shot.beginFill();
      shot.moveTo(this.unit.centerX, this.unit.centerY);
      shot.lineTo(victim.centerX, victim.centerY);
      shot.endFill();

      const shotTween = this.state.add.tween(shot).to({ alpha: 0.1 }, time, null, true, 0);
      this.state.addTweensCount(shotTween);
      shotTween.onComplete.add(() => {
        shot.destroy();
      });
    });
    timer.start();
  }

  // Пока анимация для этого действия не имплементирована
  getDamage(time, offset) {
    const tween = this.state.add.tween(this.unit).to({ }, time, null, true, offset);

    this.state.addTweensCount(tween);
  }

  die(time, offset) {
    const tween = this.state.add.tween(this.unit).to({ alpha: 0.1 }, time, null, true, offset);

    this.state.addTweensCount(tween);

    tween.onComplete.add(() => {
      this.bornPlace.cell.revive();
      this.bornPlace.rectCell.revive();
      this.unit.destroy();
      delete this.unitsThisSide[this.unitID];
    });
  }

  move(x, time, offset) {
    const timer = this.state.time.create();
    timer.add(offset, () => {
      const movement = this.state.add.tween(this.unit).to({ x }, time, null, true, 0);
      this.state.addTweensCount(movement);
    });
    timer.start();
  }

  tweenTint(spriteToTween, startColor, endColor, duration, offset) {
    const colorBlend = { step: 0 };

    return this.state.add.tween(colorBlend).to({ step: 100 }, duration, Phaser.Easing.Default, false, offset)
      .onUpdateCallback(() => {
        spriteToTween.tint = Phaser.Color.interpolateColor(startColor, endColor, 100, colorBlend.step, 1);
      })
      .start();
  }
}

export default Unit;
