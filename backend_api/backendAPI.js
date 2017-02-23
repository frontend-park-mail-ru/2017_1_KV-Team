/**
 * Created by maxim on 23.02.17.
 */
"use strict";

const http = require('http');

// An object of options to indicate where to post to
const post_options = {
    host: 'localhost',
    port: '8080',
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
//      401 - маловероятный кейс(зареган, но не залогинился)
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
//      200 - зареган успешно
//      401 - парольчик не подошел
//      404 - нет такого юзера
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
//      401 - нет юзера или сессия не существуют
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

module.exports = { register, login, logout, isLoggedIn };