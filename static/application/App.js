/**
 * Created by andreivinogradov on 26.02.17.
 */

import '../style/main.scss';
import AppService from '../services/appService';
import linker from './router/linker';
import Router from './router/router';
import formActions from './forms/formActions';
import Game from '../game/game2';
import Transport from '../transports/transport';
import urls from './backendUrls';

const cont = document.querySelector('.container');

class App {
  constructor() {
    // Передаем в линкер инстанс приложения
    this.linker = linker(this);
    this.router = new Router(this, cont);
    this.formActions = formActions(this);
    // Подключаем сервис
    this.appService = new AppService();

    this.game = new Game(this);

    cont.addEventListener('click', (e) => {
      this.linker(e);
    });

    cont.addEventListener('submit', (e) => {
      e.preventDefault();
      const formValidator = this.validators.get(e.target);
      const action = e.target.action.slice(e.target.action.lastIndexOf('/') + 1);
      if (!formValidator || !formValidator.showIfAnyErrors()) {
        this.formActions[action]()
          .catch(msg => formValidator.raiseByKey(msg));
      }
    });

    this.validators = new Map();

    this.loggedStatus = false;

    this.username = '';
  }

  startSingleGame() {
    return this.game.startSingle();
  }

  startMatchmaking(attack, defend) {
    let side = null;

    if (attack && defend) {
      side = 'all';
    } else if (attack) {
      side = 'attack';
    } else if (defend) {
      side = 'defence';
    }
    this.gameSocket = new Transport(`${urls.wsUrl}?type=multiplayer&side=${side}`, this.game);
    this.gameSocket.waitOpened()
      .then(() => {
        console.log('СОККЕТ ОТКРЫТ');
      });
  }

  login(name, pass) {
    return this.appService.login(name, pass)
      .then((responseText) => {
        if (responseText.code !== 200) {
          return Promise.reject(responseText.message);
        }
        this.username = name;
        this.loggedStatus = true;
        this.route('/about');
        return Promise.resolve();
      });
  }

  register(name, pass, email) {
    return this.appService.register(name, email, pass)
      .then((responseText) => {
        if (responseText.code !== 200) {
          return Promise.reject(responseText.message);
        }
        this.username = name;
        this.loggedStatus = true;
        this.route('/about');
        return Promise.resolve();
      });
  }

  logOut() {
    return this.appService.logout()
      .then((responseText) => {
        if (responseText.code === 200) {
          this.loggedStatus = false;
          this.username = '';
          return Promise.resolve(responseText.code);
        }
        return Promise.reject(responseText.code);
      });
  }

  route(url) {
    this.router.route(url);
  }

  getLeaders() {
    return this.appService.getLeaders();
  }

  checkLoggedStatus() {
    this.appService.isLoggedIn()
        .then((responseText) => {
          if (responseText.code === 200) {
            this.username = responseText.message;
            this.loggedStatus = true;
          } else {
            this.username = '';
            this.loggedStatus = false;
          }
          this.route();
        });
  }

  disablePlayLink() {
    this.playButtonStatus = 'disabled';
  }

  enablePlayLink() {
    const timer = document.querySelector('.timer');
    if (timer) {
      timer.remove();
      const playItem = document.querySelector('.navigation__item_close');
      playItem.classList.remove('navigation__item_close');
      const playLink = playItem.querySelector('.navigation__link');
      playLink.classList.remove('navigation__link_active');
      playLink.setAttribute('data-act', 'game-start-options');
      playLink.innerText = 'Игра';
      this.playButtonStatus = 'enabled';
    }
  }

  connectValidator(validator) {
    this.validators.set(validator.getForm(), validator);
  }
}

// if ('serviceWorker' in navigator) {
//   navigator.serviceWorker.register("serviceWorker.js", { scope: "/" })
//     .then((registration) => {
//       console.log('ServiceWorker registration', registration);
//     })
//     .catch((error) => {
//       throw new Error(`ServiceWorker error: ${error}`);
//     });
// }

const app = new App();
app.checkLoggedStatus();
