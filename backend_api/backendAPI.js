/**
 * Created by maxim on 23.02.17.
 */
"use strict";

const http = require('http');

// An object of options to indicate where to post to
const post_options = {
    host: 'localhost',
    port: '8082',
    path: undefined,
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': undefined
    }
};

const sendRequest = (post_options, post_data) => {
    const post_req = http.request(
        post_options,
        function(res) {
            res.setEncoding('utf8');
            console.log(`STATUS: ${res.statusCode}`);
            res.on('data', function (text) {
                console.log(text);
            });
        });

    post_req.write(post_data);
    post_req.end();
};

// Результатом запроса от бекенда будет:
// Коды:
//      200 - зареган успешно
//      409 - такой никнейм есть
//      403 - маловероятный кейс(зареган, но не залогинился)
// Формат ответа при 200 коде:
//      {"nickname" : ..., "sessionID": ...}
const register = (username, email, password) => {
    const post_data = JSON.stringify({
        'username': username,
        'email': email,
        'password': password
    });

    post_options.path = '/api/register';
    post_options.headers['Content-Length'] = Buffer.byteLength(post_data);

    sendRequest(post_options, post_data);
};

// Результатом запроса от бекенда будет:
// Коды:
//      200 - логин успешен
//      403 - доступ запрещен
// Формат ответа при 200 коде:
//      {"nickname" : ..., "sessionID": ...}
const login = (username, password) => {
    const post_data = JSON.stringify({
        'username': username,
        'password': password
    });

    post_options.path = '/api/login';
    post_options.headers['Content-Length'] = Buffer.byteLength(post_data);

    sendRequest(post_options, post_data);
};

// Результатом запроса от бекенда будет:
// Коды:
//      200 - гарантировано, что по указанным данным не будет залогиненного пользователя
const logout = (username, sessionID) => {
    const post_data = JSON.stringify({
        'username': username,
        'sessionID': sessionID
    });

    post_options.path = '/api/logout';
    post_options.headers['Content-Length'] = Buffer.byteLength(post_data);

    sendRequest(post_options, post_data);
};

// Результатом запроса от бекенда будет:
// Коды:
//      200 - сессия существует
//      403 - нет юзера или сессия не существуют
// Формат ответа при 200 коде:
//      {"nickname" : ..., "email": ...}
const isLoggedIn = (username, sessionID) => {
    const post_data = JSON.stringify({
        'username': username,
        'sessionID': sessionID
    });

    post_options.path = '/api/isloggedin';
    post_options.headers['Content-Length'] = Buffer.byteLength(post_data);

    sendRequest(post_options, post_data);

};

// Результатом запроса от бекенда будет:
// Коды:
//      200 - данные изменены
//      403 - запрещено менять данные(сессия не сошлась)
const editAccount = (username, sessionID, newEmail, newPassword) => {
    const post_data = JSON.stringify({
        'username': username,
        'sessionID': sessionID,
        'email': newEmail,
        'password': newPassword
    });

    post_options.path = '/api/editaccount';
    post_options.headers['Content-Length'] = Buffer.byteLength(post_data);

    sendRequest(post_options, post_data);

};

module.exports = { register, login, logout, isLoggedIn, editAccount };