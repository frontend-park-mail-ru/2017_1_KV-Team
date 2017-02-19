/**
 * Created by andreivinogradov on 17.02.17.
 */

const button = document.getElementById('login-btn');

button.onclick = e => {
    e.preventDefault();

    location.href = "login";
};