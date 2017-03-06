(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
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

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./../templates/404.js":7,"./../templates/about.js":8,"./../templates/leaders.js":9,"./../templates/login.js":10,"./../templates/play.js":11,"./../templates/registration.js":12,"./appService.js":2,"./credentials_check.js":3,"./login_check.js":4}],2:[function(require,module,exports){
/**
 * Created by andreivinogradov on 06.03.17.
 */
const HTTP = require('../modules/http.js');

class AppService {
  constructor() {
    this.http = new HTTP();
  }
  getLeaders(callback) {
    this.http.get('/leaders', null, (resp) => {
      callback(resp);
      console.log(resp);
    });
  }
  isLoggedIn(callback) {
    this.http.get('/api/isloggedin', null, (resp) => {
      callback(resp);
      console.log(resp);
    });
  }
  login(login, pass, callback) {
    const body = { login, pass };
    this.http.post('/api/login', body, (resp) => {
      callback(resp);
      console.log(resp);
    });
  }
  logout(callback) {
    this.http.get('/api/logout', null, (resp) => {
      callback(resp);
      console.log(resp);
    });
  }
  register(login, email, pass, callback) {
    const body = { login, email, pass };
    this.http.post('/api/account', body, (resp) => {
      callback(resp);
      console.log(resp);
    });
  }
  getAccount(username, callback) {
    this.http.get('/api/account/', { username }, (resp) => {
      callback(resp);
      console.log(resp);
    });
  }
  editAccount(newEmail, newPass, callback) {
    const body = { newEmail, newPass };
    this.http.put('/api/account', body, (resp) => {
      callback(resp);
      console.log(resp);
    });
  }
}

module.exports = AppService;

},{"../modules/http.js":6}],3:[function(require,module,exports){
/* global Valnder */
/* global app */
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
    'userAlreadyExists');

// В функцию рендера передается функция которая возвращает html с ошибкой
  val.renderFunction(text => `<p class='input-error'>${text}</p>`);

// В эту функцию передается класс контейнера для ошибки
  val.renderTo('.err-container');

  app.connectValidator(val);
};

},{"./sValidator.js":5}],4:[function(require,module,exports){
/**
 * Created by andreivinogradov on 27.02.17.
 */
/* global Valnder */
/* global app */
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
  loginValidator.addServerSideValidation(loginField, 'Неправильный логин/пароль', 'wrongLogPass');

  loginValidator.renderFunction(text => `<p class='input-error'>${text}</p>`);

  loginValidator.renderTo('.err-container');

  app.connectValidator(loginValidator);
};

},{"./sValidator.js":5}],5:[function(require,module,exports){
/**
 * Created by andreivinogradov on 20.02.17.
 */

/* eslint no-unused-vars:0 */
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
  showErrors() {
    let isValid = true;
    this.fields.forEach((errors, elem) => {
      const field = elem;
      const err = this.checkAll(errors);
      if (err) {
        isValid = false;
      }
      field.parentNode.querySelector(this.containerClass).innerHTML = err;
    });
    return isValid;
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
/**
 * Created by andreivinogradov on 06.03.17.
 */

const protocol = 'http';
const hostname = 'localhost';
const portNumber = '8082';

class HTTP {
  constructor() {
    if (HTTP.__instance) {
      return HTTP.__instance;
    }

    this._headers = {};
    this._baseUrl = `${protocol}://${hostname}:${portNumber}`;

    HTTP.__instance = this;
  }

  get Headers() {
    return this._headers;
  }

  set Headers(value) {
    if (!(value && ('' + value === '[object Object]'))) {
      throw new TypeError('Headers must be a plain object');
    }
    const valid = Object.keys(value).every(key => typeof value[key] === 'string');
    if (!valid) {
      throw new TypeError('Headers must be a plain object');
    }
    this._headers = value;
  }

  get BaseURL() {
    return this._baseUrl;
  }

  set BaseURL(value) {
    this._baseUrl = value;
  }

  get(address, query = null, callback = null) {
    let url = `${this._baseUrl}${address}`;
    if (query) {
      url += Object.keys(query)
        .map(name => encodeURIComponent(`${name}=${query[name]}`))
        .join('&');
    }
    fetch(url, {
      method: 'GET',
      credentials: 'include',
      mode: 'cors',
      headers: this._headers,
    })
      .then(callback);
  }

  post(address, body = null, callback = null) {
    let url = `${this._baseUrl}${address}`;
    console.log(url);
    fetch(url, {
      method: 'post',
      headers: Object.assign({ 'Content-type': 'application/json; charset=utf-8'}, this._headers),
      mode: 'cors',
      credentials: 'include',
      body: JSON.stringify(body) || null,
    })
      .then(callback);
  }

  put(address, body = null, callback = null) {
    let url = `${this._baseUrl}${address}`;
    fetch(url, {
      method: 'put',
      headers: Object.assign({ 'Content-type': 'application/json; charset=utf-8' }, this._headers),
      mode: 'cors',
      credentials: 'include',
      body: JSON.stringify(body) || null,
    })
      .then(callback);
  }

  delete(address, body = null, callback = null) {
    let url = `${this._baseUrl}${address}`;
    fetch(url, {
      method: 'delete',
      headers: Object.assign({ 'Content-type': 'application/json; charset=utf-8' }, this._headers),
      mode: 'cors',
      credentials: 'include',
      body: JSON.stringify(body) || null,
    })
      .then(callback);
  }
}

module.exports = HTTP;

},{}],7:[function(require,module,exports){
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
},{}],8:[function(require,module,exports){
;(function () {
  var x = Function('return this')();
  if (!x.fest)x.fest = {};
  module.exports = function (__fest_context) {
    "use strict";
    var __fest_self = this, __fest_buf = "", __fest_chunks = [], __fest_chunk, __fest_attrs = [], __fest_select, __fest_if, __fest_iterator, __fest_to, __fest_fn, __fest_html = "", __fest_blocks = {}, __fest_params, __fest_element, __fest_debug_file = "", __fest_debug_line = "", __fest_debug_block = "", __fest_element_stack = [], __fest_short_tags = {
      'area': true,
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

    __fest_buf += ("<nav id=\"main-navigation\"><ul><li><a href=\"play\" class=\"no-reload\" title=\"Играть\">Играть</a></li><li><a href=\"leaders\" class=\"no-reload\" title=\"Лидерборд\">Лидерборд</a></li><li class=\"active-item\"><a href=\"about\" class=\"no-reload\" title=\"Об игре\">Об игре</a></li><li><a href=\"login\" class=\"no-reload\" title=\"Выйти\">Выйти</a></li></ul></nav><div id=\"main-content-container\"><div id=\"main-content\"><p>«Карточная стратегия для всех» — заявлено на официальном сайте Hearthstone.\n                Под «всеми» подразумеваются любители и киберспортсмены, хотя Blizzard не планировала\n                продвигать\n                соревновательную составляющую. Однако многотысячные армии зрителей на трансляциях\n                турниров прозрачно\n                намекнули: хотим, чтоб всё всерьез! И создатели «Военного ремесла» пошли им навстречу.</p></div></div>");
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
},{}],9:[function(require,module,exports){
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

    var leaders = __fest_context;
    __fest_buf += ("<nav id=\"main-navigation\"><ul><li><a href=\"play\" class=\"no-reload\" title=\"Играть\">Играть</a></li><li class=\"active-item\"><a href=\"leaders\" class=\"no-reload\" title=\"Лидерборд\">Лидерборд</a></li><li><a href=\"aboutts\" class=\"no-reload\" title=\"Об игре\">Об игре</a></li><li><a href=\"login\" class=\"no-reload\" title=\"Выйти\">Выйти</a></li></ul></nav><div id=\"main-content-container\"><div id=\"main-content\"><table id=\"leaderboard\"><col width=\"300\"/><col width=\"150\"/><col width=\"100\"/><thead><tr><th><a href=\"\">Игрок</a></th><th><a href=\"\">Уровень</a></th><th><a href=\"\">Рейтинг</a></th></tr></thead><tbody>");
    var nam, val, __fest_iterator0;
    try {
      __fest_iterator0 = leaders || {};
    } catch (e) {
      __fest_iterator = {};
      __fest_log_error(e.message);
    }
    for (nam in __fest_iterator0) {
      val = __fest_iterator0[nam];
      __fest_buf += ("<tr><td><a href=\"\">");
      try {
        __fest_buf += (__fest_escapeHTML(nam))
      } catch (e) {
        __fest_log_error(e.message + "26");
      }
      __fest_buf += ("</a></td><td>");
      try {
        __fest_buf += (__fest_escapeHTML(val.level))
      } catch (e) {
        __fest_log_error(e.message + "27");
      }
      __fest_buf += ("</td><td>");
      try {
        __fest_buf += (__fest_escapeHTML(val.score))
      } catch (e) {
        __fest_log_error(e.message + "28");
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

    __fest_buf += ("<form id=\"login-form\" action=\"ajax_login\" novalidate=\"true\"><ul class=\"flex-outer\"><li><label for=\"login-name\">Логин</label><div><input type=\"text\" name=\"name\" id=\"login-name\" placeholder=\"Введите логин\"/><div class=\"err-container\"></div></div></li><li><label for=\"login-password\">Пароль</label><div><input type=\"password\" name=\"pass\" id=\"login-password\" placeholder=\"Введите пароль\"/><div class=\"err-container\"></div></div></li><li><div class=\"space-taker\"></div><a href=\"register\" class=\"no-reload\" id=\"register-btn\">Зарегистрироваться</a><button type=\"submit\">Войти</button></li></ul></form>");
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

    __fest_buf += ("<nav id=\"main-navigation\"><ul><li class=\"active-item\"><a href=\"play\" class=\"no-reload\" title=\"Играть\">Играть</a></li><li><a href=\"leaders\" class=\"no-reload\" title=\"Лидерборд\">Лидерборд</a></li><li><a href=\"about\" class=\"no-reload\" title=\"Об игре\">Об игре</a></li><li><a href=\"login\" class=\"no-reload\" title=\"Выйти\">Выйти</a></li></ul></nav><div id=\"main-content-container\"><div id=\"game\"></div></div>");
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

    __fest_buf += ("<form id=\"registration-form\" action=\"ajax_register\" novalidate=\"true\"><ul class=\"flex-outer\"><li><label for=\"reg-name\">Логин</label><div><input type=\"text\" name=\"name\" id=\"reg-name\" placeholder=\"Придумайте логин\" required=\"true\"/><div class=\"err-container\"></div></div></li><li><label for=\"email\">Email</label><div><input type=\"email\" name=\"email\" id=\"email\" placeholder=\"Введите свой email\" required=\"true\"/><div class=\"err-container\"></div></div></li><li><label for=\"reg-password\">Пароль</label><div><input type=\"password\" name=\"pass\" id=\"reg-password\" placeholder=\"Придумайте пароль\" required=\"true\"/><div class=\"err-container\"></div></div></li><li><label for=\"password2\">Повторите пароль</label><div><input type=\"password\" id=\"password2\" placeholder=\"Повторите пароль\" required=\"true\"/><div class=\"err-container\"></div></div></li><li><div class=\"space-taker\"></div><a href=\"login\" class=\"no-reload\">Уже есть аккаунт?</a><button type=\"submit\">Зарегистрироваться</button></li></ul></form>");
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
},{}]},{},[1]);
