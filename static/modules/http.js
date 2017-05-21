/**
 * Created by andreivinogradov on 06.03.17.
 */

import urls from '../application/backendUrls';

export default class HTTP {
  constructor() {
    if (HTTP.instance) {
      return HTTP.instance;
    }

    this.headers = {};

    this.options = {
      method: 'GET',
      credentials: 'include',
      mode: 'cors',
      headers: this.headers,
    };

    this.postOptions = Object.assign({},
      this.options,
      {
        method: 'post',
        headers: Object.assign({ 'Content-type': 'application/json; charset=utf-8' }, this.headers),
      });
    this.baseUrl = `${urls.httpUrl}`;
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
    return fetch(url, this.options)
      .then(resp => resp.json());
  }

  post(address, body = null) {
    const url = `${this.baseUrl}${address}`;
    const opt = Object.assign({}, this.postOptions, { body: JSON.stringify(body) || null });
    return fetch(url, opt)
      .then(resp => resp.json());
  }

  put(address, body = null) {
    const url = `${this.baseUrl}${address}`;
    const opt = Object.assign({},
      this.postOptions,
      {
        body: JSON.stringify(body) || null,
        method: 'put',
      });
    return fetch(url, opt)
      .then(resp => resp.json());
  }
}

