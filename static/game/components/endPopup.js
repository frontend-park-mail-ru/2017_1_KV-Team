/**
 * Created by andreivinogradov on 23.05.17.
 */

import buttonComponent from './button';

export default function (state) {
  const overlay = state.add.graphics(0, 0);
  overlay.lineStyle(state.height, 0x000000);
  overlay.beginFill();
  overlay.moveTo(0, state.height / 2);
  overlay.lineTo(state.width, state.height / 2);
  overlay.endFill();
  overlay.alpha = 0.5;

  const popup = state.add.group();
  const popupBackground = state.add.sprite(state.width / 2, state.height / 2, 'popup');
  popupBackground.anchor.setTo(0.5, 0.5);
  popupBackground.width = 200;
  popupBackground.y -= 50;
  popupBackground.visible = false;

  let text;
  if (state.mode === 'multi') {
    if (state.status === 'attack_win') {
      if (state.gameInfo.side === 'attack') {
        text = 'Вы победили! Ваши демоны разрушили замок!';
      } else {
        text = 'Вы проиграли! В следующий раз охраняйте замок лучше!';
      }
    } else {
      if (state.gameInfo.side === 'attack') {
        text = 'Вы проиграли! В следующий раз продумывайте свои ходы лучше!';
      } else {
        text = 'Вы победили! Вам удалось защитить замок!';
      }
    }
  } else {
    text = 'Игра окончена!';
  }

  const style = {
    font: '32px Fira Sans',
    fill: '#fff',
    align: 'center',
    // boundsAlignH: 'center',
    // boundsAlignV: 'middle',
  };

  const label = state.add.text(0, 0, text, style);
  label.setTextBounds(
    state.width / 2,
    (popupBackground.y - (popupBackground.height / 2)) + 80,
    100,
    40);
  label.anchor.set(0.5);

  const exit = buttonComponent(
    state,
    'Выйти',
    state.width / 2,
    (popupBackground.y - (popupBackground.height / 2)) + 180,
    'button',
    () => { state.controller.app.route('/'); });

  popup.add(overlay);
  popup.add(popupBackground);
  popup.add(label);
  popup.add(exit);

  return popup;
}
