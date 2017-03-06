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