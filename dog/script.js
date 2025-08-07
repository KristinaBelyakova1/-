const gallery = document.getElementById('gallery');
const modal = document.getElementById('modal');
const modalImage = document.getElementById('modalImage');
const caption = document.getElementById('caption');
const downloadLink = document.getElementById('downloadLink');
const closeBtn = document.getElementById('close');

let images = [];
let intervalId;

// Функция для получения изображения с API
async function fetchDogImage() {
    const response = await fetch('https://dog.ceo/api/breeds/image/random');
    const data = await response.json();
    return data.message;
}

// Функция для добавления изображения в галерею
async function addImage() {
    const imageUrl = await fetchDogImage();
    
    if (images.length >= 20) { // Лимит на количество изображений
        images.shift(); // Удаляем старое изображение
        gallery.removeChild(gallery.firstChild); // Удаляем первое изображение из DOM
    }

    images.push(imageUrl);
    
    const imgElement = document.createElement('img');
    imgElement.src = imageUrl;
    imgElement.alt = 'Собака';
    
    imgElement.onclick = () => openModal(imageUrl);
    
    gallery.appendChild(imgElement);
}

// Функция для открытия модального окна
function openModal(imageUrl) {
    modal.style.display = 'block';
    modalImage.src = imageUrl;
    caption.innerHTML = "Собака";
    
    // Устанавливаем ссылку для скачивания и добавляем атрибут download
        downloadLink.onclick = () => {
        downloadLink.href = imageUrl; 
        downloadLink.setAttribute('download', 'dog_image.jpg');
    };
    

}

// Функция для закрытия модального окна
closeBtn.onclick = () => {
    modal.style.display = 'none';
};

// Запуск добавления изображений каждые 3 секунды
intervalId = setInterval(addImage, 3000);

// Приостановка обновления при открытии модального окна
modal.onclick = () => {
    modal.style.display = 'none';
};

// Начальное добавление изображений
for (let i = 0; i < 12; i++) { // Начальное заполнение галереи
    addImage();
}
