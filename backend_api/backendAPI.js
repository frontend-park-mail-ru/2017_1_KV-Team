/**
 * Created by maxim on 23.02.17.
 */
"use strict";

const http = require('http');

const hostname = 'localhost';
const portNumber = '8082';

// An object of options to indicate where to post to
const post_options = {
    host: hostname,
    port: portNumber,
    path: undefined,
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': undefined
    }
};

const put_options = {
    host: hostname,
    port: portNumber,
    path: undefined,
    method: 'PUT',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': undefined
    }
};

const get_options = {
    host: hostname,
    port: portNumber,
    path: undefined,
    method: 'GET',
    headers: {
        'Content-Length': 0
    }
};

const sendRequest = (options, data, onResult) => {
    const req = http.request(
        options,
        function(res) {
            res.setEncoding('utf8');
            onResult(res);

        });

    if(data !== null){
        req.write(data);
    }
    req.end();
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
    post_options.headers['Content-Length'] = Buffer.byteLength(post_data);

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
        'password': password
    });

    post_options.path = '/api/login';
    post_options.headers['Content-Length'] = Buffer.byteLength(post_data);

    sendRequest(post_options, post_data, onResult);
};

// Результатом запроса от бекенда будет:
// Коды:
//      200 - гарантировано, что по указанным данным не будет залогиненного пользователя
const logout = (username, sessionID, onResult) => {
    const post_data = JSON.stringify({
        'username': username,
        'sessionID': sessionID
    });

    post_options.path = '/api/logout';
    post_options.headers['Content-Length'] = Buffer.byteLength(post_data);

    sendRequest(post_options, post_data, onResult);
};

// Результатом запроса от бекенда будет:
// Коды:
//      200 - сессия существует
//      403 - нет юзера или сессия не существуют
const isLoggedIn = (username, sessionID, onResult) => {
    const post_data = JSON.stringify({
        'username': username,
        'sessionID': sessionID
    });

    post_options.path = '/api/isloggedin';
    post_options.headers['Content-Length'] = Buffer.byteLength(post_data);

    sendRequest(post_options, post_data, onResult);

};

// Результатом запроса от бекенда будет:
// Коды:
//      200 - данные изменены
//      403 - запрещено менять данные(сессия не сошлась)
const editAccount = (username, sessionID, newEmail, newPassword, onResult) => {
    const data = JSON.stringify({
        'username': username,
        'sessionID': sessionID,
        'email': newEmail,
        'password': newPassword
    });

    put_options.path = '/api/account';
    put_options.headers['Content-Length'] = Buffer.byteLength(data);

    sendRequest(put_options, data, onResult);

};


// 200 - пользователь найден.
// 404 - пользователь не найден
// Формат ответа при 200 коде:
//      {"username" : ...}
const getAccount = (username, onResult) => {
    get_options.path = `/api/account?username=${username}`;
    sendRequest(get_options, null, onResult);
};

module.exports = { register, login, logout, isLoggedIn, editAccount, getAccount };