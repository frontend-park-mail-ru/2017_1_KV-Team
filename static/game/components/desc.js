/**
 * Created by andreivinogradov on 03.05.17.
 */

export default function (state) {
  const bottombar = state.add.sprite(0, state.height - 150, 'bottombar');
  bottombar.width = state.width;
  bottombar.height = 150;

  return bottombar;
}
