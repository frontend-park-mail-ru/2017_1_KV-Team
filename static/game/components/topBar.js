/**
 * Created by andreivinogradov on 03.05.17.
 */

export default function (state) {
  const topbar = state.add.sprite(0, 0, 'bottombar');
  topbar.width = state.game.width;
  topbar.height = 70;

  const style = {
    font: '20px Fira Sans',
    fill: '#fff',
    boundsAlignH: 'center',
    boundsAlignV: 'middle',
  };

  state.add.text(state.game.width / 2, 20, '1', Object.assign({}, style, {
    font: '30px Fira Sans',
  }));

  return topbar;
}
