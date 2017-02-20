/**
 * Created by andreivinogradov on 20.02.17.
 */

class Validator {
    static noInputValidation(input) {
        return !!input;
    };

    constructor() {
        this.fields = new Map();
    }

    register(form) {
        form.addEventListener('submit', e => {
            if (!this.renderErrors()) e.preventDefault();
        });
    }

    renderErrors() {
        let isValid = true;
        this.fields.forEach((errors, field) => {
            const err = this.checkAll(errors);
            if (err) isValid = false;
            field.parentNode.getElementsByClassName(this.containerClass)[0].innerHTML = err;
        });

        return isValid;
    }

    checkAll(errors, index = 0){
        if (!errors[index].validator()) return this.render(errors[index].msg);

        if (errors.length - 1 === index) return "";

        return this.checkAll(errors, index + 1);
    }

    addValidation(field, msg, valFn = this.constructor.noInputValidation) {
        const fields = [ field ].reduce((a, b) => a.concat(b), []);

        if (!this.fields.has(fields[0])) {
            this.fields.set(fields[0], [{ validator: () => valFn(...(fields.map(el => el.value))), msg: msg }]);
        } else {
            const fieldErrArray = this.fields.get(fields[0]);
            fieldErrArray.push({ validator: () => valFn(...(fields.map(el => el.value))), msg: msg });
        }
    }

    renderFunction(fn) {
        this.render = fn;
    }

    renderTo(cls){
        this.containerClass = cls;
    }
}