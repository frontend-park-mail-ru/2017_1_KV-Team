/**
 * Created by andreivinogradov on 26.02.17.
 */
const leadersT = require('./../templates/leaders.js');
const notFoundT = require('./../templates/404.js');
const aboutT = require('./../templates/about.js');
const loginT = require('./../templates/login.js');
const registerT = require('./../templates/registration.js');
const playT = require('./../templates/play.js');
const registerCheck = require('./credentials_check.js');
const loginCheck = require('./login_check.js');
const AppService = require('./appService.js');

// TODO in webpack before server start
// TODO automatically compile all xmls into js
// TODO change to MODULE EXPORTS
// TODO include into app js
// TODO automatically COMPILE bundle.js

const cont = document.querySelector('.container');

class App {
  constructor() {
    this.appService = new AppService();
    // Сохраняем уже загруженные скрипты
    this.loadedScripts = {};
    // Сохраняем загруженные представления
    this.cachedViews = {};
    // Информация о представлениях
    this.pages = {
      register: {
        title: 'Зарегистрироваться',
        template: registerT,
        scripts: [registerCheck],
        cache: true,
      },
      login: {
        title: 'Войти',
        template: loginT,
        scripts: [loginCheck],
        cache: true,
      },
      play: {
        title: 'Играть',
        template: playT,
        forLogged: true,
      },
      leaders: {
        title: 'Лидеры',
        template: leadersT,
        forLogged: true,
      },
      about: {
        title: 'Об игре',
        template: aboutT,
        forLogged: true,
        cache: true,
      },
      notFound: {
        title: 'Страница не найдена',
        template: notFoundT,
      },
    };
    cont.addEventListener('click', (e) => {
      if (e.target.classList.contains('no-reload')) {
        e.preventDefault();
        this.route(e.target.href);
      }
    });
    cont.addEventListener('submit', (e) => {
      e.preventDefault();
      const formValidator = this.validators.get(e.target);
      if (formValidator.showErrors()) {
        this.appService.login(...this.parseLoginForm(e.target), ({ responseText }) => {
          responseText = JSON.parse(responseText);
          if (responseText.code !== 200) {
            formValidator.raiseByKey(responseText.message);
          } else {
            this.logIn();
            this.route('/play');
          }
        });
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
  }
  logIn() {
    this.loggedStatus = true;
  }
  logOut() {
    this.loggedStatus = false;
  }
  parseLoginForm(form) {
    return [form.elements[0].value, form.elements[1].value];
  }
  loadScripts(scripts) {
    if (scripts) {
      scripts.forEach((script) => {
        script(this);
      });
    }
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
  route(url = window.location.href) {
    let path = url.slice(url.lastIndexOf('/') + 1) ? url.slice(url.lastIndexOf('/') + 1) : 'play';
    // if (!this.loggedStatus && this.pages[path] && this.pages[path].forLogged) {
    //   path = 'login';
    // }
    // if (path === 'login' || path === 'register') {
    //   this.logOut();
    // }
    document.title = this.pages[path] ? this.pages[path].title : 'Страница не найдена';
    if (this.cachedViews[path]) {
      this.renderView(this.cachedViews[path], path);
    } else {
      const html = this.pages[path] ? this.pages[path].template() : this.pages.notFound.template();
      this.renderView(html, path);
      if (this.pages[path] && this.pages[path].cache) {
        this.cachedViews[path] = html;
      }
      // this.constructor.getContent(path, (content) => {
      //   this.renderView(content, path);
      //   if (this.pages[path] && this.pages[path].cache) {
      //     this.cachedViews[path] = content;
      //   }
      // });
    }
  }
  connectValidator(validator) {
    this.validators.set(validator.getForm(), validator);
  }
}

const app = new App();
app.route();

global.app = app;
