/**
 * Created by andreivinogradov on 05.03.17.
 */
const Button = require('../button/button.js');

class Form {
  /**
   * Конструктор класса Form
   */
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

  /**
   * Вернуть поля формы
   * @return {string}
   */
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

  /**
   * Обновить html компонента
   */
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

  /**
   * Вставить управляющие элементы в форму
   */
  installControls() {
    return this.controls.map(control =>
      (control.type === 'button' ?
        new Button({ text: control.value }).render() :
        `<${control.type} ${this.attrsAsString(control.attributes)}>
          ${control.value}
         </${control.type}>
      `)).join(' ');
  }

  /**
   * Взять данные формы
   * @return {object}
   */
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
