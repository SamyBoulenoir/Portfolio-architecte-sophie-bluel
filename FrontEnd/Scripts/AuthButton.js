function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

function deleteCookie(name) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

function updateAuthButton() {
    const jwtToken = getCookie('jwtToken');
    const authButton = document.getElementById('authButton');

    if (jwtToken) {
        authButton.textContent = 'Logout';
        authButton.onclick = handleLogout;
    } else {
        authButton.textContent = 'Login';
        authButton.onclick = handleLogin;
    }
}

function handleLogin() {
    window.location.href = './login.html';
}

function handleLogout() {
    deleteCookie('jwtToken');

    localStorage.clear();

    window.location.reload();
}

document.addEventListener('DOMContentLoaded', updateAuthButton);
