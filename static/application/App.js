/**
 * Created by andreivinogradov on 26.02.17.
 */

const AppService = require('../services/appService.js');
const { loginForm, registrationForm, gameOptionsForm } = require('./forms/forms.js');
const linker = require('./router/linker.js');
const Router = require('./router/router.js');

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
    this.router = new Router(this);
    // Подключаем сервис
    this.appService = new AppService();
    // Сохраняем загруженные представления
    this.cachedViews = {};

    cont.addEventListener('click', (e) => {
      this.linker(e);
    });

    cont.addEventListener('submit', (e) => {
      e.preventDefault();
      const formValidator = this.validators.get(e.target);
      const action = e.target.action.slice(e.target.action.lastIndexOf('/') + 1);
      if (!formValidator || !formValidator.showIfAnyErrors()) {
        this[action]()
          .catch(msg => formValidator.raiseByKey(msg));
      }
    });

    this.validators = new Map();

    this.loggedStatus = false;

    this.username = '';
  }

  loginHandler(form = loginForm) {
    const { name, pass } = form.getFormData();
    return this.appService.login(name, pass)
      .then((responseText) => {
        if (responseText.code !== 200) {
          return Promise.reject(responseText.message);
        }
        this.username = name;
        this.loggedStatus = true;
        this.router.route('/about');
        return Promise.resolve();
      });
  }

  registrationHandler(form = registrationForm) {
    const { name, email, pass } = form.getFormData();
    return this.appService.register(name, email, pass)
      .then((responseText) => {
        if (responseText.code !== 200) {
          return Promise.reject(responseText.message);
        }
        this.username = name;
        this.loggedStatus = true;
        this.router.route('/about');
        return Promise.resolve();
      });
  }

  qStarter(form = gameOptionsForm) {
    const { attack, defend } = form.getFormData();
    console.log(attack, defend);
    return Promise.resolve();
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
          this.router.route();
        });
  }

  connectValidator(validator) {
    this.validators.set(validator.getForm(), validator);
  }
}

const app = new App();
app.checkLoggedStatus();
