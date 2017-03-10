(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * Created by andreivinogradov on 05.03.17.
 */
class Button {
  constructor({ text = '', attrs = { class: 'btn' } }) {
    this.text = text;
    this.attrs = attrs;
  }

  setAttrs(attrs = this.attrs) {
    return Object.keys(attrs).map(attr => `${attr}="${attrs[attr]}"`).join(' ');
  }

  render() {
    return `
      <button type=submit ${this.setAttrs()}>${this.text}</button>
    `;
  }
}

module.exports = Button;

},{}],2:[function(require,module,exports){
/**
 * Created by andreivinogradov on 05.03.17.
 */
const Button = require('../button/button.js');

class Form {
  constructor({ parent, fields = [], attributes = {}, controls = [] }) {
    this.fields = fields;
    this.attributes = attributes;
    this.controls = controls;
    this.parent = parent;
    this.html = '';
  }

  render() {
    this.updateHtml();
    this.installControls();

    return this.html;
  }

  getFields() {
    return this.fields.map(field => `
       <li>
         <label for="${field.attributes.id}">${field.label}</label> 
         <div>
         <input ${this.attrsAsString(field.attributes)}">
         <div class="err-container"></div>
         </div>
       </li>
       `)
      .join('');
  }

  attrsAsString(attributes = this.attributes) {
    return Object.keys(attributes).map(attr => `${attr}="${attributes[attr]}"`).join(' ');
  }

  updateHtml() {
    this.html = `
      <form ${this.attrsAsString()}>
        <ul class="flex-outer">
          ${this.getFields()}
          <li>
            <div class="space-taker"></div>
            ${this.installControls()}
          </li>
        </ul>
      <form>
    `;
  }

  installControls() {
    return this.controls.map(control =>
      (control.type === 'button' ?
        new Button({ text: control.value }).render() :
        `<${control.type} ${this.attrsAsString(control.attributes)}>
          ${control.value}
         </${control.type}>
      `)).join(' ');
  }

  getFormData() {
    const form = this.parent.querySelector('form');
    const elements = form.elements;
    const fields = {};

    Object.keys(elements).forEach((element) => {
      const name = elements[element].name;
      const value = elements[element].value;

      if (!name) {
        return;
      }

      fields[name] = value;
    });

    return fields;
  }
}

module.exports = Form;

},{"../button/button.js":1}],3:[function(require,module,exports){
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

},{"../components/form/form.js":2,"../services/appService.js":8,"./../templates/compiled/404.js":9,"./../templates/compiled/about.js":10,"./../templates/compiled/leaders.js":11,"./../templates/compiled/login.js":12,"./../templates/compiled/play.js":13,"./../templates/compiled/registration.js":14,"./credentials_check.js":4,"./login_check.js":5}],4:[function(require,module,exports){

const Valnder = require('./sValidator.js');

module.exports = (app) => {
  const nameInput = document.getElementById('reg-name');
  const passwordInput = document.getElementById('reg-password');
  const passwordCheckInput = document.getElementById('password2');
  const email = document.getElementById('email');
  const regForm = document.getElementById('registration-form');

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
  val.renderTo('.err-container');

  app.connectValidator(val);
};

},{"./sValidator.js":6}],5:[function(require,module,exports){
/**
 * Created by andreivinogradov on 27.02.17.
 */
const Valnder = require('./sValidator.js');

module.exports = (app) => {
  const loginField = document.getElementById('login-name');
  const passField = document.getElementById('login-password');
  const loginForm = document.getElementById('login-form');

  const loginValidator = new Valnder();
  loginValidator.register(loginForm);

  loginValidator.addValidation(loginField, 'Поле логина не может быть пустым');

  loginValidator.addValidation(passField, 'Поле пароля не может быть пустым');
  // Четвертый параметр - url для проверки поля через ajax (если нету, то это url всей формы)
  loginValidator.addServerSideValidation(loginField, 'Неправильный логин/пароль', 'Access denied');

  loginValidator.renderFunction(text => `<p class='input-error'>${text}</p>`);

  loginValidator.renderTo('.err-container');

  app.connectValidator(loginValidator);
};

},{"./sValidator.js":6}],6:[function(require,module,exports){
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

},{}],7:[function(require,module,exports){
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

},{}],8:[function(require,module,exports){
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

},{"../modules/http.js":7}],9:[function(require,module,exports){
;(function () {
  var x = Function('return this')();
  if (!x.fest)x.fest = {};
  module.exports = function (__fest_context) {
    "use strict";
    var __fest_self = this, __fest_buf = "", __fest_chunks = [], __fest_chunk, __fest_attrs = [], __fest_select, __fest_if, __fest_iterator, __fest_to, __fest_fn, __fest_html = "", __fest_blocks = {}, __fest_params, __fest_element, __fest_debug_file = "", __fest_debug_line = "", __fest_debug_block = "", __fest_element_stack = [], __fest_short_tags = {
      "area": true,
      "base": true,
      "br": true,
      "col": true,
      "command": true,
      "embed": true,
      "hr": true,
      "img": true,
      "input": true,
      "keygen": true,
      "link": true,
      "meta": true,
      "param": true,
      "source": true,
      "wbr": true
    }, __fest_jschars = /[\\'"\/\n\r\t\b\f<>]/g, __fest_jschars_test = /[\\'"\/\n\r\t\b\f<>]/, __fest_htmlchars = /[&<>"]/g, __fest_htmlchars_test = /[&<>"]/, __fest_jshash = {
      "\"": "\\\"",
      "\\": "\\\\",
      "/": "\\/",
      "\n": "\\n",
      "\r": "\\r",
      "\t": "\\t",
      "\b": "\\b",
      "\f": "\\f",
      "'": "\\'",
      "<": "\\u003C",
      ">": "\\u003E"
    }, __fest_htmlhash = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "\"": "&quot;"
    }, __fest_escapeJS = function __fest_escapeJS(value) {
      if (typeof value === 'string') {
        if (__fest_jschars_test.test(value)) {
          return value.replace(__fest_jschars, __fest_replaceJS);
        }
      }

      return value == null ? '' : value;
    }, __fest_replaceJS = function __fest_replaceJS(chr) {
      return __fest_jshash[chr];
    }, __fest_escapeHTML = function __fest_escapeHTML(value) {
      if (typeof value === 'string') {
        if (__fest_htmlchars_test.test(value)) {
          return value.replace(__fest_htmlchars, __fest_replaceHTML);
        }
      }

      return value == null ? '' : value;
    }, __fest_replaceHTML = function __fest_replaceHTML(chr) {
      return __fest_htmlhash[chr];
    }, __fest_extend = function __fest_extend(dest, src) {
      for (var key in src) {
        if (src.hasOwnProperty(key)) {
          dest[key] = src[key];
        }
      }
    }, __fest_param = function __fest_param(fn) {
      fn.param = true;
      return fn;
    }, i18n = __fest_self && typeof __fest_self.i18n === "function" ? __fest_self.i18n : function (str) {
      return str;
    }, ___fest_log_error;
    if (typeof __fest_error === "undefined") {
      ___fest_log_error = (typeof console !== "undefined" && console.error) ? function () {
        return Function.prototype.apply.call(console.error, console, arguments)
      } : function () {
      };
    } else {
      ___fest_log_error = __fest_error
    }
    ;
    function __fest_log_error(msg) {
      ___fest_log_error(msg + "\nin block \"" + __fest_debug_block + "\" at line: " + __fest_debug_line + "\nfile: " + __fest_debug_file)
    }

    function __fest_call(fn, params, cp) {
      if (cp)for (var i in params)if (typeof params[i] == "function" && params[i].param)params[i] = params[i]();
      return fn.call(__fest_self, params)
    }

    __fest_buf += ("<div class=\"page-not-found\"></div><div id=\"main-content-container\"><div id=\"page-not-found\"><h1>404 Страница не найдена</h1><a href=\"play\" class=\"no-reload\">На главную</a></div></div>");
    __fest_to = __fest_chunks.length;
    if (__fest_to) {
      __fest_iterator = 0;
      for (; __fest_iterator < __fest_to; __fest_iterator++) {
        __fest_chunk = __fest_chunks[__fest_iterator];
        if (typeof __fest_chunk === "string") {
          __fest_html += __fest_chunk;
        } else {
          __fest_fn = __fest_blocks[__fest_chunk.name];
          if (__fest_fn) __fest_html += __fest_call(__fest_fn, __fest_chunk.params, __fest_chunk.cp);
        }
      }
      return __fest_html + __fest_buf;
    } else {
      return __fest_buf;
    }
  }
})();

},{}],10:[function(require,module,exports){
;(function () {
  var x = Function('return this')();
  if (!x.fest)x.fest = {};
  module.exports = function (__fest_context) {
    "use strict";
    var __fest_self = this, __fest_buf = "", __fest_chunks = [], __fest_chunk, __fest_attrs = [], __fest_select, __fest_if, __fest_iterator, __fest_to, __fest_fn, __fest_html = "", __fest_blocks = {}, __fest_params, __fest_element, __fest_debug_file = "", __fest_debug_line = "", __fest_debug_block = "", __fest_element_stack = [], __fest_short_tags = {
      "area": true,
      "base": true,
      "br": true,
      "col": true,
      "command": true,
      "embed": true,
      "hr": true,
      "img": true,
      "input": true,
      "keygen": true,
      "link": true,
      "meta": true,
      "param": true,
      "source": true,
      "wbr": true
    }, __fest_jschars = /[\\'"\/\n\r\t\b\f<>]/g, __fest_jschars_test = /[\\'"\/\n\r\t\b\f<>]/, __fest_htmlchars = /[&<>"]/g, __fest_htmlchars_test = /[&<>"]/, __fest_jshash = {
      "\"": "\\\"",
      "\\": "\\\\",
      "/": "\\/",
      "\n": "\\n",
      "\r": "\\r",
      "\t": "\\t",
      "\b": "\\b",
      "\f": "\\f",
      "'": "\\'",
      "<": "\\u003C",
      ">": "\\u003E"
    }, __fest_htmlhash = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "\"": "&quot;"
    }, __fest_escapeJS = function __fest_escapeJS(value) {
      if (typeof value === 'string') {
        if (__fest_jschars_test.test(value)) {
          return value.replace(__fest_jschars, __fest_replaceJS);
        }
      }

      return value == null ? '' : value;
    }, __fest_replaceJS = function __fest_replaceJS(chr) {
      return __fest_jshash[chr];
    }, __fest_escapeHTML = function __fest_escapeHTML(value) {
      if (typeof value === 'string') {
        if (__fest_htmlchars_test.test(value)) {
          return value.replace(__fest_htmlchars, __fest_replaceHTML);
        }
      }

      return value == null ? '' : value;
    }, __fest_replaceHTML = function __fest_replaceHTML(chr) {
      return __fest_htmlhash[chr];
    }, __fest_extend = function __fest_extend(dest, src) {
      for (var key in src) {
        if (src.hasOwnProperty(key)) {
          dest[key] = src[key];
        }
      }
    }, __fest_param = function __fest_param(fn) {
      fn.param = true;
      return fn;
    }, i18n = __fest_self && typeof __fest_self.i18n === "function" ? __fest_self.i18n : function (str) {
      return str;
    }, ___fest_log_error;
    if (typeof __fest_error === "undefined") {
      ___fest_log_error = (typeof console !== "undefined" && console.error) ? function () {
        return Function.prototype.apply.call(console.error, console, arguments)
      } : function () {
      };
    } else {
      ___fest_log_error = __fest_error
    }
    ;
    function __fest_log_error(msg) {
      ___fest_log_error(msg + "\nin block \"" + __fest_debug_block + "\" at line: " + __fest_debug_line + "\nfile: " + __fest_debug_file)
    }

    function __fest_call(fn, params, cp) {
      if (cp)for (var i in params)if (typeof params[i] == "function" && params[i].param)params[i] = params[i]();
      return fn.call(__fest_self, params)
    }

    var user = __fest_context;
    try {
      var active = {active: 'about', nick: user}
    } catch (e) {
      __fest_log_error(e.message);
    }
    var __fest_context0;
    try {
      __fest_context0 = active
    } catch (e) {
      __fest_context0 = {};
      __fest_log_error(e.message)
    }
    ;
    (function (__fest_context) {
      var info = __fest_context;
      __fest_buf += ("<div class=\"user-bar\">Вы вошли как ");
      try {
        __fest_buf += (__fest_escapeHTML(info.nick))
      } catch (e) {
        __fest_log_error(e.message + "2");
      }
      __fest_buf += ("</div><nav id=\"main-navigation\"><ul>");
      try {
        __fest_attrs[0] = __fest_escapeHTML(info.active === 'play' ? 'active-item' : '')
      } catch (e) {
        __fest_attrs[0] = "";
        __fest_log_error(e.message);
      }
      __fest_buf += ("<li class=\"" + __fest_attrs[0] + "\"><a href=\"play\" class=\"no-reload\" title=\"Играть\">Играть</a></li>");
      try {
        __fest_attrs[0] = __fest_escapeHTML(info.active === 'leaders' ? 'active-item' : '')
      } catch (e) {
        __fest_attrs[0] = "";
        __fest_log_error(e.message);
      }
      __fest_buf += ("<li class=\"" + __fest_attrs[0] + "\"><a href=\"leaders\" class=\"no-reload\" title=\"Лидерборд\">Лидерборд</a></li>");
      try {
        __fest_attrs[0] = __fest_escapeHTML(info.active === 'about' ? 'active-item' : '')
      } catch (e) {
        __fest_attrs[0] = "";
        __fest_log_error(e.message);
      }
      __fest_buf += ("<li class=\"" + __fest_attrs[0] + "\"><a href=\"about\" class=\"no-reload\" title=\"Об игре\">Об игре</a></li><li><a href=\"login\" class=\"no-reload logout-link\" title=\"Выйти\">Выйти</a></li></ul></nav>");
    })(__fest_context0);
    __fest_buf += ("<div id=\"main-content-container\"><div id=\"main-content\"><p>«Карточная стратегия для всех» — заявлено на официальном сайте Hearthstone.\n                Под «всеми» подразумеваются любители и киберспортсмены, хотя Blizzard не планировала\n                продвигать\n                соревновательную составляющую. Однако многотысячные армии зрителей на трансляциях\n                турниров прозрачно\n                намекнули: хотим, чтоб всё всерьез! И создатели «Военного ремесла» пошли им навстречу.</p></div></div>");
    __fest_to = __fest_chunks.length;
    if (__fest_to) {
      __fest_iterator = 0;
      for (; __fest_iterator < __fest_to; __fest_iterator++) {
        __fest_chunk = __fest_chunks[__fest_iterator];
        if (typeof __fest_chunk === "string") {
          __fest_html += __fest_chunk;
        } else {
          __fest_fn = __fest_blocks[__fest_chunk.name];
          if (__fest_fn) __fest_html += __fest_call(__fest_fn, __fest_chunk.params, __fest_chunk.cp);
        }
      }
      return __fest_html + __fest_buf;
    } else {
      return __fest_buf;
    }
  }
})();

},{}],11:[function(require,module,exports){
;(function () {
  var x = Function('return this')();
  if (!x.fest)x.fest = {};
  module.exports = function (__fest_context) {
    "use strict";
    var __fest_self = this, __fest_buf = "", __fest_chunks = [], __fest_chunk, __fest_attrs = [], __fest_select, __fest_if, __fest_iterator, __fest_to, __fest_fn, __fest_html = "", __fest_blocks = {}, __fest_params, __fest_element, __fest_debug_file = "", __fest_debug_line = "", __fest_debug_block = "", __fest_element_stack = [], __fest_short_tags = {
      "area": true,
      "base": true,
      "br": true,
      "col": true,
      "command": true,
      "embed": true,
      "hr": true,
      "img": true,
      "input": true,
      "keygen": true,
      "link": true,
      "meta": true,
      "param": true,
      "source": true,
      "wbr": true
    }, __fest_jschars = /[\\'"\/\n\r\t\b\f<>]/g, __fest_jschars_test = /[\\'"\/\n\r\t\b\f<>]/, __fest_htmlchars = /[&<>"]/g, __fest_htmlchars_test = /[&<>"]/, __fest_jshash = {
      "\"": "\\\"",
      "\\": "\\\\",
      "/": "\\/",
      "\n": "\\n",
      "\r": "\\r",
      "\t": "\\t",
      "\b": "\\b",
      "\f": "\\f",
      "'": "\\'",
      "<": "\\u003C",
      ">": "\\u003E"
    }, __fest_htmlhash = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "\"": "&quot;"
    }, __fest_escapeJS = function __fest_escapeJS(value) {
      if (typeof value === 'string') {
        if (__fest_jschars_test.test(value)) {
          return value.replace(__fest_jschars, __fest_replaceJS);
        }
      }

      return value == null ? '' : value;
    }, __fest_replaceJS = function __fest_replaceJS(chr) {
      return __fest_jshash[chr];
    }, __fest_escapeHTML = function __fest_escapeHTML(value) {
      if (typeof value === 'string') {
        if (__fest_htmlchars_test.test(value)) {
          return value.replace(__fest_htmlchars, __fest_replaceHTML);
        }
      }

      return value == null ? '' : value;
    }, __fest_replaceHTML = function __fest_replaceHTML(chr) {
      return __fest_htmlhash[chr];
    }, __fest_extend = function __fest_extend(dest, src) {
      for (var key in src) {
        if (src.hasOwnProperty(key)) {
          dest[key] = src[key];
        }
      }
    }, __fest_param = function __fest_param(fn) {
      fn.param = true;
      return fn;
    }, i18n = __fest_self && typeof __fest_self.i18n === "function" ? __fest_self.i18n : function (str) {
      return str;
    }, ___fest_log_error;
    if (typeof __fest_error === "undefined") {
      ___fest_log_error = (typeof console !== "undefined" && console.error) ? function () {
        return Function.prototype.apply.call(console.error, console, arguments)
      } : function () {
      };
    } else {
      ___fest_log_error = __fest_error
    }
    ;
    function __fest_log_error(msg) {
      ___fest_log_error(msg + "\nin block \"" + __fest_debug_block + "\" at line: " + __fest_debug_line + "\nfile: " + __fest_debug_file)
    }

    function __fest_call(fn, params, cp) {
      if (cp)for (var i in params)if (typeof params[i] == "function" && params[i].param)params[i] = params[i]();
      return fn.call(__fest_self, params)
    }

    var info = __fest_context;
    try {
      var active = {active: 'leaders', nick: info.username}
    } catch (e) {
      __fest_log_error(e.message);
    }
    var __fest_context0;
    try {
      __fest_context0 = active
    } catch (e) {
      __fest_context0 = {};
      __fest_log_error(e.message)
    }
    ;
    (function (__fest_context) {
      var info = __fest_context;
      __fest_buf += ("<div class=\"user-bar\">Вы вошли как ");
      try {
        __fest_buf += (__fest_escapeHTML(info.nick))
      } catch (e) {
        __fest_log_error(e.message + "2");
      }
      __fest_buf += ("</div><nav id=\"main-navigation\"><ul>");
      try {
        __fest_attrs[0] = __fest_escapeHTML(info.active === 'play' ? 'active-item' : '')
      } catch (e) {
        __fest_attrs[0] = "";
        __fest_log_error(e.message);
      }
      __fest_buf += ("<li class=\"" + __fest_attrs[0] + "\"><a href=\"play\" class=\"no-reload\" title=\"Играть\">Играть</a></li>");
      try {
        __fest_attrs[0] = __fest_escapeHTML(info.active === 'leaders' ? 'active-item' : '')
      } catch (e) {
        __fest_attrs[0] = "";
        __fest_log_error(e.message);
      }
      __fest_buf += ("<li class=\"" + __fest_attrs[0] + "\"><a href=\"leaders\" class=\"no-reload\" title=\"Лидерборд\">Лидерборд</a></li>");
      try {
        __fest_attrs[0] = __fest_escapeHTML(info.active === 'about' ? 'active-item' : '')
      } catch (e) {
        __fest_attrs[0] = "";
        __fest_log_error(e.message);
      }
      __fest_buf += ("<li class=\"" + __fest_attrs[0] + "\"><a href=\"about\" class=\"no-reload\" title=\"Об игре\">Об игре</a></li><li><a href=\"login\" class=\"no-reload logout-link\" title=\"Выйти\">Выйти</a></li></ul></nav>");
    })(__fest_context0);
    __fest_buf += ("<div id=\"main-content-container\"><div id=\"main-content\"><table id=\"leaderboard\"><col width=\"300\"/><col width=\"150\"/><col width=\"100\"/><thead><tr><th><a href=\"\">Игрок</a></th><th><a href=\"\">Уровень</a></th><th><a href=\"\">Рейтинг</a></th></tr></thead><tbody>");
    var i, v, __fest_to1, __fest_iterator1;
    try {
      __fest_iterator1 = info.leaders || [];
      __fest_to1 = __fest_iterator1.length;
    } catch (e) {
      __fest_iterator1 = [];
      __fest_to1 = 0;
      __fest_log_error(e.message);
    }
    for (i = 0; i < __fest_to1; i++) {
      v = __fest_iterator1[i];
      __fest_buf += ("<tr><td><a href=\"\">");
      try {
        __fest_buf += (__fest_escapeHTML(v.username))
      } catch (e) {
        __fest_log_error(e.message + "20");
      }
      __fest_buf += ("</a></td><td>");
      try {
        __fest_buf += (__fest_escapeHTML(v.level))
      } catch (e) {
        __fest_log_error(e.message + "21");
      }
      __fest_buf += ("</td><td>");
      try {
        __fest_buf += (__fest_escapeHTML(v.rating))
      } catch (e) {
        __fest_log_error(e.message + "22");
      }
      __fest_buf += ("</td></tr>");
    }
    __fest_buf += ("</tbody></table></div></div>");
    __fest_to = __fest_chunks.length;
    if (__fest_to) {
      __fest_iterator = 0;
      for (; __fest_iterator < __fest_to; __fest_iterator++) {
        __fest_chunk = __fest_chunks[__fest_iterator];
        if (typeof __fest_chunk === "string") {
          __fest_html += __fest_chunk;
        } else {
          __fest_fn = __fest_blocks[__fest_chunk.name];
          if (__fest_fn) __fest_html += __fest_call(__fest_fn, __fest_chunk.params, __fest_chunk.cp);
        }
      }
      return __fest_html + __fest_buf;
    } else {
      return __fest_buf;
    }
  }
})();

},{}],12:[function(require,module,exports){
;(function () {
  var x = Function('return this')();
  if (!x.fest)x.fest = {};
  module.exports = function (__fest_context) {
    "use strict";
    var __fest_self = this, __fest_buf = "", __fest_chunks = [], __fest_chunk, __fest_attrs = [], __fest_select, __fest_if, __fest_iterator, __fest_to, __fest_fn, __fest_html = "", __fest_blocks = {}, __fest_params, __fest_element, __fest_debug_file = "", __fest_debug_line = "", __fest_debug_block = "", __fest_element_stack = [], __fest_short_tags = {
      "area": true,
      "base": true,
      "br": true,
      "col": true,
      "command": true,
      "embed": true,
      "hr": true,
      "img": true,
      "input": true,
      "keygen": true,
      "link": true,
      "meta": true,
      "param": true,
      "source": true,
      "wbr": true
    }, __fest_jschars = /[\\'"\/\n\r\t\b\f<>]/g, __fest_jschars_test = /[\\'"\/\n\r\t\b\f<>]/, __fest_htmlchars = /[&<>"]/g, __fest_htmlchars_test = /[&<>"]/, __fest_jshash = {
      "\"": "\\\"",
      "\\": "\\\\",
      "/": "\\/",
      "\n": "\\n",
      "\r": "\\r",
      "\t": "\\t",
      "\b": "\\b",
      "\f": "\\f",
      "'": "\\'",
      "<": "\\u003C",
      ">": "\\u003E"
    }, __fest_htmlhash = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "\"": "&quot;"
    }, __fest_escapeJS = function __fest_escapeJS(value) {
      if (typeof value === 'string') {
        if (__fest_jschars_test.test(value)) {
          return value.replace(__fest_jschars, __fest_replaceJS);
        }
      }

      return value == null ? '' : value;
    }, __fest_replaceJS = function __fest_replaceJS(chr) {
      return __fest_jshash[chr];
    }, __fest_escapeHTML = function __fest_escapeHTML(value) {
      if (typeof value === 'string') {
        if (__fest_htmlchars_test.test(value)) {
          return value.replace(__fest_htmlchars, __fest_replaceHTML);
        }
      }

      return value == null ? '' : value;
    }, __fest_replaceHTML = function __fest_replaceHTML(chr) {
      return __fest_htmlhash[chr];
    }, __fest_extend = function __fest_extend(dest, src) {
      for (var key in src) {
        if (src.hasOwnProperty(key)) {
          dest[key] = src[key];
        }
      }
    }, __fest_param = function __fest_param(fn) {
      fn.param = true;
      return fn;
    }, i18n = __fest_self && typeof __fest_self.i18n === "function" ? __fest_self.i18n : function (str) {
      return str;
    }, ___fest_log_error;
    if (typeof __fest_error === "undefined") {
      ___fest_log_error = (typeof console !== "undefined" && console.error) ? function () {
        return Function.prototype.apply.call(console.error, console, arguments)
      } : function () {
      };
    } else {
      ___fest_log_error = __fest_error
    }
    ;
    function __fest_log_error(msg) {
      ___fest_log_error(msg + "\nin block \"" + __fest_debug_block + "\" at line: " + __fest_debug_line + "\nfile: " + __fest_debug_file)
    }

    function __fest_call(fn, params, cp) {
      if (cp)for (var i in params)if (typeof params[i] == "function" && params[i].param)params[i] = params[i]();
      return fn.call(__fest_self, params)
    }

    var loginForm = __fest_context;
    try {
      __fest_buf += (loginForm)
    } catch (e) {
      __fest_log_error(e.message + "2");
    }
    __fest_to = __fest_chunks.length;
    if (__fest_to) {
      __fest_iterator = 0;
      for (; __fest_iterator < __fest_to; __fest_iterator++) {
        __fest_chunk = __fest_chunks[__fest_iterator];
        if (typeof __fest_chunk === "string") {
          __fest_html += __fest_chunk;
        } else {
          __fest_fn = __fest_blocks[__fest_chunk.name];
          if (__fest_fn) __fest_html += __fest_call(__fest_fn, __fest_chunk.params, __fest_chunk.cp);
        }
      }
      return __fest_html + __fest_buf;
    } else {
      return __fest_buf;
    }
  }
})();

},{}],13:[function(require,module,exports){
;(function () {
  var x = Function('return this')();
  if (!x.fest)x.fest = {};
  module.exports = function (__fest_context) {
    "use strict";
    var __fest_self = this, __fest_buf = "", __fest_chunks = [], __fest_chunk, __fest_attrs = [], __fest_select, __fest_if, __fest_iterator, __fest_to, __fest_fn, __fest_html = "", __fest_blocks = {}, __fest_params, __fest_element, __fest_debug_file = "", __fest_debug_line = "", __fest_debug_block = "", __fest_element_stack = [], __fest_short_tags = {
      "area": true,
      "base": true,
      "br": true,
      "col": true,
      "command": true,
      "embed": true,
      "hr": true,
      "img": true,
      "input": true,
      "keygen": true,
      "link": true,
      "meta": true,
      "param": true,
      "source": true,
      "wbr": true
    }, __fest_jschars = /[\\'"\/\n\r\t\b\f<>]/g, __fest_jschars_test = /[\\'"\/\n\r\t\b\f<>]/, __fest_htmlchars = /[&<>"]/g, __fest_htmlchars_test = /[&<>"]/, __fest_jshash = {
      "\"": "\\\"",
      "\\": "\\\\",
      "/": "\\/",
      "\n": "\\n",
      "\r": "\\r",
      "\t": "\\t",
      "\b": "\\b",
      "\f": "\\f",
      "'": "\\'",
      "<": "\\u003C",
      ">": "\\u003E"
    }, __fest_htmlhash = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "\"": "&quot;"
    }, __fest_escapeJS = function __fest_escapeJS(value) {
      if (typeof value === 'string') {
        if (__fest_jschars_test.test(value)) {
          return value.replace(__fest_jschars, __fest_replaceJS);
        }
      }

      return value == null ? '' : value;
    }, __fest_replaceJS = function __fest_replaceJS(chr) {
      return __fest_jshash[chr];
    }, __fest_escapeHTML = function __fest_escapeHTML(value) {
      if (typeof value === 'string') {
        if (__fest_htmlchars_test.test(value)) {
          return value.replace(__fest_htmlchars, __fest_replaceHTML);
        }
      }

      return value == null ? '' : value;
    }, __fest_replaceHTML = function __fest_replaceHTML(chr) {
      return __fest_htmlhash[chr];
    }, __fest_extend = function __fest_extend(dest, src) {
      for (var key in src) {
        if (src.hasOwnProperty(key)) {
          dest[key] = src[key];
        }
      }
    }, __fest_param = function __fest_param(fn) {
      fn.param = true;
      return fn;
    }, i18n = __fest_self && typeof __fest_self.i18n === "function" ? __fest_self.i18n : function (str) {
      return str;
    }, ___fest_log_error;
    if (typeof __fest_error === "undefined") {
      ___fest_log_error = (typeof console !== "undefined" && console.error) ? function () {
        return Function.prototype.apply.call(console.error, console, arguments)
      } : function () {
      };
    } else {
      ___fest_log_error = __fest_error
    }
    ;
    function __fest_log_error(msg) {
      ___fest_log_error(msg + "\nin block \"" + __fest_debug_block + "\" at line: " + __fest_debug_line + "\nfile: " + __fest_debug_file)
    }

    function __fest_call(fn, params, cp) {
      if (cp)for (var i in params)if (typeof params[i] == "function" && params[i].param)params[i] = params[i]();
      return fn.call(__fest_self, params)
    }

    var user = __fest_context;
    try {
      var active = {active: 'play', nick: user}
    } catch (e) {
      __fest_log_error(e.message);
    }
    var __fest_context0;
    try {
      __fest_context0 = active
    } catch (e) {
      __fest_context0 = {};
      __fest_log_error(e.message)
    }
    ;
    (function (__fest_context) {
      var info = __fest_context;
      __fest_buf += ("<div class=\"user-bar\">Вы вошли как ");
      try {
        __fest_buf += (__fest_escapeHTML(info.nick))
      } catch (e) {
        __fest_log_error(e.message + "2");
      }
      __fest_buf += ("</div><nav id=\"main-navigation\"><ul>");
      try {
        __fest_attrs[0] = __fest_escapeHTML(info.active === 'play' ? 'active-item' : '')
      } catch (e) {
        __fest_attrs[0] = "";
        __fest_log_error(e.message);
      }
      __fest_buf += ("<li class=\"" + __fest_attrs[0] + "\"><a href=\"play\" class=\"no-reload\" title=\"Играть\">Играть</a></li>");
      try {
        __fest_attrs[0] = __fest_escapeHTML(info.active === 'leaders' ? 'active-item' : '')
      } catch (e) {
        __fest_attrs[0] = "";
        __fest_log_error(e.message);
      }
      __fest_buf += ("<li class=\"" + __fest_attrs[0] + "\"><a href=\"leaders\" class=\"no-reload\" title=\"Лидерборд\">Лидерборд</a></li>");
      try {
        __fest_attrs[0] = __fest_escapeHTML(info.active === 'about' ? 'active-item' : '')
      } catch (e) {
        __fest_attrs[0] = "";
        __fest_log_error(e.message);
      }
      __fest_buf += ("<li class=\"" + __fest_attrs[0] + "\"><a href=\"about\" class=\"no-reload\" title=\"Об игре\">Об игре</a></li><li><a href=\"login\" class=\"no-reload logout-link\" title=\"Выйти\">Выйти</a></li></ul></nav>");
    })(__fest_context0);
    __fest_buf += ("<div id=\"main-content-container\"><div id=\"game\"></div></div>");
    __fest_to = __fest_chunks.length;
    if (__fest_to) {
      __fest_iterator = 0;
      for (; __fest_iterator < __fest_to; __fest_iterator++) {
        __fest_chunk = __fest_chunks[__fest_iterator];
        if (typeof __fest_chunk === "string") {
          __fest_html += __fest_chunk;
        } else {
          __fest_fn = __fest_blocks[__fest_chunk.name];
          if (__fest_fn) __fest_html += __fest_call(__fest_fn, __fest_chunk.params, __fest_chunk.cp);
        }
      }
      return __fest_html + __fest_buf;
    } else {
      return __fest_buf;
    }
  }
})();

},{}],14:[function(require,module,exports){
;(function () {
  var x = Function('return this')();
  if (!x.fest)x.fest = {};
  module.exports = function (__fest_context) {
    "use strict";
    var __fest_self = this, __fest_buf = "", __fest_chunks = [], __fest_chunk, __fest_attrs = [], __fest_select, __fest_if, __fest_iterator, __fest_to, __fest_fn, __fest_html = "", __fest_blocks = {}, __fest_params, __fest_element, __fest_debug_file = "", __fest_debug_line = "", __fest_debug_block = "", __fest_element_stack = [], __fest_short_tags = {
      "area": true,
      "base": true,
      "br": true,
      "col": true,
      "command": true,
      "embed": true,
      "hr": true,
      "img": true,
      "input": true,
      "keygen": true,
      "link": true,
      "meta": true,
      "param": true,
      "source": true,
      "wbr": true
    }, __fest_jschars = /[\\'"\/\n\r\t\b\f<>]/g, __fest_jschars_test = /[\\'"\/\n\r\t\b\f<>]/, __fest_htmlchars = /[&<>"]/g, __fest_htmlchars_test = /[&<>"]/, __fest_jshash = {
      "\"": "\\\"",
      "\\": "\\\\",
      "/": "\\/",
      "\n": "\\n",
      "\r": "\\r",
      "\t": "\\t",
      "\b": "\\b",
      "\f": "\\f",
      "'": "\\'",
      "<": "\\u003C",
      ">": "\\u003E"
    }, __fest_htmlhash = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "\"": "&quot;"
    }, __fest_escapeJS = function __fest_escapeJS(value) {
      if (typeof value === 'string') {
        if (__fest_jschars_test.test(value)) {
          return value.replace(__fest_jschars, __fest_replaceJS);
        }
      }

      return value == null ? '' : value;
    }, __fest_replaceJS = function __fest_replaceJS(chr) {
      return __fest_jshash[chr];
    }, __fest_escapeHTML = function __fest_escapeHTML(value) {
      if (typeof value === 'string') {
        if (__fest_htmlchars_test.test(value)) {
          return value.replace(__fest_htmlchars, __fest_replaceHTML);
        }
      }

      return value == null ? '' : value;
    }, __fest_replaceHTML = function __fest_replaceHTML(chr) {
      return __fest_htmlhash[chr];
    }, __fest_extend = function __fest_extend(dest, src) {
      for (var key in src) {
        if (src.hasOwnProperty(key)) {
          dest[key] = src[key];
        }
      }
    }, __fest_param = function __fest_param(fn) {
      fn.param = true;
      return fn;
    }, i18n = __fest_self && typeof __fest_self.i18n === "function" ? __fest_self.i18n : function (str) {
      return str;
    }, ___fest_log_error;
    if (typeof __fest_error === "undefined") {
      ___fest_log_error = (typeof console !== "undefined" && console.error) ? function () {
        return Function.prototype.apply.call(console.error, console, arguments)
      } : function () {
      };
    } else {
      ___fest_log_error = __fest_error
    }
    ;
    function __fest_log_error(msg) {
      ___fest_log_error(msg + "\nin block \"" + __fest_debug_block + "\" at line: " + __fest_debug_line + "\nfile: " + __fest_debug_file)
    }

    function __fest_call(fn, params, cp) {
      if (cp)for (var i in params)if (typeof params[i] == "function" && params[i].param)params[i] = params[i]();
      return fn.call(__fest_self, params)
    }

    var registerForm = __fest_context;
    try {
      __fest_buf += (registerForm)
    } catch (e) {
      __fest_log_error(e.message + "2");
    }
    __fest_to = __fest_chunks.length;
    if (__fest_to) {
      __fest_iterator = 0;
      for (; __fest_iterator < __fest_to; __fest_iterator++) {
        __fest_chunk = __fest_chunks[__fest_iterator];
        if (typeof __fest_chunk === "string") {
          __fest_html += __fest_chunk;
        } else {
          __fest_fn = __fest_blocks[__fest_chunk.name];
          if (__fest_fn) __fest_html += __fest_call(__fest_fn, __fest_chunk.params, __fest_chunk.cp);
        }
      }
      return __fest_html + __fest_buf;
    } else {
      return __fest_buf;
    }
  }
})();

},{}]},{},[3]);
