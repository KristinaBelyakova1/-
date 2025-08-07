let users = [];
let currentPage = 1;
const usersPerPage = 10;

// Основные функции
async function loadUsers() {
    try {
        const response = await fetch('https://dummyjson.com/users');
        const data = await response.json();
        users = data.users;
        displayUsers();
        setupPagination();
    } catch (error) {
        console.error('Ошибка:', error);
        alert('Не удалось загрузить данные');
    }
}

function displayUsers() {
    const tbody = document.getElementById('usersBody');
    tbody.innerHTML = '';
    
    const start = (currentPage - 1) * usersPerPage;
    users.slice(start, start + usersPerPage).forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.firstName}</td>
            <td>${user.lastName}</td>
            <td>${user.email}</td>
            <td>${user.phone}</td>
        `;
        row.addEventListener('click', () => showUserPosts(user));
        tbody.appendChild(row);
    });
}

function setupPagination() {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';
    
    const pageCount = Math.ceil(users.length / usersPerPage);
    
    // Кнопки пагинации
    const prevBtn = createPaginationButton('Назад', currentPage > 1, () => {
        currentPage--;
        updateView();
    });
    pagination.appendChild(prevBtn);
    
    for (let i = 1; i <= pageCount; i++) {
        const btn = createPaginationButton(i, true, () => {
            currentPage = i;
            updateView();
        });
        if (i === currentPage) btn.classList.add('active');
        pagination.appendChild(btn);
    }
    
    const nextBtn = createPaginationButton('Вперед', currentPage < pageCount, () => {
        currentPage++;
        updateView();
    });
    pagination.appendChild(nextBtn);
}

function createPaginationButton(text, enabled, onClick) {
    const btn = document.createElement('button');
    btn.textContent = text;
    btn.disabled = !enabled;
    btn.addEventListener('click', onClick);
    return btn;
}

function updateView() {
    displayUsers();
    setupPagination();
}

// Работа с постами
async function showUserPosts(user) {
    try {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebarOverlay');
        const postsContainer = document.getElementById('postsContainer');
        
        document.getElementById('sidebarTitle').textContent = `Посты пользователя ${user.firstName} ${user.lastName}`;
        postsContainer.innerHTML = '<p>Загрузка...</p>';
        
        sidebar.style.display = 'flex';
        overlay.style.display = 'block';
        
        const response = await fetch(`https://dummyjson.com/users/${user.id}/posts`);
        const data = await response.json();
        
        postsContainer.innerHTML = data.posts?.length ? 
            data.posts.map(post => `
                <div class="post">
                    <h3>${post.title}</h3>
                    <p>${post.body}</p>
                </div>
            `).join('') : '<p>Нет постов</p>';
    } catch (error) {
        console.error('Ошибка:', error);
        document.getElementById('postsContainer').innerHTML = '<p>Ошибка загрузки</p>';
    }
}

function closeSidebar() {
    document.getElementById('sidebar').style.display = 'none';
    document.getElementById('sidebarOverlay').style.display = 'none';
}

// Сортировка
function sortUsers(field) {
    users.sort((a, b) => a[field] > b[field] ? 1 : -1);
    updateView();
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    loadUsers();
    
    document.getElementById('closeSidebar').addEventListener('click', closeSidebar);
    document.getElementById('sidebarOverlay').addEventListener('click', closeSidebar);
    
    document.querySelectorAll('th[data-sort]').forEach(th => {
        th.addEventListener('click', () => sortUsers(th.dataset.sort));
    });
});