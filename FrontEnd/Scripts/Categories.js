document.addEventListener('DOMContentLoaded', () => {
    const gallery = document.querySelector('.gallery');
    const categoryContainer = document.querySelector('.button');

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
});
