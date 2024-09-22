document.addEventListener('DOMContentLoaded', () => {
    const gallery = document.querySelector('.gallery');
    const categoryContainer = document.querySelector('.button');
    const modal = document.getElementById('imageModal');
    const modalGallery = document.querySelector('.modal-gallery');
    const closeModal = document.querySelector('.close');
    const openModalButton = document.getElementById('openModal');

    let worksData = [];

    fetch('http://localhost:5678/api/categories/')
        .then(response => response.json())
        .then(categories => {
            const allButton = document.createElement('button');
            allButton.textContent = 'Tous';
            allButton.classList.add('active');
            allButton.addEventListener('click', () => {
                displayWorks(worksData);
                setActiveButton(allButton);
            });
            categoryContainer.appendChild(allButton);

            categories.forEach(category => {
                const button = document.createElement('button');
                button.textContent = category.name;
                button.addEventListener('click', () => {
                    filterByCategory(category.id);
                    setActiveButton(button);
                });
                categoryContainer.appendChild(button);
            });
        })
        .catch(error => {
            console.error('Erreur lors du fetch des catégories:', error);
        });

    fetch('http://localhost:5678/api/works')
        .then(response => response.json())
        .then(data => {
            console.log(data);
            worksData = data;
            displayWorks(worksData);
        })
        .catch(error => {
            console.error('Erreur lors du fetch des projets:', error);
        });

    function filterByCategory(categoryId) {
        const filteredWorks = worksData.filter(work => work.categoryId === categoryId);
        displayWorks(filteredWorks);
    }

    function displayWorks(works) {
        gallery.innerHTML = '';
        works.forEach(work => {
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

    function setActiveButton(activeButton) {
        const buttons = document.querySelectorAll('.button button');
        buttons.forEach(button => button.classList.remove('active'));
        activeButton.classList.add('active');
    }

    openModalButton.addEventListener('click', () => {
        modalGallery.innerHTML = '';
        worksData.forEach(work => {
            const imgContainer = document.createElement('div');
            imgContainer.classList.add('img-container');

            const img = document.createElement('img');
            img.classList.add('modal-gallery-img');
            img.src = work.imageUrl;
            img.alt = work.title;


            // Bouton de suppression avec une image
            const deleteButton = document.createElement('img');
            deleteButton.src = './assets/icons/delete-btn.png';
            deleteButton.alt = 'Supprimer';
            deleteButton.width = '14px';
            deleteButton.height = '14px'
            deleteButton.classList.add('delete-button');

            // Ajout de l'événement de suppression
            deleteButton.addEventListener('click', () => {
                console.log(work);
                deleteWork(work.id, imgContainer);
            });

            imgContainer.appendChild(img);
            imgContainer.appendChild(deleteButton);
            modalGallery.appendChild(imgContainer);
        });
        modal.style.display = 'flex';
        modal.style.justifyContent = 'center';
        modal.style.alignItems = 'center';
    });

    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }
    

    function deleteWork(workId, imgContainer) {
        const jwtToken = getCookie('jwtToken');
        console.log(localStorage);
        fetch(`http://localhost:5678/api/works/${workId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtToken}`
            },
        })
        .then(response => {
            if (response.ok) {
                worksData = worksData.filter(work => work.id !== workId);
                imgContainer.remove();
                displayWorks(worksData);
            } else {
                console.error('Erreur lors de la suppression de l\'image');
            }
        })
        .catch(error => {
            console.error('Erreur lors de la suppression de l\'image:', error);
        });
    }
});
