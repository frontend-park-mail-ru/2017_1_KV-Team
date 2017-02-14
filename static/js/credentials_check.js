/**
 * Created by maxim on 14.02.17.
 */


'use strict';
const nameInput = document.getElementById('name');
const passwordInput = document.getElementById('password');
const errorLabel = document.getElementById('error');
const button = document.getElementById('okButton');

button.onclick = function(){
    const name = nameInput.value;
    const password = passwordInput.value;

    if( name === 'admin'
        && password === '1234') {
        errorLabel.textContent = '';
        location.href = "menu";
    }else{
        errorLabel.textContent = 'Неверный логин/пароль';
    }
};