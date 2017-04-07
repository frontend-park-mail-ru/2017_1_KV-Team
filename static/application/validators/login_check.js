/**
 * Created by andreivinogradov on 27.02.17.
 */
import Valnder from '../sValidator';
// const Valnder = require('../sValidator.js');

const loginCheck = (app) => {
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

export default loginCheck;
