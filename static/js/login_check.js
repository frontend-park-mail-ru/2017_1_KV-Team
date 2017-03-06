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
