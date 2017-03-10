/**
 * Created by andreivinogradov on 05.03.17.
 */
class Button {
  constructor({ text = '', attrs = { class: 'btn' } }) {
    this.text = text;
    this.attrs = attrs;
  }

  setAttrs(attrs = this.attrs) {
    return Object.keys(attrs).map(attr => `${attr}="${attrs[attr]}"`).join(' ');
  }

  render() {
    return `
      <button type=submit ${this.setAttrs()}>${this.text}</button>
    `;
  }
}

module.exports = Button;
