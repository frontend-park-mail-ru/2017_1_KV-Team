
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
