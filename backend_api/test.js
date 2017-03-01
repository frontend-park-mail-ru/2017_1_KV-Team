/**
 * Created by maxim on 23.02.17.
 */
"use strict";

const backend = require('./backendAPI');

const f = (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    res.on('data', function (text) {
        console.log(text);
    });
};

//backend.register('some_nickname5', '1', '2', f);
//backend.login('some_nickname5', '1234', f);
backend.isLoggedIn('some_nickname5', 'aeee8ffe-0b42-4880-a68d-6b7ed2c5d23b', f);
//backend.getAccount('some_nickname5', f);
//backend.editAccount('some_nickname5', '688f1fc6-c21b-4c03-9fb3-ec52493dda77', 'n mail', '1234', f);
//backend.logout('some_nickname5', '688f1fc6-c21b-4c03-9fb3-ec52493dda77', f);