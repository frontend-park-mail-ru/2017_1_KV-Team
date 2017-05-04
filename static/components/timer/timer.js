/**
 * Created by andreivinogradov on 02.05.17.
 */

class Timer {
  constructor(parent, howToRender) {
    this.seconds = 0;
    this.parent = parent;
    this.howToRender = howToRender;
    this.render();
  }

  render() {
    const elem = document.querySelector(this.parent);
    const timer = document.createElement('div');
    timer.classList.add('timer');
    timer.innerHTML = 'Поиск противника: ';
    this.counter = document.createElement('span');
    this.counter.classList.add('timer__counter');
    this.counter.innerHTML = this.seconds;
    timer.appendChild(this.counter);
    this.timer = timer;

    switch (this.howToRender) {
      case 'replace':
        elem.parentNode.replaceChild(timer, elem);
        break;
      case 'prepend':
        elem.prepend(timer);
        break;
      default:
    }
  }

  start() {
    this.interval = setInterval(() => {
      this.counter.innerHTML = +this.counter.innerHTML + 1;
    }, 1000);
  }

  stop() {
    clearInterval(this.interval);

    this.timer.remove();
  }
}

export default Timer;
