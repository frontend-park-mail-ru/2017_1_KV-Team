/**
 * Created by andreivinogradov on 06.03.17.
 */

const protocol = 'http';
const hostname = 'localhost';
const portNumber = '8082';

class HTTP {
  constructor() {
    if (HTTP.__instance) {
      return HTTP.__instance;
    }

    this._headers = {};
    this._baseUrl = `${protocol}://${hostname}:${portNumber}`;

    HTTP.__instance = this;
  }

  get Headers() {
    return this._headers;
  }

  set Headers(value) {
    if (!(value && ('' + value === '[object Object]'))) {
      throw new TypeError('Headers must be a plain object');
    }
    const valid = Object.keys(value).every(key => typeof value[key] === 'string');
    if (!valid) {
      throw new TypeError('Headers must be a plain object');
    }
    this._headers = value;
  }

  get BaseURL() {
    return this._baseUrl;
  }

  set BaseURL(value) {
    this._baseUrl = value;
  }

  get(address, query = null, callback = null) {
    let url = `${this._baseUrl}${address}`;
    if (query) {
      url += Object.keys(query)
        .map(name => encodeURIComponent(`${name}=${query[name]}`))
        .join('&');
    }
    fetch(url, {
      method: 'GET',
      credentials: 'include',
      mode: 'cors',
      headers: this._headers,
    })
      .then(callback);
  }

  post(address, body = null, callback = null) {
    let url = `${this._baseUrl}${address}`;
    console.log(url);
    fetch(url, {
      method: 'post',
      headers: Object.assign({ 'Content-type': 'application/json; charset=utf-8'}, this._headers),
      mode: 'cors',
      credentials: 'include',
      body: JSON.stringify(body) || null,
    })
      .then(callback);
  }

  put(address, body = null, callback = null) {
    let url = `${this._baseUrl}${address}`;
    fetch(url, {
      method: 'put',
      headers: Object.assign({ 'Content-type': 'application/json; charset=utf-8' }, this._headers),
      mode: 'cors',
      credentials: 'include',
      body: JSON.stringify(body) || null,
    })
      .then(callback);
  }

  delete(address, body = null, callback = null) {
    let url = `${this._baseUrl}${address}`;
    fetch(url, {
      method: 'delete',
      headers: Object.assign({ 'Content-type': 'application/json; charset=utf-8' }, this._headers),
      mode: 'cors',
      credentials: 'include',
      body: JSON.stringify(body) || null,
    })
      .then(callback);
  }
}

module.exports = HTTP;
