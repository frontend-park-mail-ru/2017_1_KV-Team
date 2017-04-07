/**
 * Created by andreivinogradov on 05.03.17.
 */
const Button = require('../button/button.js');

class Form {
  constructor({ parentSelector, preset = 'default', fields = [], attributes = {}, controls = [] }) {
    this.fields = fields;
    this.attributes = attributes;
    this.controls = controls;
    this.html = '';
    this.parentSelector = parentSelector;

    this.presets = {
      entrance: {
        general: () => `
        <form ${this.attrsAsString()}>
          <ul class="form_entrance__list">
            ${this.getFields()}
            <li class="controls form_entrance__item">
              <div class="form_entrance__space-taker"></div>
              ${this.installControls()}
            </li>
          </ul>
        <form>
      `,
        field: field => `
          <li class="input-item form_entrance__item">
            <label class="input-item__label" for="${field.attributes.id}">${field.label}</label> 
            <div>
              <input ${this.attrsAsString(field.attributes)}">
              <div class="input-item__error"></div>
            </div>
          </li>
      `,
        control: control =>
          (control.type === 'button' ?
            new Button({ text: control.value, attrs: control.attributes }).render() :
            `<${control.type} ${this.attrsAsString(control.attributes)}>
           ${control.value}
          </${control.type}>
        `) },

      default: {
        general: () => `      
        <form ${this.attrsAsString()}>
          <div class="form_start-game-options__select-role">Выберите роль:</div>
            ${this.getFields()}
            ${this.installControls()}
        <form>
        `,
        field: field => `
          <input ${this.attrsAsString(field.attributes)}">
          <label class="form_start-game-options__label" for="${field.attributes.id}">${field.label}</label> 
        `,
        control: control =>
          (control.type === 'button' ?
            new Button({ text: control.value, attrs: control.attributes }).render() :
            `<${control.type} ${this.attrsAsString(control.attributes)}>
           ${control.value}
          </${control.type}>
        `),
      },

      chat: {
        general: () => `      
        <form ${this.attrsAsString()}>
            ${this.getFields()}
            ${this.installControls()}
        <form>
        `,
        field: field => `
          <input ${this.attrsAsString(field.attributes)}">
        `,
        control: control =>
          (control.type === 'button' ?
            new Button({ text: control.value, attrs: control.attributes }).render() :
            `<${control.type} ${this.attrsAsString(control.attributes)}>
           ${control.value}
          </${control.type}>
        `),
      },
    };

    this.preset = this.presets[preset];
  }

  resetParent() {
    this.parent = document.querySelector(this.parentSelector);
  }

  render() {
    this.updateHtml();

    this.parent.innerHTML = this.html;
  }

  getFields() {
    return this.fields.map(this.preset.field)
      .join('');
  }

  attrsAsString(attributes = this.attributes) {
    return Object.keys(attributes).map(attr => `
        ${attr.startsWith('data_') ? attr.replace('_', '-') : attr}
        ="${attributes[attr]}"`)
      .join(' ');
  }

  updateHtml() {
    this.html = this.preset.general();
  }

  installControls() {
    return this.controls.map(this.preset.control).join(' ');
  }

  getFormData() {
    const form = this.parent.querySelector('form');
    const elements = form.elements;
    const fields = {};

    Object.keys(elements).forEach((element) => {
      const name = elements[element].name;

      let value;
      if (elements[element].type === 'checkbox') {
        value = elements[element].checked;
      } else {
        value = elements[element].value;
      }

      if (!name) {
        return;
      }

      fields[name] = value;
    });

    return fields;
  }
}

module.exports = Form;
