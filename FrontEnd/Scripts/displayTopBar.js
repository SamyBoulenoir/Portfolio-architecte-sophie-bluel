document.addEventListener('DOMContentLoaded', () => {
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }

    const jwtToken = getCookie('jwtToken');
    const topBar = document.getElementById('topBar');
    console.log("j'y suis");

    if (jwtToken) {
        topBar.style.display = 'block';
    } else {
        topBar.style.display = 'none';
    }
});
