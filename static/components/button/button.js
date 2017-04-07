/**
 * Created by andreivinogradov on 05.03.17.
 */
export default class Button {
  constructor({ text = '', attrs = { class: 'btn' } }) {
    this.text = text;
    this.attrs = attrs;
  }

  setAttrs(attrs = this.attrs) {
    return Object.keys(attrs).map(attr => `
        ${attr.startsWith('data_') ? attr.replace('_', '-') : attr}
        ="${attrs[attr]}"`)
      .join(' ');
  }

  render() {
    return `
      <button type=submit ${this.setAttrs()}>${this.text}</button>
    `;
  }
}

// module.exports = Button;
