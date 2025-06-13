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
    const modalTitle = document.getElementById('modalTitle');
    const imagePreview = document.createElement('img');
    const imageNameInput = document.getElementById('imageName');
    const categorySelect = document.getElementById('category');

    imagePreview.style.display = 'none';
    uploadWrapper.appendChild(imagePreview);

    document.addEventListener('categoriesLoaded', () => {
        const categorySelect = document.getElementById("category");
        window.category.forEach(category => {
            const option = document.createElement("option");
            option.value = category[1];
            option.textContent = category[0];
            categorySelect.appendChild(option);
        });
    });
    

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
        const jwtToken = localStorage.getItem('jwtToken');
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

    function uploadWork() {
        const imageFile = uploadImageInput.files[0];
        const imageName = imageNameInput.value;
        const categoryId = categorySelect.value;
    
        const formData = new FormData();
        formData.append('image', imageFile);
        formData.append('title', imageName);
        formData.append('category', categoryId);
    
        const jwtToken = localStorage.getItem('jwtToken');
    
        fetch('http://localhost:5678/api/works', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${jwtToken}`
            },
            body: formData
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erreur lors de l\'upload de l\'image.');
            }
            return response.json();
        })
        .then(data => {
            console.log('Work uploaded successfully:', data);
            window.worksData.push(data);
            updateMainGallery();
        })
        .catch(error => {
            console.error('Erreur:', error);
        });
    }
    

    function IsFormRdyToSubmit() {
        const imageFile = uploadImageInput.files[0];
        const imageName = imageNameInput.value.trim();
        const category = categorySelect.value;


        if (imageFile && imageName !== '' && category !== '') {
            uploadButton.disabled = false;
            uploadButton.style.backgroundColor = '#1D6154';
            return true;
        } else {
            uploadButton.disabled = true;
            uploadButton.style.backgroundColor = '#A7A7A7';
            return false;
        }
    }

    function SubmitForm() {
        uploadWork();
        uploadImageInput.value = '';
        imageNameInput.value = '';
        categorySelect.value = '';
        imagePreview.src = null;
        imagePreview.style.display = 'none';
        uploadWrapper.querySelector('#imageIcon').style.display = '';
        uploadWrapper.querySelector('label').style.display = '';
        uploadWrapper.querySelector('p').style.display = '';
        
        uploadButton.textContent = 'Ajouter une photo';
        uploadForm.style.display = 'none';
        modalGallery.style.display = 'flex';
        backButton.style.display = 'none';
    }

    imageNameInput.addEventListener('input', IsFormRdyToSubmit);
    categorySelect.addEventListener('change', IsFormRdyToSubmit);

    uploadButton.addEventListener('click', () => {
        if (IsFormRdyToSubmit()) {
            SubmitForm();
            modal.style.display = 'none';
        }
        modalTitle.textContent = 'Ajout photo';
        uploadButton.textContent = 'Valider';
        modalGallery.style.display = 'none';
        uploadForm.style.display = 'flex';
        backButton.style.display = 'block';
    });

    backButton.addEventListener('click', () => {
        uploadButton.textContent = 'Ajouter une photo';
        uploadForm.style.display = 'none';
        modalGallery.style.display = 'flex';
        backButton.style.display = 'none';
        modalTitle.textContent = 'Galerie photo';
        uploadButton.disabled = false;
        uploadButton.style.backgroundColor = '#1D6154';
    });
});
