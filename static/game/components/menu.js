/**
 * Created by andreivinogradov on 03.05.17.
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

  const menu = state.add.group();
  const menuBackground = state.add.sprite(state.width / 2, state.height / 2, 'popup');
  menuBackground.anchor.setTo(0.5, 0.5);
  menuBackground.width = 200;
  menuBackground.y -= 50;

  const surr = buttonComponent(
    state,
    'Сдаться',
    state.width / 2,
    (menuBackground.y - (menuBackground.height / 2)) + 80,
    'button',
    () => { console.log('Вы типо сдались!'); });

  const opt = buttonComponent(
    state,
    'Опции',
    state.width / 2,
      (menuBackground.y - (menuBackground.height / 2)) + 130,
    'button',
    () => { console.log('Ну типо опции!'); });

  const exit = buttonComponent(
    state,
    'Выйти',
    state.width / 2,
    (menuBackground.y - (menuBackground.height / 2)) + 180,
    'button',
    () => { state.controller.app.route('/'); });

  menu.add(overlay);
  menu.add(menuBackground);
  menu.add(surr);
  menu.add(opt);
  menu.add(exit);

  return menu;
}
