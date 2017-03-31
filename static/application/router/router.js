/**
 * Created by andreivinogradov on 28.03.17.
 */
const [playT, leadersT, notFoundT, aboutT, loginT, registerT] = require('../../templates/brofest.js');
const registerCheck = require('../validators/credentials_check.js');
const loginCheck = require('../validators/login_check.js');
const { loginForm, registrationForm, gameOptionsForm } = require('../forms/forms.js');

const cont = document.querySelector('.container');

class Route {
  constructor(app) {
    this.app = app;
    this.pages = {
      register: {
        title: 'Зарегистрироваться',
        renderTemplate: () => Promise.resolve(registerT()),
        scripts: [registerCheck],
        forms: [
          registrationForm,
        ],
        cache: true,
      },
      login: {
        title: 'Войти',
        renderTemplate: () => Promise.resolve(loginT()),
        scripts: [loginCheck],
        forms: [
          loginForm,
        ],
        cache: true,
      },
      play: {
        title: 'Играть',
        renderTemplate: () => Promise.resolve(playT(this.app.username)),
        forLogged: true,
      },
      leaders: {
        title: 'Лидеры',
        renderTemplate: () => app.appService.getLeaders()
          .then(responseText =>
            Promise.resolve(leadersT({ username: this.app.username, leaders: responseText }))),
        forms: [
          gameOptionsForm,
        ],
        forLogged: true,
      },
      about: {
        title: 'Об игре',
        renderTemplate: () => Promise.resolve(aboutT(this.app.username)),
        forms: [
          gameOptionsForm,
        ],
        forLogged: true,
      },
      notFound: {
        title: 'Страница не найдена',
        renderTemplate: () => Promise.resolve(notFoundT()),
      },
    };
    window.onpopstate = (e) => {
      if (e.state) {
        cont.innerHTML = e.state.html;
        document.title = e.state.title;
        this.loadScripts(this.pages[e.state.path].scripts);
      }
    };
  }

  loadScripts(scripts = []) {
    scripts.forEach((script) => {
      script(this.app);
    });
  }

  renderView(content, path) {
    cont.innerHTML = content;
    if (this.pages[path] && this.pages[path].forms) {
      this.pages[path].forms.forEach((form) => {
        form.resetParent();
        form.render();
      });
    }
    if (this.pages[path]) {
      this.loadScripts(this.pages[path].scripts);
    }
    window.history.pushState({
      html: cont.innerHTML,
      title: document.title,
      path,
    }, '', path);
  }

  route(url = window.location.href) {
    let path = url.slice(url.lastIndexOf('/') + 1) || 'about';
    if (!this.app.loggedStatus && this.pages[path] && this.pages[path].forLogged) {
      path = 'login';
    }
    document.title = this.pages[path] ? this.pages[path].title : 'Страница не найдена';
    if (this.app.cachedViews[path]) {
      this.renderView(this.app.cachedViews[path], path);
    } else {
      const view = this.pages[path] || this.pages.notFound;
      view.renderTemplate()
        .then((html) => {
          this.renderView(html, path);
          if (this.pages[path] && this.pages[path].cache) {
            this.app.cachedViews[path] = html;
          }
        });
    }
  }
}

module.exports = Route;
