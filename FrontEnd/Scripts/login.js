document.getElementById("loginForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (!email || !password) {
        alert("Veuillez remplir tous les champs.");
        return;
    }

    try {
        const response = await fetch('http://localhost:5678/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: email, password: password })
        });

        if (!response.ok) {
            throw new Error("Erreur lors de la connexion.");
        }

        const data = await response.json();
        console.log(data);

        if (data.token) {
            alert("Connexion réussie !");
            localStorage.setItem('jwtToken', data.token);
            window.location.href = './index.html';
        } else {
            alert("Échec de la connexion, veuillez vérifier vos informations.");
        }

    } catch (error) {
        console.error("Erreur:", error);
        alert("Une erreur est survenue, veuillez réessayer.");
    }
});
