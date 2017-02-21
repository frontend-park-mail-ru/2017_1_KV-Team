/**
 * Created by andreivinogradov on 20.02.17.
 */

/*eslint no-unused-vars:false*/
class Valnder {
  static isEmpty(input) {
    return !!input;
  }

  constructor() {
    this.fields = new Map();
  }

  register(form) {
    form.addEventListener('submit', (e) => {
      if (!this.showErrors()) e.preventDefault();
    });
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

  renderFunction(fn) {
    this.render = fn;
  }

  renderTo(cls) {
    this.containerClass = cls;
  }
}
