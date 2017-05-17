/**
 * Created by andreivinogradov on 03.05.17.
 */


export default function (state, text, x, y, sprite, callback) {
  const button = state.add.group();
  const buttonBackground = state.add.button(x, y, 'button', callback, state, 2, 1, 0);
  buttonBackground.anchor.set(0.5);

  const style = {
    font: '20px Fira Sans',
    fill: '#fff',
    align: 'center',
    // boundsAlignH: 'center',
    // boundsAlignV: 'middle',
  };

  const label = state.add.text(0, 0, text, style);
  label.setTextBounds(x, y, 100, 40);
  label.anchor.set(0.5);
  buttonBackground.width = 100;
  buttonBackground.height = 40;

  button.add(buttonBackground);
  button.add(label);
  return button;
}
