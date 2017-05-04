/**
 * Created by andreivinogradov on 03.05.17.
 */

export default function (state) {
  const gamefield = state.add.sprite(0, 70, 'gamefield');
  gamefield.width = state.game.width;
  gamefield.heigth = state.game.height;

  const style = {
    font: '20px Fira Sans',
    fill: '#fff',
    boundsAlignH: 'center',
    boundsAlignV: 'middle',
  };

  state.add.text(state.game.width / 2, 20, '1', Object.assign({}, style, {
    font: '30px Fira Sans',
  }));

  return gamefield;
}
