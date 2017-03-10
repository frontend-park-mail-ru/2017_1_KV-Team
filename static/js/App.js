/**
 * Created by andreivinogradov on 26.02.17.
 */
const leadersT = require('./../templates/compiled/leaders.js');
const notFoundT = require('./../templates/compiled/404.js');
const aboutT = require('./../templates/compiled/about.js');
const loginT = require('./../templates/compiled/login.js');
const registerT = require('./../templates/compiled/registration.js');
const playT = require('./../templates/compiled/play.js');
const registerCheck = require('./credentials_check.js');
const loginCheck = require('./login_check.js');
const AppService = require('../services/appService.js');
const Form = require('../components/form/form.js');

// TODO in webpack before server start
// TODO automatically compile all xmls into js
// TODO change to MODULE EXPORTS
// TODO include into app js
// TODO automatically COMPILE bundle.js

const cont = document.querySelector('.container');

const loginForm = new Form(
  {
    attributes: {
      id: 'login-form',
      action: 'loginHandler',
      noValidate: true,
    },
    parent: cont,
    fields: [
      {
        label: 'Логин',
        attributes: {
          type: 'text',
          name: 'name',
          id: 'login-name',
          placeholder: 'Введите логин',
        },
      },
      {
        label: 'Пароль',
        attributes: {
          type: 'password',
          name: 'pass',
          id: 'login-password',
          placeholder: 'Введите пароль',
        },
      },
    ],
    controls: [
      {
        type: 'a',
        attributes: {
          href: 'register',
          class: 'no-reload',
        },
        value: 'Зарегистрироваться',
      },
      {
        type: 'button',
        value: 'Войти',
      },
    ],
  });

const registrationForm = new Form(
  {
    attributes: {
      id: 'registration-form',
      action: 'registrationHandler',
      noValidate: true,
    },
    parent: cont,
    fields: [
      {
        label: 'Логин',
        attributes: {
          type: 'text',
          name: 'name',
          id: 'reg-name',
          placeholder: 'Придумайте логин',
        },
      },
      {
        label: 'Email',
        attributes: {
          type: 'email',
          name: 'email',
          id: 'email',
          placeholder: 'Введите свой email',
        },
      },
      {
        label: 'Пароль',
        attributes: {
          type: 'password',
          name: 'pass',
          id: 'reg-password',
          placeholder: 'Придумайте пароль',
        },
      },
      {
        label: 'Повторите пароль',
        attributes: {
          type: 'password',
          id: 'password2',
          placeholder: 'Повторите пароль',
        },
      },
    ],
    controls: [
      {
        type: 'a',
        attributes: {
          href: 'login',
          class: 'no-reload',
        },
        value: 'Уже есть аккаунт?',
      },
      {
        type: 'button',
        value: 'Зарегистрироваться',
      },
    ],
  });

class App {
  constructor() {
    // Подключаем сервис
    this.appService = new AppService();
    // Сохраняем загруженные представления
    this.cachedViews = {};
    // Информация о представлениях
    this.pages = {
      register: {
        title: 'Зарегистрироваться',
        renderTemplate: () => Promise.resolve(registerT(registrationForm.render())),
        scripts: [registerCheck],
        cache: true,
      },
      login: {
        title: 'Войти',
        renderTemplate: () => Promise.resolve(loginT(loginForm.render())),
        scripts: [loginCheck],
        cache: true,
      },
      play: {
        title: 'Играть',
        renderTemplate: () => Promise.resolve(playT(this.username)),
        forLogged: true,
      },
      leaders: {
        title: 'Лидеры',
        renderTemplate: () => this.appService.getLeaders()
            .then(responseText =>
              Promise.resolve(leadersT({ username: this.username, leaders: responseText }))),
        forLogged: true,
      },
      about: {
        title: 'Об игре',
        renderTemplate: () => Promise.resolve(aboutT(this.username)),
        forLogged: true,
      },
      notFound: {
        title: 'Страница не найдена',
        renderTemplate: () => Promise.resolve(notFoundT()),
      },
    };

    cont.addEventListener('click', (e) => {
      if (e.target.classList.contains('no-reload')) {
        e.preventDefault();
        if (e.target.classList.contains('logout-link')) {
          this.appService.logout()
            .then((responseText) => {
              if (responseText.code === 200) {
                this.loggedStatus = false;
                this.username = '';
                this.route(e.target.href);
              }
            });
        } else {
          this.route(e.target.href);
        }
      }
    });

    cont.addEventListener('submit', (e) => {
      e.preventDefault();
      const formValidator = this.validators.get(e.target);
      const action = e.target.action.slice(e.target.action.lastIndexOf('/') + 1);
      if (!formValidator.showIfAnyErrors()) {
        this[action]()
          .catch(msg => formValidator.raiseByKey(msg));
      }
    });

    window.onpopstate = (e) => {
      if (e.state) {
        cont.innerHTML = e.state.html;
        document.title = e.state.title;
        this.pages[e.state.path].scripts.forEach(script => script(this));
      }
    };

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
        this.route('/play');
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
        this.route('/play');
        return Promise.resolve();
      });
  }

  loadScripts(scripts = []) {
    scripts.forEach((script) => {
      script(this);
    });
  }

  renderView(content, path) {
    window.history.pushState({
      html: content,
      title: document.title,
      path,
    }, '', path);
    cont.innerHTML = content;
    if (this.pages[path]) {
      this.loadScripts(this.pages[path].scripts);
    }
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

  route(url = window.location.href) {
    let path = url.slice(url.lastIndexOf('/') + 1) ? url.slice(url.lastIndexOf('/') + 1) : 'play';
    if (!this.loggedStatus && this.pages[path] && this.pages[path].forLogged) {
      path = 'login';
    }
    document.title = this.pages[path] ? this.pages[path].title : 'Страница не найдена';
    if (this.cachedViews[path]) {
      this.renderView(this.cachedViews[path], path);
    } else {
      const view = this.pages[path] ? this.pages[path] : this.pages.notFound;
      view.renderTemplate()
        .then((html) => {
          this.renderView(html, path);
          if (this.pages[path] && this.pages[path].cache) {
            this.cachedViews[path] = html;
          }
        });
    }
  }

  connectValidator(validator) {
    this.validators.set(validator.getForm(), validator);
  }
}

const app = new App();
app.checkLoggedStatus();
