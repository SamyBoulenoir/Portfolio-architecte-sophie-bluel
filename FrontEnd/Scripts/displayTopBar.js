document.addEventListener('DOMContentLoaded', () => {
    const jwtToken = localStorage.getItem('jwtToken');
    const topBar = document.getElementById('topBar');

    if (jwtToken) {
        topBar.style.display = 'block';
    } else {
        topBar.style.display = 'none';
    }
});
