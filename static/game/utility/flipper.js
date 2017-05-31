/**
 * Created by andreivinogradov on 31.05.17.
 */

class Flipper {
  constructor(frontSide, backSide, game) {
    this.frontSide = frontSide;
    this.backSide = backSide;
    this.game = game;
  }

  flip(speed = 1) {
    const time = speed * 200;
    const firstFlipHalf = this.game.add.tween(this.frontSide.scale).to({ x: -0.5 }, time, null, true);
    const secondFlipHalf = this.game.add.tween(this.frontSide.scale).to({ x: -1 }, time, null);

    firstFlipHalf.onComplete.add(() => {
      this.frontSide.loadTexture(this.backSide, 0);
      secondFlipHalf.start();
    });
  }
}

export default Flipper;
