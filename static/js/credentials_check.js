/**
 * Created by maxim on 14.02.17.
 */

'use strict';
const nameInput = document.getElementById('name');
const passwordInput = document.getElementById('password');
const errorLabel = document.getElementById('error');
const button = document.getElementById('register-btn');

button.onclick = e => {
    e.preventDefault();

    location.href = "register";
};