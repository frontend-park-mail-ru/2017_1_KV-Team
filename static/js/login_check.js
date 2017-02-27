/**
 * Created by andreivinogradov on 27.02.17.
 */
/* global Valnder */
/* global app */

(function () {
  const loginField = document.getElementById('login-name');
  const loginForm = document.getElementById('login-form');

  const loginValidator = new Valnder();
  loginValidator.register(loginForm);

  // Четвертый параметр - url для проверки поля через ajax (если нету, то это url всей формы)
  loginValidator.addServerSideValidation(loginField, 'Неправильный логин/пароль', 'wrongLogPass');

  loginValidator.renderFunction(text => `<p class='input-error'>${text}</p>`);

  loginValidator.renderTo('.err-container');

  app.connectValidator(loginValidator);
}());
