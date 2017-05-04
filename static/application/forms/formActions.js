/**
 * Created by andreivinogradov on 31.03.17.
 */
import { loginForm, registrationForm, gameOptionsForm, chatForm } from './forms';
import Timer from '../../components/timer/timer';

const formActions = app => ({
  loginHandler(form = loginForm) {
    const { name, pass } = form.getFormData();
    return app.login(name, pass);
  },

  registrationHandler(form = registrationForm) {
    const { name, email, pass } = form.getFormData();
    return app.register(name, pass, email);
  },

  qStarter(form = gameOptionsForm) {
    const { attack, defend } = form.getFormData();
    console.log(attack, defend);
    const gameStartOpt = document.querySelector('.start-game-options-container');
    gameStartOpt.classList.remove('start-game-options-container_visible');
    const timer = new Timer('body', 'prepend');
    app.disablePlayLink();
    const playItem = document.querySelector('.navigation__item_active');
    playItem.classList.remove('navigation__item_active');
    playItem.classList.add('navigation__item_close');
    const playLink = playItem.querySelector('.navigation__link');
    playLink.classList.remove('navigation__link_active');
    playLink.setAttribute('data-act', 'end-search');
    playLink.innerText = 'Отменить поиск';
    timer.start();
    app.startMatchmaking(attack, defend);
    return Promise.resolve();
  },

  sendMessage(form = chatForm) {
    const data = form.getFormData();
    app.game.chat.sendMessage(data.message);
    return Promise.resolve();
  },
});

export default formActions;
