(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{"../services/appService.js":11,"./forms/forms.js":2,"./router/linker.js":3,"./router/router.js":4}],2:[function(require,module,exports){
/**
 * Created by andreivinogradov on 29.03.17.
 */
const Form = require('../../components/form/form.js');

const loginForm = new Form(
  {
    parentSelector: '.login-form-container',
    preset: 'entrance',
    attributes: {
      // id: 'login-form',
      class: 'form form_entrance',
      action: 'loginHandler',
      noValidate: true,
    },
    fields: [
      {
        label: 'Логин',
        attributes: {
          type: 'text',
          name: 'name',
          class: 'input form_entrance__input',
          id: 'login-name',
          placeholder: 'Введите логин',
        },
      },
      {
        label: 'Пароль',
        attributes: {
          type: 'password',
          name: 'pass',
          class: 'input form_entrance__input',
          id: 'login-password',
          placeholder: 'Введите пароль',
        },
      },
    ],
    controls: [
      {
        type: 'a',
        attributes: {
          class: 'controls__link',
          href: 'register',
          data_hot: 'true',
        },
        value: 'Зарегистрироваться',
      },
      {
        type: 'button',
        attributes: {
          class: 'btn btn_submit form_entrance__submit',
        },
        value: 'Войти',
      },
    ],
  });

const gameOptionsForm = new Form(
  {
    parentSelector: '.start-game-options-container',
    attributes: {
      class: 'form form_start-game-options',
      action: 'qStarter',
      method: 'GET',
    },
    fields: [
      {
        label: 'Атака',
        attributes: {
          type: 'checkbox',
          name: 'attack',
          class: 'form_start-game-options__checkbox',
          id: 'attack-side',
          // class: 'game-options',
        },
      },
      {
        label: 'Защита',
        attributes: {
          type: 'checkbox',
          name: 'defend',
          id: 'defend-side',
          class: 'form_start-game-options__checkbox',
          // class: 'game-options',
        },
      },
    ],
    controls: [
      {
        type: 'button',
        attributes: {
          class: 'btn btn_submit form_start-game-options__submit',
        },
        value: 'ОК',
      },
    ],
  });

const registrationForm = new Form(
  {
    parentSelector: '.registration-form-container',
    preset: 'entrance',
    attributes: {
      // id: 'registration-form',
      class: 'form form_entrance',
      action: 'registrationHandler',
      noValidate: true,
    },
    fields: [
      {
        label: 'Логин',
        attributes: {
          type: 'text',
          name: 'name',
          id: 'reg-name',
          class: 'input form_entrance__input',
          placeholder: 'Придумайте логин',
        },
      },
      {
        label: 'Email',
        attributes: {
          type: 'email',
          name: 'email',
          id: 'email',
          class: 'input form_entrance__input',
          placeholder: 'Введите свой email',
        },
      },
      {
        label: 'Пароль',
        attributes: {
          type: 'password',
          name: 'pass',
          id: 'reg-password',
          class: 'input form_entrance__input',
          placeholder: 'Придумайте пароль',
        },
      },
      {
        label: 'Повторите пароль',
        attributes: {
          type: 'password',
          id: 'password2',
          class: 'input form_entrance__input',
          placeholder: 'Повторите пароль',
        },
      },
    ],
    controls: [
      {
        type: 'a',
        attributes: {
          href: 'login',
          class: 'controls__link',
          data_hot: 'true',
        },
        value: 'Уже есть аккаунт?',
      },
      {
        type: 'button',
        attributes: {
          class: 'btn btn_submit form_entrance__submit',
        },
        value: 'Зарегистрироваться',
      },
    ],
  });

module.exports = { loginForm, registrationForm, gameOptionsForm };

},{"../../components/form/form.js":9}],3:[function(require,module,exports){
/**
 * Created by andreivinogradov on 28.03.17.
 */

// Отдаем в функцию объект приложения, для того чтобы линкер мог использовать его методы
const linker = app => (e) => {
  // const classList = e.target.classList;
  const link = e.target;

  // Проверяем нужно ли обрабатывать ссылку роутером
  if (!link.dataset.hot) {
    return;
  }

  e.preventDefault();

  const whatToDoBeforeRoute = [Promise.resolve()];

  if (link.dataset.act === 'logout') {
    whatToDoBeforeRoute.push(app.appService.logout()
      .then((responseText) => {
        if (responseText.code === 200) {
          app.loggedStatus = false;
          app.username = '';
          return Promise.resolve(responseText.code);
        }
        return Promise.reject(responseText.code);
      }));
  }

  if (link.dataset.act === 'game-start-options') {
    const gameStartOpt = document.querySelector('.start-game-options-container');
    e.target.parentNode.classList.toggle('navigation__item_active');
    link.classList.toggle('navigation__link_active');
    gameStartOpt.classList.toggle('start-game-options-container_visible');
  }

  Promise.all(whatToDoBeforeRoute)
    .then(() => {
      if (!e.target.href.endsWith('#')) {
        app.router.route(e.target.href);
      }
    }, console.log);
};

module.exports = linker;

},{}],4:[function(require,module,exports){
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

},{"../../templates/brofest.js":12,"../forms/forms.js":2,"../validators/credentials_check.js":6,"../validators/login_check.js":7}],5:[function(require,module,exports){
/**
 * Created by andreivinogradov on 20.02.17.
 */

class Valnder {
  static isEmpty(input) {
    return !!input;
  }

  constructor() {
    this.fields = new Map();
    this.serverSideValidationErrors = {};
  }

  register(form) {
    this.form = form;
  }

  showIfAnyErrors() {
    let isInvalid = false;
    this.fields.forEach((errors, elem) => {
      const field = elem;
      const err = this.checkAll(errors);
      if (err) {
        isInvalid = true;
      }
      field.parentNode.querySelector(this.containerClass).innerHTML = err;
    });
    return isInvalid;
  }

  checkAll(errors, index = 0) {
    if (!errors[index].validator()) {
      return this.render(errors[index].message);
    }
    if (errors.length - 1 === index) {
      return '';
    }
    return this.checkAll(errors, index + 1);
  }

  addValidation(field, msg, valFn = this.constructor.isEmpty) {
    const fields = field.constructor === Array ? field : [field];
    if (!this.fields.has(fields[0])) {
      this.fields.set(fields[0], [{
        validator: () => valFn(...(fields.map(el => el.value))),
        message: msg,
      }]);
      return;
    }
    const fieldErrArray = this.fields.get(fields[0]);
    fieldErrArray.push({
      validator: () => valFn(...(fields.map(el => el.value))),
      message: msg,
    });
  }

  addServerSideValidation(field, msg, key) {
    if (this.serverSideValidationErrors[key]) {
      console.log('Ошибка с таким ключом уже существует!');
    } else {
      this.serverSideValidationErrors[key] = { field, msg };
    }
  }

  showError(elem, msg) {
    const field = elem;
    field.parentNode.querySelector(this.containerClass).innerHTML = this.render(msg);
  }

  raiseByKey(key) {
    this.showError(this.serverSideValidationErrors[key].field,
      this.serverSideValidationErrors[key].msg);
  }

  getForm() {
    return this.form;
  }

  renderFunction(fn) {
    this.render = fn;
  }

  renderTo(cls) {
    this.containerClass = cls;
  }
}

module.exports = Valnder;

},{}],6:[function(require,module,exports){

const Valnder = require('../sValidator.js');

module.exports = (app) => {
  const nameInput = document.getElementById('reg-name');
  const passwordInput = document.getElementById('reg-password');
  const passwordCheckInput = document.getElementById('password2');
  const email = document.getElementById('email');
  const regForm = document.querySelector('.form_entrance');

  const emailRegex = new RegExp('^(([^<>()\\[\\]\\\\.,;:\\s@"]+(\\.[^<>()\\[\\]\\\\.,;:\\s' +
    '@"]+)*)|(".+"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}' +
    '\\.[0-9]{1,3}\\.[0-9]{1,3}])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$');

// Новый объект валидатора
  const val = new Valnder();

// Регистрируем форму для валидации
  val.register(regForm);

// Передаем поле для валидации (внутри формы) и сообщение об ошибке, если третьего параметра нет,
// то идет проверка на пустое поле
  val.addValidation(email, 'Поле email не может быть пустым');
// Если третьим параметром передаем функцию - то проверка идет по этой функции
  val.addValidation(email, 'Неправильный формат email', input => emailRegex.test(input));

  val.addValidation(nameInput, 'Поле логина не может быть пустым');

  val.addValidation(passwordInput, 'Поле пароля не может быть пустым');
  val.addValidation(passwordInput, 'Пароль должен быть длиннее 6 символов', input => input.length > 6);

  val.addValidation(passwordCheckInput, 'Поле повторного ввода пароля не может быть пустым');
// Можно передовать несколько полей в массиве, ошибка выводится у первого поля, функция принимает
// столько параметров сколько полей
  val.addValidation([passwordCheckInput, passwordInput], 'Пароли не совпадают',
    (pass, passCheck) => pass === passCheck);

// В данном случае валидация происходит на сервере, третий параметр - имя в объекте серверных
// ошибок, четвертый параметр - url для проверки данного поля через ajax
  val.addServerSideValidation(nameInput, 'Пользователь с таким именем уже существует',
    'already exists');

// В функцию рендера передается функция которая возвращает html с ошибкой
  val.renderFunction(text => `<p class='input-error'>${text}</p>`);

// В эту функцию передается класс контейнера для ошибки
  val.renderTo('.input-item__error');

  app.connectValidator(val);
};

},{"../sValidator.js":5}],7:[function(require,module,exports){
/**
 * Created by andreivinogradov on 27.02.17.
 */
const Valnder = require('../sValidator.js');

module.exports = (app) => {
  const loginField = document.getElementById('login-name');
  const passField = document.getElementById('login-password');
  const loginForm = document.querySelector('.form_entrance');

  const loginValidator = new Valnder();
  loginValidator.register(loginForm);

  loginValidator.addValidation(loginField, 'Поле логина не может быть пустым');

  loginValidator.addValidation(passField, 'Поле пароля не может быть пустым');
  // Четвертый параметр - url для проверки поля через ajax (если нету, то это url всей формы)
  loginValidator.addServerSideValidation(loginField, 'Неправильный логин/пароль', 'Access denied');

  loginValidator.renderFunction(text => `<p class='input-error'>${text}</p>`);

  loginValidator.renderTo('.input-item__error');

  app.connectValidator(loginValidator);
};

},{"../sValidator.js":5}],8:[function(require,module,exports){
/**
 * Created by andreivinogradov on 05.03.17.
 */
class Button {
  constructor({ text = '', attrs = { class: 'btn' } }) {
    this.text = text;
    this.attrs = attrs;
  }

  setAttrs(attrs = this.attrs) {
    return Object.keys(attrs).map(attr => `
        ${attr.startsWith('data_') ? attr.replace('_', '-') : attr}
        ="${attrs[attr]}"`)
      .join(' ');
  }

  render() {
    return `
      <button type=submit ${this.setAttrs()}>${this.text}</button>
    `;
  }
}

module.exports = Button;

},{}],9:[function(require,module,exports){
/**
 * Created by andreivinogradov on 05.03.17.
 */
const Button = require('../button/button.js');

class Form {
  constructor({ parentSelector, preset = 'default', fields = [], attributes = {}, controls = [] }) {
    this.fields = fields;
    this.attributes = attributes;
    this.controls = controls;
    this.html = '';
    this.parentSelector = parentSelector;

    this.presets = {
      entrance: {
        general: () => `
        <form ${this.attrsAsString()}>
          <ul class="form_entrance__list">
            ${this.getFields()}
            <li class="controls form_entrance__item">
              <div class="form_entrance__space-taker"></div>
              ${this.installControls()}
            </li>
          </ul>
        <form>
      `,
        field: field => `
          <li class="input-item form_entrance__item">
            <label class="input-item__label" for="${field.attributes.id}">${field.label}</label> 
            <div>
              <input ${this.attrsAsString(field.attributes)}">
              <div class="input-item__error"></div>
            </div>
          </li>
      `,
        control: control =>
          (control.type === 'button' ?
            new Button({ text: control.value, attrs: control.attributes }).render() :
            `<${control.type} ${this.attrsAsString(control.attributes)}>
           ${control.value}
          </${control.type}>
        `) },

      default: {
        general: () => `      
        <form ${this.attrsAsString()}>
          <div class="form_start-game-options__select-role">Выберите роль:</div>
            ${this.getFields()}
            ${this.installControls()}
        <form>
        `,
        field: field => `
          <input ${this.attrsAsString(field.attributes)}">
          <label class="form_start-game-options__label" for="${field.attributes.id}">${field.label}</label> 
        `,
        control: control =>
          (control.type === 'button' ?
            new Button({ text: control.value, attrs: control.attributes }).render() :
            `<${control.type} ${this.attrsAsString(control.attributes)}>
           ${control.value}
          </${control.type}>
        `),
      } };

    this.preset = this.presets[preset];
  }

  resetParent() {
    this.parent = document.querySelector(this.parentSelector);
  }

  render() {
    this.updateHtml();

    this.parent.innerHTML = this.html;
  }

  getFields() {
    return this.fields.map(this.preset.field)
      .join('');
  }

  attrsAsString(attributes = this.attributes) {
    return Object.keys(attributes).map(attr => `
        ${attr.startsWith('data_') ? attr.replace('_', '-') : attr}
        ="${attributes[attr]}"`)
      .join(' ');
  }

  updateHtml() {
    this.html = this.preset.general();
  }

  installControls() {
    return this.controls.map(this.preset.control).join(' ');
  }

  getFormData() {
    const form = this.parent.querySelector('form');
    const elements = form.elements;
    const fields = {};

    Object.keys(elements).forEach((element) => {
      const name = elements[element].name;

      let value;
      if (elements[element].type === 'checkbox') {
        value = elements[element].checked;
      } else {
        value = elements[element].value;
      }

      if (!name) {
        return;
      }

      fields[name] = value;
    });

    return fields;
  }
}

module.exports = Form;

},{"../button/button.js":8}],10:[function(require,module,exports){
/**
 * Created by andreivinogradov on 06.03.17.
 */

const protocol = 'http';
const hostname = 'localhost';
const portNumber = '8082';

class HTTP {
  constructor() {
    if (HTTP.instance) {
      return HTTP.instance;
    }

    this.headers = {};

    this.options = {
      method: 'GET',
      credentials: 'include',
      mode: 'cors',
      headers: this.headers,
    };

    this.postOptions = Object.assign({},
      this.options,
      {
        method: 'post',
        headers: Object.assign({ 'Content-type': 'application/json; charset=utf-8' }, this.headers),
      });

    this.baseUrl = `${protocol}://${hostname}:${portNumber}`;

    HTTP.instance = this;
  }

  get Headers() {
    return this.headers;
  }

  set Headers(value) {
    if (!(value && (value.toString() === '[object Object]'))) {
      throw new TypeError('Headers must be a plain object');
    }
    const valid = Object.keys(value).every(key => typeof value[key] === 'string');
    if (!valid) {
      throw new TypeError('Headers must be a plain object');
    }
    this.headers = value;
  }

  get BaseURL() {
    return this.baseUrl;
  }

  set BaseURL(value) {
    this.baseUrl = value;
  }

  get(address, query = null) {
    let url = `${this.baseUrl}${address}`;
    if (query) {
      url += Object.keys(query)
        .map(name => encodeURIComponent(`${name}=${query[name]}`))
        .join('&');
    }
    return fetch(url, this.options)
      .then(resp => resp.json());
  }

  post(address, body = null) {
    const url = `${this.baseUrl}${address}`;
    const opt = Object.assign({}, this.postOptions, { body: JSON.stringify(body) || null });
    return fetch(url, opt)
      .then(resp => resp.json());
  }

  put(address, body = null) {
    const url = `${this.baseUrl}${address}`;
    const opt = Object.assign({},
      this.postOptions,
      {
        body: JSON.stringify(body) || null,
        method: 'put',
      });
    return fetch(url, opt)
      .then(resp => resp.json());
  }
}

module.exports = HTTP;

},{}],11:[function(require,module,exports){
/**
 * Created by andreivinogradov on 06.03.17.
 */
const HTTP = require('../modules/http.js');

class AppService {
  constructor() {
    this.http = new HTTP();
  }
  getLeaders() {
    return this.http.get('/api/leaders');
  }
  isLoggedIn() {
    return this.http.get('/api/isloggedin');
  }
  login(username, password) {
    const body = { username, password };
    return this.http.post('/api/login', body);
  }
  logout() {
    return this.http.get('/api/logout');
  }
  register(username, email, password) {
    const body = { username, email, password };
    return this.http.post('/api/account', body);
  }
  getAccount(username) {
    return this.http.get('/api/account/', { username });
  }
  editAccount(newEmail, newPass) {
    const body = { newEmail, newPass };
    return this.http.put('/api/account', body);
  }
}

module.exports = AppService;

},{"../modules/http.js":10}],12:[function(require,module,exports){
/**
 * Created by andreivinogradov on 23.03.17.
 */


const path = require('path');

const playTSrc = ";(function(){var x=Function('return this')();if(!x.fest)x.fest={};x.fest['../../static/templates/src/play']=function (__fest_context){\"use strict\";var __fest_self=this,__fest_buf=\"\",__fest_chunks=[],__fest_chunk,__fest_attrs=[],__fest_select,__fest_if,__fest_iterator,__fest_to,__fest_fn,__fest_html=\"\",__fest_blocks={},__fest_params,__fest_element,__fest_debug_file=\"\",__fest_debug_line=\"\",__fest_debug_block=\"\",__fest_element_stack = [],__fest_short_tags = {\"area\": true, \"base\": true, \"br\": true, \"col\": true, \"command\": true, \"embed\": true, \"hr\": true, \"img\": true, \"input\": true, \"keygen\": true, \"link\": true, \"meta\": true, \"param\": true, \"source\": true, \"wbr\": true},__fest_jschars = /[\\\\'\"\\/\\n\\r\\t\\b\\f<>]/g,__fest_jschars_test = /[\\\\'\"\\/\\n\\r\\t\\b\\f<>]/,__fest_htmlchars = /[&<>\"]/g,__fest_htmlchars_test = /[&<>\"]/,__fest_jshash = {\"\\\"\": \"\\\\\\\"\", \"\\\\\": \"\\\\\\\\\", \"/\": \"\\\\/\", \"\\n\": \"\\\\n\", \"\\r\": \"\\\\r\", \"\\t\": \"\\\\t\", \"\\b\": \"\\\\b\", \"\\f\": \"\\\\f\", \"'\": \"\\\\'\", \"<\": \"\\\\u003C\", \">\": \"\\\\u003E\"},__fest_htmlhash = {\"&\": \"&amp;\", \"<\": \"&lt;\", \">\": \"&gt;\", \"\\\"\": \"&quot;\"},__fest_escapeJS = function __fest_escapeJS(value) {\n\t\tif (typeof value === 'string') {\n\t\t\tif (__fest_jschars_test.test(value)) {\n\t\t\t\treturn value.replace(__fest_jschars, __fest_replaceJS);\n\t\t\t}\n\t\t}\n\n\t\treturn value == null ? '' : value;\n\t},__fest_replaceJS = function __fest_replaceJS(chr) {\n\t\treturn __fest_jshash[chr];\n\t},__fest_escapeHTML = function __fest_escapeHTML(value) {\n\t\tif (typeof value === 'string') {\n\t\t\tif (__fest_htmlchars_test.test(value)) {\n\t\t\t\treturn value.replace(__fest_htmlchars, __fest_replaceHTML);\n\t\t\t}\n\t\t}\n\n\t\treturn value == null ? '' : value;\n\t},__fest_replaceHTML = function __fest_replaceHTML(chr) {\n\t\treturn __fest_htmlhash[chr];\n\t},__fest_extend = function __fest_extend(dest, src) {\n\t\tfor (var key in src) {\n\t\t\tif (src.hasOwnProperty(key)) {\n\t\t\t\tdest[key] = src[key];\n\t\t\t}\n\t\t}\n\t},__fest_param = function __fest_param(fn) {\n\t\tfn.param = true;\n\t\treturn fn;\n\t},i18n=__fest_self && typeof __fest_self.i18n === \"function\" ? __fest_self.i18n : function (str) {return str;},___fest_log_error;if(typeof __fest_error === \"undefined\"){___fest_log_error = (typeof console !== \"undefined\" && console.error) ? function(){return Function.prototype.apply.call(console.error, console, arguments)} : function(){};}else{___fest_log_error=__fest_error};function __fest_log_error(msg){___fest_log_error(msg+\"\\nin block \\\"\"+__fest_debug_block+\"\\\" at line: \"+__fest_debug_line+\"\\nfile: \"+__fest_debug_file)}function __fest_call(fn, params,cp){if(cp)for(var i in params)if(typeof params[i]==\"function\"&&params[i].param)params[i]=params[i]();return fn.call(__fest_self,params)}var user=__fest_context;try{var active = { active: 'play', nick: user }}catch(e){__fest_log_error(e.message);}var __fest_context0;try{__fest_context0=active}catch(e){__fest_context0={};__fest_log_error(e.message)};(function(__fest_context){var info=__fest_context;__fest_buf+=(\"<div class=\\\"user-bar\\\">Вы вошли как \");try{__fest_buf+=(__fest_escapeHTML(info.nick))}catch(e){__fest_log_error(e.message + \"4\");}__fest_buf+=(\"</div><nav class=\\\"navigation navigation_main\\\"><ul class=\\\"navigation__list\\\">\");try{__fest_attrs[0]=__fest_escapeHTML(info.active==='play'?'navigation__item_active':'')}catch(e){__fest_attrs[0]=\"\"; __fest_log_error(e.message);}__fest_buf+=(\"<li class=\\\"navigation__item \" + __fest_attrs[0] + \"\\\">\");try{__fest_attrs[0]=__fest_escapeHTML(info.active==='play'?'navigation__link_active':'')}catch(e){__fest_attrs[0]=\"\"; __fest_log_error(e.message);}__fest_buf+=(\"<a href=\\\"#\\\" class=\\\"navigation__link \" + __fest_attrs[0] + \"\\\" data-act=\\\"game-start-options\\\" data-hot=\\\"true\\\" title=\\\"Игра\\\">Игра</a></li><div class=\\\"start-game-options-container\\\"></div>\");try{__fest_attrs[0]=__fest_escapeHTML(info.active==='leaders'?'navigation__item_active':'')}catch(e){__fest_attrs[0]=\"\"; __fest_log_error(e.message);}__fest_buf+=(\"<li class=\\\"navigation__item \" + __fest_attrs[0] + \"\\\">\");try{__fest_attrs[0]=__fest_escapeHTML(info.active==='leaders'?'navigation__link_active':'')}catch(e){__fest_attrs[0]=\"\"; __fest_log_error(e.message);}__fest_buf+=(\"<a href=\\\"leaders\\\" class=\\\"navigation__link \" + __fest_attrs[0] + \"\\\" data-hot=\\\"true\\\" title=\\\"Лидерборд\\\">Лидерборд</a></li>\");try{__fest_attrs[0]=__fest_escapeHTML(info.active==='about'?'navigation__item_active':'')}catch(e){__fest_attrs[0]=\"\"; __fest_log_error(e.message);}__fest_buf+=(\"<li class=\\\"navigation__item \" + __fest_attrs[0] + \"\\\">\");try{__fest_attrs[0]=__fest_escapeHTML(info.active==='about'?'navigation__link_active':'')}catch(e){__fest_attrs[0]=\"\"; __fest_log_error(e.message);}__fest_buf+=(\"<a href=\\\"about\\\" class=\\\"navigation__link \" + __fest_attrs[0] + \"\\\" data-hot=\\\"true\\\" title=\\\"Об игре\\\">Об игре</a></li><li class=\\\"navigation__item\\\"><a href=\\\"login\\\" class=\\\"navigation__link\\\" data-hot=\\\"true\\\" data-act=\\\"logout\\\" title=\\\"Выход\\\">Выход</a></li></ul></nav>\");})(__fest_context0);__fest_buf+=(\"<div class=\\\"main-content-container\\\"><div class=\\\"game\\\"></div></div>\");__fest_to=__fest_chunks.length;if (__fest_to) {__fest_iterator = 0;for (;__fest_iterator<__fest_to;__fest_iterator++) {__fest_chunk=__fest_chunks[__fest_iterator];if (typeof __fest_chunk===\"string\") {__fest_html+=__fest_chunk;} else {__fest_fn=__fest_blocks[__fest_chunk.name];if (__fest_fn) __fest_html+=__fest_call(__fest_fn,__fest_chunk.params,__fest_chunk.cp);}}return __fest_html+__fest_buf;} else {return __fest_buf;}}})();";
const leadersTSrc = ";(function(){var x=Function('return this')();if(!x.fest)x.fest={};x.fest['../../static/templates/src/leaders']=function (__fest_context){\"use strict\";var __fest_self=this,__fest_buf=\"\",__fest_chunks=[],__fest_chunk,__fest_attrs=[],__fest_select,__fest_if,__fest_iterator,__fest_to,__fest_fn,__fest_html=\"\",__fest_blocks={},__fest_params,__fest_element,__fest_debug_file=\"\",__fest_debug_line=\"\",__fest_debug_block=\"\",__fest_element_stack = [],__fest_short_tags = {\"area\": true, \"base\": true, \"br\": true, \"col\": true, \"command\": true, \"embed\": true, \"hr\": true, \"img\": true, \"input\": true, \"keygen\": true, \"link\": true, \"meta\": true, \"param\": true, \"source\": true, \"wbr\": true},__fest_jschars = /[\\\\'\"\\/\\n\\r\\t\\b\\f<>]/g,__fest_jschars_test = /[\\\\'\"\\/\\n\\r\\t\\b\\f<>]/,__fest_htmlchars = /[&<>\"]/g,__fest_htmlchars_test = /[&<>\"]/,__fest_jshash = {\"\\\"\": \"\\\\\\\"\", \"\\\\\": \"\\\\\\\\\", \"/\": \"\\\\/\", \"\\n\": \"\\\\n\", \"\\r\": \"\\\\r\", \"\\t\": \"\\\\t\", \"\\b\": \"\\\\b\", \"\\f\": \"\\\\f\", \"'\": \"\\\\'\", \"<\": \"\\\\u003C\", \">\": \"\\\\u003E\"},__fest_htmlhash = {\"&\": \"&amp;\", \"<\": \"&lt;\", \">\": \"&gt;\", \"\\\"\": \"&quot;\"},__fest_escapeJS = function __fest_escapeJS(value) {\n\t\tif (typeof value === 'string') {\n\t\t\tif (__fest_jschars_test.test(value)) {\n\t\t\t\treturn value.replace(__fest_jschars, __fest_replaceJS);\n\t\t\t}\n\t\t}\n\n\t\treturn value == null ? '' : value;\n\t},__fest_replaceJS = function __fest_replaceJS(chr) {\n\t\treturn __fest_jshash[chr];\n\t},__fest_escapeHTML = function __fest_escapeHTML(value) {\n\t\tif (typeof value === 'string') {\n\t\t\tif (__fest_htmlchars_test.test(value)) {\n\t\t\t\treturn value.replace(__fest_htmlchars, __fest_replaceHTML);\n\t\t\t}\n\t\t}\n\n\t\treturn value == null ? '' : value;\n\t},__fest_replaceHTML = function __fest_replaceHTML(chr) {\n\t\treturn __fest_htmlhash[chr];\n\t},__fest_extend = function __fest_extend(dest, src) {\n\t\tfor (var key in src) {\n\t\t\tif (src.hasOwnProperty(key)) {\n\t\t\t\tdest[key] = src[key];\n\t\t\t}\n\t\t}\n\t},__fest_param = function __fest_param(fn) {\n\t\tfn.param = true;\n\t\treturn fn;\n\t},i18n=__fest_self && typeof __fest_self.i18n === \"function\" ? __fest_self.i18n : function (str) {return str;},___fest_log_error;if(typeof __fest_error === \"undefined\"){___fest_log_error = (typeof console !== \"undefined\" && console.error) ? function(){return Function.prototype.apply.call(console.error, console, arguments)} : function(){};}else{___fest_log_error=__fest_error};function __fest_log_error(msg){___fest_log_error(msg+\"\\nin block \\\"\"+__fest_debug_block+\"\\\" at line: \"+__fest_debug_line+\"\\nfile: \"+__fest_debug_file)}function __fest_call(fn, params,cp){if(cp)for(var i in params)if(typeof params[i]==\"function\"&&params[i].param)params[i]=params[i]();return fn.call(__fest_self,params)}var info=__fest_context;try{var active = { active: 'leaders', nick: info.username }}catch(e){__fest_log_error(e.message);}var __fest_context0;try{__fest_context0=active}catch(e){__fest_context0={};__fest_log_error(e.message)};(function(__fest_context){var info=__fest_context;__fest_buf+=(\"<div class=\\\"user-bar\\\">Вы вошли как \");try{__fest_buf+=(__fest_escapeHTML(info.nick))}catch(e){__fest_log_error(e.message + \"4\");}__fest_buf+=(\"</div><nav class=\\\"navigation navigation_main\\\"><ul class=\\\"navigation__list\\\">\");try{__fest_attrs[0]=__fest_escapeHTML(info.active==='play'?'navigation__item_active':'')}catch(e){__fest_attrs[0]=\"\"; __fest_log_error(e.message);}__fest_buf+=(\"<li class=\\\"navigation__item \" + __fest_attrs[0] + \"\\\">\");try{__fest_attrs[0]=__fest_escapeHTML(info.active==='play'?'navigation__link_active':'')}catch(e){__fest_attrs[0]=\"\"; __fest_log_error(e.message);}__fest_buf+=(\"<a href=\\\"#\\\" class=\\\"navigation__link \" + __fest_attrs[0] + \"\\\" data-act=\\\"game-start-options\\\" data-hot=\\\"true\\\" title=\\\"Игра\\\">Игра</a></li><div class=\\\"start-game-options-container\\\"></div>\");try{__fest_attrs[0]=__fest_escapeHTML(info.active==='leaders'?'navigation__item_active':'')}catch(e){__fest_attrs[0]=\"\"; __fest_log_error(e.message);}__fest_buf+=(\"<li class=\\\"navigation__item \" + __fest_attrs[0] + \"\\\">\");try{__fest_attrs[0]=__fest_escapeHTML(info.active==='leaders'?'navigation__link_active':'')}catch(e){__fest_attrs[0]=\"\"; __fest_log_error(e.message);}__fest_buf+=(\"<a href=\\\"leaders\\\" class=\\\"navigation__link \" + __fest_attrs[0] + \"\\\" data-hot=\\\"true\\\" title=\\\"Лидерборд\\\">Лидерборд</a></li>\");try{__fest_attrs[0]=__fest_escapeHTML(info.active==='about'?'navigation__item_active':'')}catch(e){__fest_attrs[0]=\"\"; __fest_log_error(e.message);}__fest_buf+=(\"<li class=\\\"navigation__item \" + __fest_attrs[0] + \"\\\">\");try{__fest_attrs[0]=__fest_escapeHTML(info.active==='about'?'navigation__link_active':'')}catch(e){__fest_attrs[0]=\"\"; __fest_log_error(e.message);}__fest_buf+=(\"<a href=\\\"about\\\" class=\\\"navigation__link \" + __fest_attrs[0] + \"\\\" data-hot=\\\"true\\\" title=\\\"Об игре\\\">Об игре</a></li><li class=\\\"navigation__item\\\"><a href=\\\"login\\\" class=\\\"navigation__link\\\" data-hot=\\\"true\\\" data-act=\\\"logout\\\" title=\\\"Выход\\\">Выход</a></li></ul></nav>\");})(__fest_context0);__fest_buf+=(\"<div class=\\\"main-content-container\\\"><div class=\\\"main-content\\\"><table id=\\\"leaderboard\\\"><col width=\\\"300\\\"/><col width=\\\"150\\\"/><col width=\\\"100\\\"/><thead><tr class=\\\"leaderboard__head-row\\\"><th class=\\\"leaderboard__head-element\\\"><a href=\\\"\\\" class=\\\"leaderboard__head-row-link\\\">Игрок</a></th><th class=\\\"leaderboard__head-element\\\"><a href=\\\"\\\" class=\\\"leaderboard__head-row-link\\\">Уровень</a></th><th class=\\\"leaderboard__head-element\\\"><a href=\\\"\\\" class=\\\"leaderboard__head-row-link\\\">Рейтинг</a></th></tr></thead><tbody>\");var i,v,__fest_to1,__fest_iterator1;try{__fest_iterator1=info.leaders || [];__fest_to1=__fest_iterator1.length;}catch(e){__fest_iterator1=[];__fest_to1=0;__fest_log_error(e.message);}for(i=0;i<__fest_to1;i++){v=__fest_iterator1[i];__fest_buf+=(\"<tr class=\\\"leaderboard__body-row\\\"><td><a href=\\\"\\\" class=\\\"leaderboard__user-link\\\">\");try{__fest_buf+=(__fest_escapeHTML(v.username))}catch(e){__fest_log_error(e.message + \"27\");}__fest_buf+=(\"</a></td><td>\");try{__fest_buf+=(__fest_escapeHTML(v.level))}catch(e){__fest_log_error(e.message + \"29\");}__fest_buf+=(\"</td><td>\");try{__fest_buf+=(__fest_escapeHTML(v.rating))}catch(e){__fest_log_error(e.message + \"30\");}__fest_buf+=(\"</td></tr>\");}__fest_buf+=(\"</tbody></table></div></div>\");__fest_to=__fest_chunks.length;if (__fest_to) {__fest_iterator = 0;for (;__fest_iterator<__fest_to;__fest_iterator++) {__fest_chunk=__fest_chunks[__fest_iterator];if (typeof __fest_chunk===\"string\") {__fest_html+=__fest_chunk;} else {__fest_fn=__fest_blocks[__fest_chunk.name];if (__fest_fn) __fest_html+=__fest_call(__fest_fn,__fest_chunk.params,__fest_chunk.cp);}}return __fest_html+__fest_buf;} else {return __fest_buf;}}})();";
const notFoundTSrc = ";(function(){var x=Function('return this')();if(!x.fest)x.fest={};x.fest['../../static/templates/src/404']=function (__fest_context){\"use strict\";var __fest_self=this,__fest_buf=\"\",__fest_chunks=[],__fest_chunk,__fest_attrs=[],__fest_select,__fest_if,__fest_iterator,__fest_to,__fest_fn,__fest_html=\"\",__fest_blocks={},__fest_params,__fest_element,__fest_debug_file=\"\",__fest_debug_line=\"\",__fest_debug_block=\"\",__fest_element_stack = [],__fest_short_tags = {\"area\": true, \"base\": true, \"br\": true, \"col\": true, \"command\": true, \"embed\": true, \"hr\": true, \"img\": true, \"input\": true, \"keygen\": true, \"link\": true, \"meta\": true, \"param\": true, \"source\": true, \"wbr\": true},__fest_jschars = /[\\\\'\"\\/\\n\\r\\t\\b\\f<>]/g,__fest_jschars_test = /[\\\\'\"\\/\\n\\r\\t\\b\\f<>]/,__fest_htmlchars = /[&<>\"]/g,__fest_htmlchars_test = /[&<>\"]/,__fest_jshash = {\"\\\"\": \"\\\\\\\"\", \"\\\\\": \"\\\\\\\\\", \"/\": \"\\\\/\", \"\\n\": \"\\\\n\", \"\\r\": \"\\\\r\", \"\\t\": \"\\\\t\", \"\\b\": \"\\\\b\", \"\\f\": \"\\\\f\", \"'\": \"\\\\'\", \"<\": \"\\\\u003C\", \">\": \"\\\\u003E\"},__fest_htmlhash = {\"&\": \"&amp;\", \"<\": \"&lt;\", \">\": \"&gt;\", \"\\\"\": \"&quot;\"},__fest_escapeJS = function __fest_escapeJS(value) {\n\t\tif (typeof value === 'string') {\n\t\t\tif (__fest_jschars_test.test(value)) {\n\t\t\t\treturn value.replace(__fest_jschars, __fest_replaceJS);\n\t\t\t}\n\t\t}\n\n\t\treturn value == null ? '' : value;\n\t},__fest_replaceJS = function __fest_replaceJS(chr) {\n\t\treturn __fest_jshash[chr];\n\t},__fest_escapeHTML = function __fest_escapeHTML(value) {\n\t\tif (typeof value === 'string') {\n\t\t\tif (__fest_htmlchars_test.test(value)) {\n\t\t\t\treturn value.replace(__fest_htmlchars, __fest_replaceHTML);\n\t\t\t}\n\t\t}\n\n\t\treturn value == null ? '' : value;\n\t},__fest_replaceHTML = function __fest_replaceHTML(chr) {\n\t\treturn __fest_htmlhash[chr];\n\t},__fest_extend = function __fest_extend(dest, src) {\n\t\tfor (var key in src) {\n\t\t\tif (src.hasOwnProperty(key)) {\n\t\t\t\tdest[key] = src[key];\n\t\t\t}\n\t\t}\n\t},__fest_param = function __fest_param(fn) {\n\t\tfn.param = true;\n\t\treturn fn;\n\t},i18n=__fest_self && typeof __fest_self.i18n === \"function\" ? __fest_self.i18n : function (str) {return str;},___fest_log_error;if(typeof __fest_error === \"undefined\"){___fest_log_error = (typeof console !== \"undefined\" && console.error) ? function(){return Function.prototype.apply.call(console.error, console, arguments)} : function(){};}else{___fest_log_error=__fest_error};function __fest_log_error(msg){___fest_log_error(msg+\"\\nin block \\\"\"+__fest_debug_block+\"\\\" at line: \"+__fest_debug_line+\"\\nfile: \"+__fest_debug_file)}function __fest_call(fn, params,cp){if(cp)for(var i in params)if(typeof params[i]==\"function\"&&params[i].param)params[i]=params[i]();return fn.call(__fest_self,params)}__fest_buf+=(\"<div class=\\\"page-not-found-background\\\"></div><div class=\\\"main-content-container\\\"><div class=\\\"page-not-found\\\"><h1 class=\\\"page-not-found__header\\\">404 Страница не найдена</h1><a href=\\\"about\\\" class=\\\"page-not-found__link\\\" data-hot=\\\"true\\\">На главную</a></div></div>\");__fest_to=__fest_chunks.length;if (__fest_to) {__fest_iterator = 0;for (;__fest_iterator<__fest_to;__fest_iterator++) {__fest_chunk=__fest_chunks[__fest_iterator];if (typeof __fest_chunk===\"string\") {__fest_html+=__fest_chunk;} else {__fest_fn=__fest_blocks[__fest_chunk.name];if (__fest_fn) __fest_html+=__fest_call(__fest_fn,__fest_chunk.params,__fest_chunk.cp);}}return __fest_html+__fest_buf;} else {return __fest_buf;}}})();";
const aboutTSrc = ";(function(){var x=Function('return this')();if(!x.fest)x.fest={};x.fest['../../static/templates/src/about']=function (__fest_context){\"use strict\";var __fest_self=this,__fest_buf=\"\",__fest_chunks=[],__fest_chunk,__fest_attrs=[],__fest_select,__fest_if,__fest_iterator,__fest_to,__fest_fn,__fest_html=\"\",__fest_blocks={},__fest_params,__fest_element,__fest_debug_file=\"\",__fest_debug_line=\"\",__fest_debug_block=\"\",__fest_element_stack = [],__fest_short_tags = {\"area\": true, \"base\": true, \"br\": true, \"col\": true, \"command\": true, \"embed\": true, \"hr\": true, \"img\": true, \"input\": true, \"keygen\": true, \"link\": true, \"meta\": true, \"param\": true, \"source\": true, \"wbr\": true},__fest_jschars = /[\\\\'\"\\/\\n\\r\\t\\b\\f<>]/g,__fest_jschars_test = /[\\\\'\"\\/\\n\\r\\t\\b\\f<>]/,__fest_htmlchars = /[&<>\"]/g,__fest_htmlchars_test = /[&<>\"]/,__fest_jshash = {\"\\\"\": \"\\\\\\\"\", \"\\\\\": \"\\\\\\\\\", \"/\": \"\\\\/\", \"\\n\": \"\\\\n\", \"\\r\": \"\\\\r\", \"\\t\": \"\\\\t\", \"\\b\": \"\\\\b\", \"\\f\": \"\\\\f\", \"'\": \"\\\\'\", \"<\": \"\\\\u003C\", \">\": \"\\\\u003E\"},__fest_htmlhash = {\"&\": \"&amp;\", \"<\": \"&lt;\", \">\": \"&gt;\", \"\\\"\": \"&quot;\"},__fest_escapeJS = function __fest_escapeJS(value) {\n\t\tif (typeof value === 'string') {\n\t\t\tif (__fest_jschars_test.test(value)) {\n\t\t\t\treturn value.replace(__fest_jschars, __fest_replaceJS);\n\t\t\t}\n\t\t}\n\n\t\treturn value == null ? '' : value;\n\t},__fest_replaceJS = function __fest_replaceJS(chr) {\n\t\treturn __fest_jshash[chr];\n\t},__fest_escapeHTML = function __fest_escapeHTML(value) {\n\t\tif (typeof value === 'string') {\n\t\t\tif (__fest_htmlchars_test.test(value)) {\n\t\t\t\treturn value.replace(__fest_htmlchars, __fest_replaceHTML);\n\t\t\t}\n\t\t}\n\n\t\treturn value == null ? '' : value;\n\t},__fest_replaceHTML = function __fest_replaceHTML(chr) {\n\t\treturn __fest_htmlhash[chr];\n\t},__fest_extend = function __fest_extend(dest, src) {\n\t\tfor (var key in src) {\n\t\t\tif (src.hasOwnProperty(key)) {\n\t\t\t\tdest[key] = src[key];\n\t\t\t}\n\t\t}\n\t},__fest_param = function __fest_param(fn) {\n\t\tfn.param = true;\n\t\treturn fn;\n\t},i18n=__fest_self && typeof __fest_self.i18n === \"function\" ? __fest_self.i18n : function (str) {return str;},___fest_log_error;if(typeof __fest_error === \"undefined\"){___fest_log_error = (typeof console !== \"undefined\" && console.error) ? function(){return Function.prototype.apply.call(console.error, console, arguments)} : function(){};}else{___fest_log_error=__fest_error};function __fest_log_error(msg){___fest_log_error(msg+\"\\nin block \\\"\"+__fest_debug_block+\"\\\" at line: \"+__fest_debug_line+\"\\nfile: \"+__fest_debug_file)}function __fest_call(fn, params,cp){if(cp)for(var i in params)if(typeof params[i]==\"function\"&&params[i].param)params[i]=params[i]();return fn.call(__fest_self,params)}var user=__fest_context;try{var active = { active: 'about', nick: user }}catch(e){__fest_log_error(e.message);}var __fest_context0;try{__fest_context0=active}catch(e){__fest_context0={};__fest_log_error(e.message)};(function(__fest_context){var info=__fest_context;__fest_buf+=(\"<div class=\\\"user-bar\\\">Вы вошли как \");try{__fest_buf+=(__fest_escapeHTML(info.nick))}catch(e){__fest_log_error(e.message + \"4\");}__fest_buf+=(\"</div><nav class=\\\"navigation navigation_main\\\"><ul class=\\\"navigation__list\\\">\");try{__fest_attrs[0]=__fest_escapeHTML(info.active==='play'?'navigation__item_active':'')}catch(e){__fest_attrs[0]=\"\"; __fest_log_error(e.message);}__fest_buf+=(\"<li class=\\\"navigation__item \" + __fest_attrs[0] + \"\\\">\");try{__fest_attrs[0]=__fest_escapeHTML(info.active==='play'?'navigation__link_active':'')}catch(e){__fest_attrs[0]=\"\"; __fest_log_error(e.message);}__fest_buf+=(\"<a href=\\\"#\\\" class=\\\"navigation__link \" + __fest_attrs[0] + \"\\\" data-act=\\\"game-start-options\\\" data-hot=\\\"true\\\" title=\\\"Игра\\\">Игра</a></li><div class=\\\"start-game-options-container\\\"></div>\");try{__fest_attrs[0]=__fest_escapeHTML(info.active==='leaders'?'navigation__item_active':'')}catch(e){__fest_attrs[0]=\"\"; __fest_log_error(e.message);}__fest_buf+=(\"<li class=\\\"navigation__item \" + __fest_attrs[0] + \"\\\">\");try{__fest_attrs[0]=__fest_escapeHTML(info.active==='leaders'?'navigation__link_active':'')}catch(e){__fest_attrs[0]=\"\"; __fest_log_error(e.message);}__fest_buf+=(\"<a href=\\\"leaders\\\" class=\\\"navigation__link \" + __fest_attrs[0] + \"\\\" data-hot=\\\"true\\\" title=\\\"Лидерборд\\\">Лидерборд</a></li>\");try{__fest_attrs[0]=__fest_escapeHTML(info.active==='about'?'navigation__item_active':'')}catch(e){__fest_attrs[0]=\"\"; __fest_log_error(e.message);}__fest_buf+=(\"<li class=\\\"navigation__item \" + __fest_attrs[0] + \"\\\">\");try{__fest_attrs[0]=__fest_escapeHTML(info.active==='about'?'navigation__link_active':'')}catch(e){__fest_attrs[0]=\"\"; __fest_log_error(e.message);}__fest_buf+=(\"<a href=\\\"about\\\" class=\\\"navigation__link \" + __fest_attrs[0] + \"\\\" data-hot=\\\"true\\\" title=\\\"Об игре\\\">Об игре</a></li><li class=\\\"navigation__item\\\"><a href=\\\"login\\\" class=\\\"navigation__link\\\" data-hot=\\\"true\\\" data-act=\\\"logout\\\" title=\\\"Выход\\\">Выход</a></li></ul></nav>\");})(__fest_context0);__fest_buf+=(\"<div class=\\\"main-content-container\\\"><div class=\\\"main-content\\\"><p>«Карточная стратегия для всех» — заявлено на официальном сайте Hearthstone.\\n                Под «всеми» подразумеваются любители и киберспортсмены, хотя Blizzard не планировала\\n                продвигать\\n                соревновательную составляющую. Однако многотысячные армии зрителей на трансляциях\\n                турниров прозрачно\\n                намекнули: хотим, чтоб всё всерьез! И создатели «Военного ремесла» пошли им навстречу.</p></div></div>\");__fest_to=__fest_chunks.length;if (__fest_to) {__fest_iterator = 0;for (;__fest_iterator<__fest_to;__fest_iterator++) {__fest_chunk=__fest_chunks[__fest_iterator];if (typeof __fest_chunk===\"string\") {__fest_html+=__fest_chunk;} else {__fest_fn=__fest_blocks[__fest_chunk.name];if (__fest_fn) __fest_html+=__fest_call(__fest_fn,__fest_chunk.params,__fest_chunk.cp);}}return __fest_html+__fest_buf;} else {return __fest_buf;}}})();";
const loginTSrc = ";(function(){var x=Function('return this')();if(!x.fest)x.fest={};x.fest['../../static/templates/src/login']=function (__fest_context){\"use strict\";var __fest_self=this,__fest_buf=\"\",__fest_chunks=[],__fest_chunk,__fest_attrs=[],__fest_select,__fest_if,__fest_iterator,__fest_to,__fest_fn,__fest_html=\"\",__fest_blocks={},__fest_params,__fest_element,__fest_debug_file=\"\",__fest_debug_line=\"\",__fest_debug_block=\"\",__fest_element_stack = [],__fest_short_tags = {\"area\": true, \"base\": true, \"br\": true, \"col\": true, \"command\": true, \"embed\": true, \"hr\": true, \"img\": true, \"input\": true, \"keygen\": true, \"link\": true, \"meta\": true, \"param\": true, \"source\": true, \"wbr\": true},__fest_jschars = /[\\\\'\"\\/\\n\\r\\t\\b\\f<>]/g,__fest_jschars_test = /[\\\\'\"\\/\\n\\r\\t\\b\\f<>]/,__fest_htmlchars = /[&<>\"]/g,__fest_htmlchars_test = /[&<>\"]/,__fest_jshash = {\"\\\"\": \"\\\\\\\"\", \"\\\\\": \"\\\\\\\\\", \"/\": \"\\\\/\", \"\\n\": \"\\\\n\", \"\\r\": \"\\\\r\", \"\\t\": \"\\\\t\", \"\\b\": \"\\\\b\", \"\\f\": \"\\\\f\", \"'\": \"\\\\'\", \"<\": \"\\\\u003C\", \">\": \"\\\\u003E\"},__fest_htmlhash = {\"&\": \"&amp;\", \"<\": \"&lt;\", \">\": \"&gt;\", \"\\\"\": \"&quot;\"},__fest_escapeJS = function __fest_escapeJS(value) {\n\t\tif (typeof value === 'string') {\n\t\t\tif (__fest_jschars_test.test(value)) {\n\t\t\t\treturn value.replace(__fest_jschars, __fest_replaceJS);\n\t\t\t}\n\t\t}\n\n\t\treturn value == null ? '' : value;\n\t},__fest_replaceJS = function __fest_replaceJS(chr) {\n\t\treturn __fest_jshash[chr];\n\t},__fest_escapeHTML = function __fest_escapeHTML(value) {\n\t\tif (typeof value === 'string') {\n\t\t\tif (__fest_htmlchars_test.test(value)) {\n\t\t\t\treturn value.replace(__fest_htmlchars, __fest_replaceHTML);\n\t\t\t}\n\t\t}\n\n\t\treturn value == null ? '' : value;\n\t},__fest_replaceHTML = function __fest_replaceHTML(chr) {\n\t\treturn __fest_htmlhash[chr];\n\t},__fest_extend = function __fest_extend(dest, src) {\n\t\tfor (var key in src) {\n\t\t\tif (src.hasOwnProperty(key)) {\n\t\t\t\tdest[key] = src[key];\n\t\t\t}\n\t\t}\n\t},__fest_param = function __fest_param(fn) {\n\t\tfn.param = true;\n\t\treturn fn;\n\t},i18n=__fest_self && typeof __fest_self.i18n === \"function\" ? __fest_self.i18n : function (str) {return str;},___fest_log_error;if(typeof __fest_error === \"undefined\"){___fest_log_error = (typeof console !== \"undefined\" && console.error) ? function(){return Function.prototype.apply.call(console.error, console, arguments)} : function(){};}else{___fest_log_error=__fest_error};function __fest_log_error(msg){___fest_log_error(msg+\"\\nin block \\\"\"+__fest_debug_block+\"\\\" at line: \"+__fest_debug_line+\"\\nfile: \"+__fest_debug_file)}function __fest_call(fn, params,cp){if(cp)for(var i in params)if(typeof params[i]==\"function\"&&params[i].param)params[i]=params[i]();return fn.call(__fest_self,params)}__fest_buf+=(\"<div class=\\\"login-form-container\\\"></div>\");__fest_to=__fest_chunks.length;if (__fest_to) {__fest_iterator = 0;for (;__fest_iterator<__fest_to;__fest_iterator++) {__fest_chunk=__fest_chunks[__fest_iterator];if (typeof __fest_chunk===\"string\") {__fest_html+=__fest_chunk;} else {__fest_fn=__fest_blocks[__fest_chunk.name];if (__fest_fn) __fest_html+=__fest_call(__fest_fn,__fest_chunk.params,__fest_chunk.cp);}}return __fest_html+__fest_buf;} else {return __fest_buf;}}})();";
const registerTSrc = ";(function(){var x=Function('return this')();if(!x.fest)x.fest={};x.fest['../../static/templates/src/register']=function (__fest_context){\"use strict\";var __fest_self=this,__fest_buf=\"\",__fest_chunks=[],__fest_chunk,__fest_attrs=[],__fest_select,__fest_if,__fest_iterator,__fest_to,__fest_fn,__fest_html=\"\",__fest_blocks={},__fest_params,__fest_element,__fest_debug_file=\"\",__fest_debug_line=\"\",__fest_debug_block=\"\",__fest_element_stack = [],__fest_short_tags = {\"area\": true, \"base\": true, \"br\": true, \"col\": true, \"command\": true, \"embed\": true, \"hr\": true, \"img\": true, \"input\": true, \"keygen\": true, \"link\": true, \"meta\": true, \"param\": true, \"source\": true, \"wbr\": true},__fest_jschars = /[\\\\'\"\\/\\n\\r\\t\\b\\f<>]/g,__fest_jschars_test = /[\\\\'\"\\/\\n\\r\\t\\b\\f<>]/,__fest_htmlchars = /[&<>\"]/g,__fest_htmlchars_test = /[&<>\"]/,__fest_jshash = {\"\\\"\": \"\\\\\\\"\", \"\\\\\": \"\\\\\\\\\", \"/\": \"\\\\/\", \"\\n\": \"\\\\n\", \"\\r\": \"\\\\r\", \"\\t\": \"\\\\t\", \"\\b\": \"\\\\b\", \"\\f\": \"\\\\f\", \"'\": \"\\\\'\", \"<\": \"\\\\u003C\", \">\": \"\\\\u003E\"},__fest_htmlhash = {\"&\": \"&amp;\", \"<\": \"&lt;\", \">\": \"&gt;\", \"\\\"\": \"&quot;\"},__fest_escapeJS = function __fest_escapeJS(value) {\n\t\tif (typeof value === 'string') {\n\t\t\tif (__fest_jschars_test.test(value)) {\n\t\t\t\treturn value.replace(__fest_jschars, __fest_replaceJS);\n\t\t\t}\n\t\t}\n\n\t\treturn value == null ? '' : value;\n\t},__fest_replaceJS = function __fest_replaceJS(chr) {\n\t\treturn __fest_jshash[chr];\n\t},__fest_escapeHTML = function __fest_escapeHTML(value) {\n\t\tif (typeof value === 'string') {\n\t\t\tif (__fest_htmlchars_test.test(value)) {\n\t\t\t\treturn value.replace(__fest_htmlchars, __fest_replaceHTML);\n\t\t\t}\n\t\t}\n\n\t\treturn value == null ? '' : value;\n\t},__fest_replaceHTML = function __fest_replaceHTML(chr) {\n\t\treturn __fest_htmlhash[chr];\n\t},__fest_extend = function __fest_extend(dest, src) {\n\t\tfor (var key in src) {\n\t\t\tif (src.hasOwnProperty(key)) {\n\t\t\t\tdest[key] = src[key];\n\t\t\t}\n\t\t}\n\t},__fest_param = function __fest_param(fn) {\n\t\tfn.param = true;\n\t\treturn fn;\n\t},i18n=__fest_self && typeof __fest_self.i18n === \"function\" ? __fest_self.i18n : function (str) {return str;},___fest_log_error;if(typeof __fest_error === \"undefined\"){___fest_log_error = (typeof console !== \"undefined\" && console.error) ? function(){return Function.prototype.apply.call(console.error, console, arguments)} : function(){};}else{___fest_log_error=__fest_error};function __fest_log_error(msg){___fest_log_error(msg+\"\\nin block \\\"\"+__fest_debug_block+\"\\\" at line: \"+__fest_debug_line+\"\\nfile: \"+__fest_debug_file)}function __fest_call(fn, params,cp){if(cp)for(var i in params)if(typeof params[i]==\"function\"&&params[i].param)params[i]=params[i]();return fn.call(__fest_self,params)}__fest_buf+=(\"<div class=\\\"registration-form-container\\\"></div>\");__fest_to=__fest_chunks.length;if (__fest_to) {__fest_iterator = 0;for (;__fest_iterator<__fest_to;__fest_iterator++) {__fest_chunk=__fest_chunks[__fest_iterator];if (typeof __fest_chunk===\"string\") {__fest_html+=__fest_chunk;} else {__fest_fn=__fest_blocks[__fest_chunk.name];if (__fest_fn) __fest_html+=__fest_call(__fest_fn,__fest_chunk.params,__fest_chunk.cp);}}return __fest_html+__fest_buf;} else {return __fest_buf;}}})();";

const rightCodes = [playTSrc, leadersTSrc, notFoundTSrc, aboutTSrc, loginTSrc, registerTSrc]
  .map(template =>
    new Function(`
      return ${template.substring(template.indexOf('function', 3),
        template.lastIndexOf('}'))}
    `)());

module.exports = rightCodes;

},{"path":13}],13:[function(require,module,exports){
(function (process){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    if (last === '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// Split a filename into [root, dir, basename, ext], unix version
// 'root' is just a slash, or nothing.
var splitPathRe =
    /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
var splitPath = function(filename) {
  return splitPathRe.exec(filename).slice(1);
};

// path.resolve([from ...], to)
// posix version
exports.resolve = function() {
  var resolvedPath = '',
      resolvedAbsolute = false;

  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = (i >= 0) ? arguments[i] : process.cwd();

    // Skip empty and invalid entries
    if (typeof path !== 'string') {
      throw new TypeError('Arguments to path.resolve must be strings');
    } else if (!path) {
      continue;
    }

    resolvedPath = path + '/' + resolvedPath;
    resolvedAbsolute = path.charAt(0) === '/';
  }

  // At this point the path should be resolved to a full absolute path, but
  // handle relative paths to be safe (might happen when process.cwd() fails)

  // Normalize the path
  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function(path) {
  var isAbsolute = exports.isAbsolute(path),
      trailingSlash = substr(path, -1) === '/';

  // Normalize the path
  path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }

  return (isAbsolute ? '/' : '') + path;
};

// posix version
exports.isAbsolute = function(path) {
  return path.charAt(0) === '/';
};

// posix version
exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function(p, index) {
    if (typeof p !== 'string') {
      throw new TypeError('Arguments to path.join must be strings');
    }
    return p;
  }).join('/'));
};


// path.relative(from, to)
// posix version
exports.relative = function(from, to) {
  from = exports.resolve(from).substr(1);
  to = exports.resolve(to).substr(1);

  function trim(arr) {
    var start = 0;
    for (; start < arr.length; start++) {
      if (arr[start] !== '') break;
    }

    var end = arr.length - 1;
    for (; end >= 0; end--) {
      if (arr[end] !== '') break;
    }

    if (start > end) return [];
    return arr.slice(start, end - start + 1);
  }

  var fromParts = trim(from.split('/'));
  var toParts = trim(to.split('/'));

  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));

  return outputParts.join('/');
};

exports.sep = '/';
exports.delimiter = ':';

exports.dirname = function(path) {
  var result = splitPath(path),
      root = result[0],
      dir = result[1];

  if (!root && !dir) {
    // No dirname whatsoever
    return '.';
  }

  if (dir) {
    // It has a dirname, strip trailing slash
    dir = dir.substr(0, dir.length - 1);
  }

  return root + dir;
};


exports.basename = function(path, ext) {
  var f = splitPath(path)[2];
  // TODO: make this comparison case-insensitive on windows?
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};


exports.extname = function(path) {
  return splitPath(path)[3];
};

function filter (xs, f) {
    if (xs.filter) return xs.filter(f);
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (f(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// String.prototype.substr - negative index don't work in IE8
var substr = 'ab'.substr(-1) === 'b'
    ? function (str, start, len) { return str.substr(start, len) }
    : function (str, start, len) {
        if (start < 0) start = str.length + start;
        return str.substr(start, len);
    }
;

}).call(this,require('_process'))
},{"_process":14}],14:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}]},{},[1]);
