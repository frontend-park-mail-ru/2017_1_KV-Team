/**
 * Created by andreivinogradov on 28.03.17.
 */

// Отдаем в функцию объект приложения, для того чтобы линкер мог использовать его методы
const linker = app => (e) => {
  // const classList = e.target.classList;
  const link = e.target;

  // Проверяем нужно ли обрабатывать ссылку роутером
  if (!link.dataset.hot) {
    return;
  }

  e.preventDefault();

  const whatToDoBeforeRoute = [Promise.resolve()];

  if (link.dataset.act === 'logout') {
    whatToDoBeforeRoute.push(app.logOut());
  }

  if (link.dataset.act === 'start-singleplayer') {
    app.game.startSingle();
  }

  if (link.dataset.act === 'end-search') {
    app.enablePlayLink();
  } else if (link.dataset.act === 'game-start-options') {
    const gameStartOpt = document.querySelector('.start-game-options-container');
    e.target.parentNode.classList.toggle('navigation__item_active');
    link.classList.toggle('navigation__link_active');
    gameStartOpt.classList.toggle('start-game-options-container_visible');
  }

  Promise.all(whatToDoBeforeRoute)
    .then(() => {
      if (!e.target.href.endsWith('#')) {
        app.route(e.target.href);
      }
    }, console.log);
};

export default linker;
