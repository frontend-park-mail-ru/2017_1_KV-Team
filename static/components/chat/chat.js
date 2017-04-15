/**
 * Created by andreivinogradov on 01.04.17.
 */

export default class Chat {
  constructor({ data = {}, parent, template }) {
    this.data = data;
    this.parent = parent;
    this.template = template;
  }

  render() {
    // this.updateHtml(this.data);
    this.renderMessages(this.data.messages);
  }

  set(data) {
    this.data = data;

    return this;
  }

  install(el) {
    el.appendChild(this.parent);
  }

  updateHtml(data) {
    console.log(data);
    this.parent.innerHTML = this.template(data);
  }

  static createMessage(opts, isMy = false) {
    const message = document.createElement('div');
    const username = document.createElement('div');

    message.classList.add('chat__message');
    username.classList.add('chat__username');

    if (isMy) {
      message.classList.add('chat__message_my');
    }

    message.innerHTML = opts.message;
    username.innerHTML = `${opts.username}:`;
    message.prepend(username);

    return message;
  }

  renderMessages(items) {
    if (!items.length) {
      return;
    }

    const messages = this.parent.querySelector('.chat__messages');
    messages.innerHTML = '';

    items.forEach((item) => {
      const message = Chat.createMessage(item, item.username === this.data.username);
      messages.appendChild(message);
    });

    messages.scrollTop = messages.scrollHeight;
  }

  sendMessage(message) {
    if (message) {
      this.data.messages.push({ message, username: this.data.username });
      this.renderMessages(this.data.messages);
    }
  }
}

// module.exports = Chat;
