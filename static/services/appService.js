/**
 * Created by andreivinogradov on 06.03.17.
 */
const HTTP = require('../modules/http.js');

class AppService {
  constructor() {
    this.http = new HTTP();
  }
  getLeaders() {
    return this.http.get('/api/leaders', null);
  }
  isLoggedIn() {
    return this.http.get('/api/isloggedin', null);
  }
  login(username, password) {
    const body = { username, password };
    return this.http.post('/api/login', body);
  }
  logout() {
    return this.http.get('/api/logout', null);
  }
  register(username, email, password) {
    const body = { username, email, password };
    return this.http.post('/api/account', body);
  }
  getAccount(username) {
    return this.http.get('/api/account/', { username });
  }
  editAccount(newEmail, newPass) {
    const body = { newEmail, newPass };
    return this.http.put('/api/account', body);
  }
}

module.exports = AppService;
