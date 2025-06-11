function updateAuthButton() {
    const jwtToken = localStorage.getItem('jwtToken');
    const authButton = document.getElementById('authButton');
    const openModalButton = document.getElementById('openModal');


    if (jwtToken) {
        authButton.textContent = 'logout';
        authButton.onclick = handleLogout;
        openModalButton.style.display = 'flex';
    } else {
        authButton.textContent = 'login';
        authButton.onclick = handleLogin;
        openModalButton.style.display = 'none';

    }
}

function handleLogin() {
    window.location.href = './login.html';
}

function handleLogout() {
    localStorage.removeItem('jwtToken');

    localStorage.clear();

    window.location.reload();
}

document.addEventListener('DOMContentLoaded', updateAuthButton);
