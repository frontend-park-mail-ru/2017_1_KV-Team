/**
 * Created by andreivinogradov on 03.05.17.
 */

export default function (state) {
  const gamefield = state.add.sprite(0, 70, 'gamefield');
  gamefield.width = state.game.width;
  gamefield.heigth = state.game.height;

  console.log('from battleComp: ' + gamefield.heigth);
  return gamefield;
}
