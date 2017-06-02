/**
 * Created by andreivinogradov on 31.05.17.
 */

class Flipper {
  constructor(frontSide, backSide, game) {
    this.frontSide = frontSide;
    this.frontSide.anchor.set(0.5);
    this.backSide = backSide;
    this.game = game;
    this.direction = 'left';
  }

  flip(speed = 5, direction = this.direction) {
    const time = speed * 200;
    const prevKey = this.frontSide.key;

    const firstFlipHalf = this.game.add.tween(this.frontSide.scale).to({ x: 0 }, time, null, true);
    const secondFlipHalf = this.game.add.tween(this.frontSide.scale).to({ x: -0.335 }, time, null);

    firstFlipHalf.onComplete.add(() => {
      // this.frontSide.loadTexture(this.backSide);
      this.backSide = prevKey;
      secondFlipHalf.start();
    });
  }
}

export default Flipper;
