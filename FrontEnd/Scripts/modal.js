document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('imageModal');
    const modalGallery = document.querySelector('.modal-gallery');
    const modalContent = document.querySelector('.modal-content');
    const closeModal = document.querySelector('.close');
    const openModalButton = document.getElementById('openModal');
    const uploadButton = document.getElementById('uploadButton');
    const uploadForm = document.querySelector('.upload-form');
    const backButton = document.getElementById('backButton');
    const uploadWrapper = document.querySelector('.upload-wrapper');
    const uploadImageInput = document.getElementById('uploadImage');
    const imageIcon = document.getElementById('imageIcon');
    const modalTitle = document.getElementById('modalTitle');

    const imagePreview = document.createElement('img');
    imagePreview.style.display = 'none';
    uploadWrapper.appendChild(imagePreview);

    uploadImageInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                imagePreview.src = e.target.result;
                imagePreview.style.display = 'block';
                imagePreview.style.width = '129px';
                imagePreview.style.height = '193px';
                uploadWrapper.querySelector('#imageIcon').style.display = 'none';
                uploadWrapper.querySelector('label').style.display = 'none';
                uploadWrapper.querySelector('p').style.display = 'none';
            };
            reader.readAsDataURL(file);
        }
    });

    openModalButton.addEventListener('click', () => {
        modalGallery.innerHTML = '';
        window.worksData.forEach(work => { 
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
                window.worksData = window.worksData.filter(work => work.id !== workId);
                imgContainer.remove();
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
        gallery.innerHTML = '';
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

    uploadForm.style.width = '100%';
    uploadForm.style.flexDirection = 'column';
    uploadForm.style.alignItems = 'center';

    uploadButton.addEventListener('click', () => {
        modalTitle.textContent = 'Ajout photo'
        uploadButton.style.display = 'none';
        modalGallery.style.display = 'none';
        uploadForm.style.display = 'flex';
        backButton.style.display = 'block';
    });

    backButton.addEventListener('click', () => {
        uploadButton.style.display = '';
        uploadForm.style.display = 'none';
        modalGallery.style.display = 'flex';
        backButton.style.display = 'none';
        modalTitle.textContent = 'Galerie photo';
    });

    document.getElementById('submitUpload').addEventListener('click', () => {
        const imageFile = document.getElementById('uploadImage').files[0];
        const imageName = document.getElementById('imageName').value;
        const category = document.getElementById('category').value;
        console.log('Image uploadée :', { imageFile, imageName, category });
        uploadForm.style.display = 'none';
        modalGallery.style.display = 'flex';
        backButton.style.display = 'none';
        uploadButton.style.display = '';
    });
});
