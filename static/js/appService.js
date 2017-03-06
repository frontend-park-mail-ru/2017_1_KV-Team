/**
 * Created by andreivinogradov on 06.03.17.
 */
const HTTP = require('../modules/http.js');

class AppService {
  constructor() {
    this.http = new HTTP();
  }
  getLeaders(callback) {
    this.http.get('/leaders', null, (resp) => {
      callback(resp);
      console.log(resp);
    });
  }
  isLoggedIn(callback) {
    this.http.get('/api/isloggedin', null, (resp) => {
      callback(resp);
      console.log(resp);
    });
  }
  login(login, pass, callback) {
    const body = { login, pass };
    this.http.post('/api/login', body, (resp) => {
      callback(resp);
      console.log(resp);
    });
  }
  logout(callback) {
    this.http.get('/api/logout', null, (resp) => {
      callback(resp);
      console.log(resp);
    });
  }
  register(login, email, pass, callback) {
    const body = { login, email, pass };
    this.http.post('/api/account', body, (resp) => {
      callback(resp);
      console.log(resp);
    });
  }
  getAccount(username, callback) {
    this.http.get('/api/account/', { username }, (resp) => {
      callback(resp);
      console.log(resp);
    });
  }
  editAccount(newEmail, newPass, callback) {
    const body = { newEmail, newPass };
    this.http.put('/api/account', body, (resp) => {
      callback(resp);
      console.log(resp);
    });
  }
}

module.exports = AppService;
