/**
 * Created by andreivinogradov on 31.03.17.
 */
import { loginForm, registrationForm, gameOptionsForm, chatForm } from './forms';

const formActions = app => ({
  loginHandler(form = loginForm) {
    const { name, pass } = form.getFormData();
    return app.login(name, pass);
  },

  registrationHandler(form = registrationForm) {
    const { name, email, pass } = form.getFormData();
    return app.register(name, pass, email);
  },

  qStarter(form = gameOptionsForm) {
    const { attack, defend } = form.getFormData();
    console.log(attack, defend);
    return Promise.resolve();
  },

  sendMessage(form = chatForm) {
    const data = form.getFormData();
    app.game.chat.sendMessage(data.message);
    return Promise.resolve();
  },
});

export default formActions;
