document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('imageModal');
    const modalGallery = document.querySelector('.modal-gallery');
    const closeModal = document.querySelector('.close');
    const openModalButton = document.getElementById('openModal');

    openModalButton.addEventListener('click', () => {
        modalGallery.innerHTML = '';
        window.worksData.forEach(work => { // Utilisation de worksData global
            createImageElement(work, modalGallery);
        });
        modal.style.display = 'flex';
        modal.style.justifyContent = 'center';
        modal.style.alignItems = 'center';
    });

    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    function createImageElement(work, container) {
        const imgContainer = document.createElement('div');
        imgContainer.classList.add('img-container');

        const img = document.createElement('img');
        img.classList.add('modal-gallery-img');
        img.src = work.imageUrl;
        img.alt = work.title;

        const deleteButton = document.createElement('img');
        deleteButton.src = './assets/icons/delete-btn.png';
        deleteButton.alt = 'Supprimer';
        deleteButton.width = '14px';
        deleteButton.height = '14px';
        deleteButton.classList.add('delete-button');

        deleteButton.addEventListener('click', () => {
            deleteWork(work.id, imgContainer);
        });

        imgContainer.appendChild(img);
        imgContainer.appendChild(deleteButton);
        container.appendChild(imgContainer);
    }

    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }

    function deleteWork(workId, imgContainer) {
        const jwtToken = getCookie('jwtToken');
        fetch(`http://localhost:5678/api/works/${workId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtToken}`
            },
        })
        .then(response => {
            if (response.ok) {
                // Mise à jour de worksData pour retirer l'élément supprimé
                window.worksData = window.worksData.filter(work => work.id !== workId);

                // Suppression de l'image dans la modale sans rechargement
                imgContainer.remove();

                // Mise à jour de la galerie principale
                updateMainGallery();
            } else {
                console.error('Erreur lors de la suppression de l\'image');
            }
        })
        .catch(error => {
            console.error('Erreur lors de la suppression de l\'image:', error);
        });
    }

    function updateMainGallery() {
        const gallery = document.querySelector('.gallery');
        gallery.innerHTML = ''; // Vider la galerie principale
        window.worksData.forEach(work => {
            const figure = document.createElement('figure');
            const img = document.createElement('img');
            const figcaption = document.createElement('figcaption');

            img.src = work.imageUrl;
            img.alt = work.title;
            figcaption.textContent = work.title;

            figure.appendChild(img);
            figure.appendChild(figcaption);

            gallery.appendChild(figure);
        });
    }
});
