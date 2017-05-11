/**
 * Created by andreivinogradov on 03.05.17.
 */
import buttonComponent from './button';

export default function (state) {
  const menu = state.add.group();
  const menuBackground = state.add.sprite(state.width / 2, state.height / 2, 'popup');
  menuBackground.anchor.setTo(0.5, 0.5);

  const surr = buttonComponent(
    state,
    'Сдаться',
    state.width / 2,
    (menuBackground.y - (menuBackground.height / 2)) + 20,
    'button',
    () => { console.log('Вы типо сдались!'); });

  const opt = buttonComponent(
    state,
    'Опции',
    state.width / 2,
      (menuBackground.y - (menuBackground.height / 2)) + 80,
    'button',
    () => { console.log('Ну типо опции!'); });

  const exit = buttonComponent(
    state,
    'Выйти',
    state.width / 2,
    (menuBackground.y - (menuBackground.height / 2)) + 140,
    'button',
    () => { console.log('Вы типо вышли!'); });

  menu.add(menuBackground);
  menu.add(surr);
  menu.add(opt);
  menu.add(exit);

  return menu;
}
