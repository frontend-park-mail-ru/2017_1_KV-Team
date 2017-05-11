/**
 * Created by andreivinogradov on 03.05.17.
 */

export default function (state) {
  const gamefield = state.add.sprite(0, 70, 'gamefield');
  gamefield.width = state.width;
  gamefield.heigth = state.height;

  return gamefield;
}
