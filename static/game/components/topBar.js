/**
 * Created by andreivinogradov on 03.05.17.
 */

export default function (state) {
  const topbar = state.add.sprite(0, 0, 'bottombar');
  topbar.width = state.game.width;
  topbar.height = 70;
  return topbar;
}
