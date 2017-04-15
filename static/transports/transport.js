/**
 * Created by andreivinogradov on 31.03.17.
 */

import Mediator from '../modules/mediator';

export default class MagicTransport {
  // Открыть соединение через которое будут передаваться данные
  constructor(url, game) {
    this.socket = new WebSocket(url);

    this.mediator = new Mediator(game);

    this.socket.onclose = (event) => {
      if (event.wasClean) {
        console.log('Соединение закрыто чисто');
      } else {
        console.log('Обрыв соединения'); // например, "убит" процесс сервера
      }
      console.log(`Код: ${event.code} причина: ${event.reason}`);
    };

    this.socket.onmessage = this.handleMessage.bind(this);

    this.socket.onerror = (error) => {
      console.log(`Ошибка ${error.message}`);
    };
  }

  handleMessage(event) {
    const messageText = event.data;
    const message = JSON.parse(messageText);
    this.mediator.emit(message);
  }

  send(message) {
    this.socket.send(JSON.stringify(message));
  }

  waitOpened() {
    return new Promise((resolve) => {
      this.socket.onopen = () => {
        console.log('Соединение установлено!');
        resolve();
      };
    });
  }
}
