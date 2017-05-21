/**
 * Created by andreivinogradov on 03.05.17.
 */

class Castle {
  constructor(state) {
    const wall = state.add.sprite(state.width - 50, 70, 'wall');
    const castleTowerTop = state.add.sprite(state.width - 25, 100, 'castleTower');
    const castleTowerBot = state.add.sprite(state.width - 25, state.height - 180, 'castleTower');
    castleTowerTop.anchor.set(0.5);
    castleTowerBot.anchor.set(0.5);

    castleTowerBot.width = 50;
    castleTowerBot.height = 50;
    castleTowerTop.width = 50;
    castleTowerTop.height = 50;

    this.state = state;
    this.wall = wall;
    this.castleTowerBot = castleTowerBot;
    this.castleTowerTop = castleTowerTop;
  }

  getDamage(damage) {

  }

  getWall() {
    return this.wall;
  }

  // Неправельная атака для верзней башни
  attack(enemyUnit, side, time, offset) {
    const timer = this.state.time.create();
    const tower = side === 'bottom' ? this.castleTowerBot : this.castleTowerTop;

    timer.add(offset, () => {
      const shot = this.state.add.graphics(0, 0);
      shot.lineStyle(2, 0x0ff7f, 1);
      shot.beginFill();
      shot.moveTo(tower.centerX, tower.centerY);
      shot.lineTo(enemyUnit.centerX, enemyUnit.centerY);
      shot.endFill();

      const shotTween = this.state.add.tween(shot).to({ alpha: 0.1 }, time, null, true);
      this.state.addTweensCount(shotTween);
      shotTween.onComplete.add(() => {
        shot.destroy();
      });
    });
    timer.start();
  }
}

export default Castle;
