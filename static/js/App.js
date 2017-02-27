/**
 * Created by andreivinogradov on 26.02.17.
 */
const cont = document.querySelector('.container');

class App {
  constructor() {
    // Сохраняем уже загруженные скрипты
    this.loadedScripts = {};
    // Сохраняем загруженные представления
    this.cachedViews = {};
    // Информация о представлениях
    this.pages = {
      register: {
        title: 'Зарегистрироваться',
        scripts: [{
          src: 'sValidator.js',
          reload: false,
        }, {
          src: 'credentials_check.js',
          reload: true,
        }],
        cache: true,
      },
      login: {
        title: 'Войти',
        scripts: [{
          src: 'sValidator.js',
          reload: false,
        }, {
          src: 'login_check.js',
          reload: true,
        }],
        cache: true,
      },
      play: {
        title: 'Играть',
        forLogged: true,
      },
      leaders: {
        title: 'Лидеры',
        forLogged: true,
      },
      about: {
        title: 'Об игре',
        forLogged: true,
        cache: true,
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
        this.constructor.ajaxPost(e.target, (respMsg) => {
          if (respMsg !== 'success') {
            formValidator.raiseByKey(respMsg);
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
  static ajaxPost(form, callback) {
    const url = form.action;
    const xhr = new XMLHttpRequest();
    const params = Array.from(form.elements)
      .filter(el => !!el.name)
      .filter(el => !el.disabled)
      .map(el => `${encodeURIComponent(el.name)}=${encodeURIComponent(el.value)}`)
      .join('&');

    xhr.open('POST', url);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.onload = () => callback(xhr.responseText);
    xhr.send(params);
  }
  static getContent(url, callback) {
    const req = new XMLHttpRequest();
    req.onload = () => callback(req.responseText);
    req.open('GET', `views/${url}`);
    req.send(null);
  }
  loadScripts(scripts) {
    if (scripts) {
      scripts.forEach((scriptInfo) => {
        if (!this.loadedScripts[scriptInfo.src]) {
          const script = document.createElement('script');
          script.src = scriptInfo.src;
          script.defer = 'defer';
          document.body.appendChild(script);
          if (!scriptInfo.reload) {
            this.loadedScripts[scriptInfo.src] = true;
          }
        }
      });
    }
  }
  renderView(content, path) {
    window.history.pushState({ html: content }, '', path);
    cont.innerHTML = content;
    if (this.pages[path]) {
      this.loadScripts(this.pages[path].scripts);
    }
  }
  route(link) {
    const url = link || window.location.href;
    let path = url.slice(url.lastIndexOf('/') + 1) ? url.slice(url.lastIndexOf('/') + 1) : 'play';
    if (!this.loggedStatus && this.pages[path] && this.pages[path].forLogged) {
      path = 'login';
    }
    if (path === 'login' || path === 'register') {
      this.logOut();
    }
    document.title = this.pages[path] ? this.pages[path].title : 'Страница не найдена';
    if (this.cachedViews[path]) {
      this.renderView(this.cachedViews[path], path);
    } else {
      this.constructor.getContent(path, (content) => {
        this.renderView(content, path);
        if (this.pages[path] && this.pages[path].cache) {
          this.cachedViews[path] = content;
        }
      });
    }
  }
  connectValidator(validator) {
    this.validators.set(validator.getForm(), validator);
  }
}

const app = new App();
app.route();
