/**
 * Created by andreivinogradov on 28.03.17.
 */

import registerCheck from '../validators/credentials_check';
import loginCheck from '../validators/login_check';
import { loginForm, registrationForm, gameOptionsForm, chatForm } from '../forms/forms';

const [playT, leadersT, notFoundT, aboutT, loginT, registerT, leadersTable]
= require('../../templates/brofest.js');

export default class Route {
  constructor(app, cont) {
    this.app = app;
    this.cacheTimers = {};
    this.cachedScripts = {};
    this.cont = cont;
    this.app.playButtonStatus = 'enabled';
    // Сохраняем загруженные представления
    this.cachedViews = {};
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
        // postRouteActions: [{
        //   key: 'startSingleplayer',
        //   func: this.app.startSingleGame.bind(this.app),
        //   cache: 0,
        // }],
        forms: [
          chatForm,
        ],
        forLogged: true,
      },
      leaders: {
        title: 'Лидеры',
        renderTemplate: () => Promise.resolve(leadersT({
          username: this.app.username,
          playButtonStatus: this.app.playButtonStatus,
        })),
        forms: [
          gameOptionsForm,
        ],
        postRouteActions: [{
          key: 'fetchLeadersTable',
          func: this.loadLeaders,
          cache: 10,
        }],
        forLogged: true,
      },
      about: {
        title: 'Об игре',
        renderTemplate: () => Promise.resolve(aboutT({
          username: this.app.username,
          playButtonStatus: this.app.playButtonStatus,
        })),
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
        this.cont.innerHTML = e.state.html;
        document.title = e.state.title;
        this.loadScripts(this.pages[e.state.path].scripts);
        this.loadPostRouteScripts(e.state.path);
      }
    };
  }

  loadLeaders() {
    const mainContent = document.querySelector('.main-content');
    return this.app.getLeaders()
      .then((responseText) => {
        console.log('leaders recieved');
        return new Promise((resolve) => {
          setTimeout(() => {
            mainContent.innerHTML = leadersTable(responseText);
            resolve({ data: mainContent.innerHTML, container: '.main-content' });
          }, 2000);
        });
      });
  }

  loadScripts(scripts = []) {
    scripts.forEach((script) => {
      script(this.app);
    });
  }

  loadPostRouteScripts(path) {
    if (this.pages[path] && this.pages[path].postRouteActions) {
      this.pages[path].postRouteActions.forEach((action) => {
        if (this.cachedScripts[action.key]) {
          const container =
            document.querySelector(this.cachedScripts[action.key].container);
          container.innerHTML = this.cachedScripts[action.key].data;
        } else {
          action.func.call(this)
            .then(({ data, container }) => {
              console.log('loaded!');
              if (data && container) {
                this.cachedScripts[action.key] = { data, container };
                this.cacheTimers[action.key] = action.cache;
                const timer = setInterval(() => {
                  this.cacheTimers[action.key] -= 1;
                  if (this.cacheTimers[action.key] <= 0) {
                    delete this.cachedScripts[action.key];
                    clearInterval(timer);
                  }
                }, 1000);
              }
            });
        }
      });
    }
  }

  renderView(content, path) {
    this.cont.innerHTML = content;
    if (this.pages[path] && this.pages[path].forms) {
      this.pages[path].forms.forEach((form) => {
        form.resetParent();
        form.render();
      });
    }
    this.loadPostRouteScripts(path);
    if (this.pages[path]) {
      this.loadScripts(this.pages[path].scripts);
    }
    window.history.pushState({
      html: this.cont.innerHTML,
      title: document.title,
      path,
    }, '', path);
    return this.cont.innerHTML;
  }

  route(url = window.location.href) {
    if (this.app.game.gameInstance) {
      this.app.game.gameInstance.destroy();
      this.app.game.gameInstance = undefined;
      this.app.gameSocket.close();
    }
    let path = url.slice(url.lastIndexOf('/') + 1) || 'about';
    if (!this.app.loggedStatus && this.pages[path] && this.pages[path].forLogged) {
      path = 'login';
    }
    document.title = this.pages[path] ? this.pages[path].title : 'Страница не найдена';
    if (this.cachedViews[path]) {
      this.renderView(this.cachedViews[path], path);
    } else {
      const view = this.pages[path] || this.pages.notFound;
      view.renderTemplate()
        .then((html) => {
          const fullHtml = this.renderView(html, path);
          if (this.pages[path] && this.pages[path].cache) {
            this.cachedViews[path] = fullHtml;
          }
          return Promise.resolve();
        });
    }
  }
}

// module.exports = Route;
