/**
 * Created by maxim on 23.02.17.
 */
"use strict";

const protocol = 'http';
const hostname = 'localhost';
const portNumber = '8082';

// An object of options to indicate where to post to
const post_options = {
        protocol: protocol,
        host: hostname,
        port: portNumber,
        path: undefined,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    };

const put_options = {
    protocol: protocol,
    host: hostname,
    port: portNumber,
    path: undefined,
    method: 'PUT',
    headers: {
        'Content-Type': 'application/json'
    }
};

const get_options = {
    protocol: protocol,
    host: hostname,
    port: portNumber,
    path: undefined,
    method: 'GET',
    headers: {}
};

const sendRequest = (options, data, onResult) => {
    const xhr = new XMLHttpRequest();
    xhr.open(options.method, `${options.protocol}://${options.host}:${options.port}${options.path}`, true);

    Object.keys(options.headers).map(function (key, index) {
        xhr.setRequestHeader(key, options.headers[key]);
    });

    xhr.withCredentials = true;
    xhr.onload = () => onResult(xhr);

    if (data !== null && data.length !== 0) {
        xhr.send(data);
    } else {
        xhr.send();
    }
};

// Результатом запроса от бекенда будет:
// Коды:
//      200 - зареган успешно
//      409 - такой никнейм есть
//      403 - маловероятный кейс(зареган, но не залогинился)
// Формат ответа при 200 коде:
//      {"username" : ..., "sessionID": ...}
const register = (username, email, password, onResult) => {
    const post_data = JSON.stringify({
        'username': username,
        'email': email,
        'password': password
    });
    post_options.path = '/api/account';
    sendRequest(post_options, post_data, onResult);
};

// Результатом запроса от бекенда будет:
// Коды:
//      200 - логин успешен
//      403 - доступ запрещен
// Формат ответа при 200 коде:
//      {"username" : ..., "sessionID": ...}
const login = (username, password, onResult) => {
    const post_data = JSON.stringify({
        'username': username,
        'password': password,
    });

    post_options.path = '/api/login';
    sendRequest(post_options, post_data, onResult);
};

// Результатом запроса от бекенда будет:
// Коды:
//      200 - гарантировано, что по указанным данным не будет залогиненного пользователя
const logout = (onResult) => {
    get_options.path = '/api/logout';
    sendRequest(get_options, null, onResult);
};

// Результатом запроса от бекенда будет:
// Коды:
//      200 - сессия существует
//      403 - нет юзера или сессия не существуют
const isLoggedIn = (onResult) => {
    get_options.path = '/api/isloggedin';
    sendRequest(get_options, null, onResult);
};

// Результатом запроса от бекенда будет:
// Коды:
//      200 - данные изменены
//      403 - запрещено менять данные(сессия не сошлась)
const editAccount = (newEmail, newPassword, onResult) => {
    const data = JSON.stringify({
        'email': newEmail,
        'password': newPassword
    });

    put_options.path = '/api/account';
    put_options.headers['Content-Length'] = data.length;

    sendRequest(put_options, data, onResult);
};


// 200 - пользователь найден.
// 404 - пользователь не найден
// Формат ответа при 200 коде:
//      {"username" : ...}
const getAccount = (username, onResult) => {
    get_options.path = `/api/account/${username}`;
    sendRequest(get_options, null, onResult);
};

module.exports = { register, login, logout, isLoggedIn, editAccount, getAccount };
