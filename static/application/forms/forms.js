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
