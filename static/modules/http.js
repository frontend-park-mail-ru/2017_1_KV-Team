/**
 * Created by andreivinogradov on 06.03.17.
 */

const protocol = 'http';
const hostname = 'localhost';
const portNumber = '8082';

class HTTP {
  constructor() {
    if (HTTP.instance) {
      return HTTP.instance;
    }

    this.headers = {};
    this.baseUrl = `${protocol}://${hostname}:${portNumber}`;

    HTTP.instance = this;
  }

  get Headers() {
    return this.headers;
  }

  set Headers(value) {
    if (!(value && (value.toString() === '[object Object]'))) {
      throw new TypeError('Headers must be a plain object');
    }
    const valid = Object.keys(value).every(key => typeof value[key] === 'string');
    if (!valid) {
      throw new TypeError('Headers must be a plain object');
    }
    this.headers = value;
  }

  get BaseURL() {
    return this.baseUrl;
  }

  set BaseURL(value) {
    this.baseUrl = value;
  }

  get(address, query = null) {
    let url = `${this.baseUrl}${address}`;
    if (query) {
      url += Object.keys(query)
        .map(name => encodeURIComponent(`${name}=${query[name]}`))
        .join('&');
    }
    return fetch(url, {
      method: 'GET',
      credentials: 'include',
      mode: 'cors',
      headers: this.headers,
    })
      .then(resp => resp.json());
  }

  post(address, body = null) {
    const url = `${this.baseUrl}${address}`;
    return fetch(url, {
      method: 'post',
      headers: Object.assign({ 'Content-type': 'application/json; charset=utf-8' }, this.headers),
      mode: 'cors',
      credentials: 'include',
      body: JSON.stringify(body) || null,
    })
      .then(resp => resp.json());
  }

  put(address, body = null) {
    const url = `${this.baseUrl}${address}`;
    return fetch(url, {
      method: 'put',
      headers: Object.assign({ 'Content-type': 'application/json; charset=utf-8' }, this.headers),
      mode: 'cors',
      credentials: 'include',
      body: JSON.stringify(body) || null,
    })
      .then(resp => resp.json());
  }

  delete(address, body = null) {
    const url = `${this.baseUrl}${address}`;
    return fetch(url, {
      method: 'delete',
      headers: Object.assign({ 'Content-type': 'application/json; charset=utf-8' }, this.headers),
      mode: 'cors',
      credentials: 'include',
      body: JSON.stringify(body) || null,
    })
      .then(resp => resp.json());
  }
}

module.exports = HTTP;
