/**
 * Created by andreivinogradov on 26.02.17.
 */

const AppService = require('../services/appService.js');
const linker = require('./router/linker.js');
const Router = require('./router/router.js');
const formActions = require('./forms/formActions.js');
const Game = require('../game/game.js');

// TODO in webpack before server start
// TODO automatically compile all xmls into js
// TODO change to MODULE EXPORTS
// TODO include into app js
// TODO automatically COMPILE bundle.js

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
    return this.app.game.startSingle();
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

  connectValidator(validator) {
    this.validators.set(validator.getForm(), validator);
  }
}

const app = new App();
app.checkLoggedStatus();
