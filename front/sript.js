// Obtener referencias a los elementos del DOM
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const pendingList = document.getElementById('pendingList');
const completedList = document.getElementById('completedList');

// Almacenamiento local
const STORAGE_KEY = 'taskmaster_tasks';

// Variables globales
const API_URL = 'http://localhost:5000/api';

// Funciones de autenticación
async function loginUser(userData) {
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        const data = await response.json();
        if (response.ok) {
            token = data.token;
            localStorage.setItem('token', token);
            showMainApp();
            loadTasks();
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        showNotification(error.message, 'error');
    }
}

async function registerUser(userData) {
    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        const data = await response.json();
        if (response.ok) {
            token = data.token;
            localStorage.setItem('token', token);
            showMainApp();
            loadTasks();
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        showNotification(error.message, 'error');
    }
}

// Event Listeners para autenticación
document.getElementById('authForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const userData = {
        email: document.getElementById('email').value,
        password: document.getElementById('password').value
    };
    await loginUser(userData);
});

document.getElementById('registerBtn').addEventListener('click', async (e) => {
    e.preventDefault();
    const userData = {
        email: document.getElementById('email').value,
        password: document.getElementById('password').value
    };
    await registerUser(userData);
});

// Función para verificar el token
function checkAuth() {
    const token = localStorage.getItem('token');
    const authContainer = document.getElementById('authContainer');
    const mainContainer = document.getElementById('mainContainer');

    if (!token) {
        authContainer.style.display = 'flex';
        mainContainer.style.display = 'none';
        return false;
    }
    return true;
}

// Inicialización al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    if (checkAuth()) {
        showMainApp();
        loadTasks();
    }
});

// Función para mostrar la aplicación principal
function showMainApp() {
    const authContainer = document.getElementById('authContainer');
    const mainContainer = document.getElementById('mainContainer');
    authContainer.style.display = 'none';
    mainContainer.style.display = 'block';
}

// Función para cargar tareas del usuario actual
async function loadTasks() {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No hay token');
        }

        const response = await fetch(`${API_URL}/tasks`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Error al cargar tareas');
        }

        const tasks = await response.json();
        pendingList.innerHTML = '';
        completedList.innerHTML = '';

        tasks.forEach(task => {
            const taskElement = createTaskElement(task.title, task.completed, task._id);
            if (task.completed) {
                completedList.appendChild(taskElement);
            } else {
                pendingList.appendChild(taskElement);
            }
        });

        updateTaskStats();
    } catch (error) {
        console.error('Error:', error);
        showNotification('Error al cargar tareas', 'error');
    }
}

// Función para crear nueva tarea
async function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText !== '') {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/tasks`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ title: taskText })
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Error al crear tarea');
            }

            const newTaskItem = createTaskElement(data.task.title, data.task.completed, data.task._id);
            pendingList.appendChild(newTaskItem);
            taskInput.value = '';
            updateTaskStats();
            showNotification('Tarea creada con éxito');
        } catch (error) {
            console.error('Error:', error);
            showNotification(error.message, 'error');
        }
    }
}

// Función para crear elemento de tarea
function createTaskElement(text, completed, taskId) {
    const li = document.createElement('li');
    li.dataset.id = taskId;
    li.innerHTML = `
        <input type="checkbox" ${completed ? 'checked' : ''}>
        <span class="${completed ? 'completed' : ''}">${text}</span>
        <button class="delete-btn">
            <i class="fas fa-trash"></i>
        </button>
    `;

    const checkbox = li.querySelector('input[type="checkbox"]');
    checkbox.addEventListener('change', async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/tasks/${taskId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ completed: checkbox.checked })
            });

            if (!response.ok) {
                throw new Error('Error al actualizar tarea');
            }

            li.querySelector('span').classList.toggle('completed');
            const targetList = checkbox.checked ? completedList : pendingList;
            targetList.appendChild(li);
            updateTaskStats();
        } catch (error) {
            console.error('Error:', error);
            showNotification('Error al actualizar tarea', 'error');
            checkbox.checked = !checkbox.checked;
        }
    });

    return li;
}

// Función para actualizar estadísticas
function updateTaskStats() {
    const totalTasks = document.querySelectorAll('.task-list li').length;
    const completedTasks = document.querySelectorAll('.completed-list li').length;
    const pendingTasks = totalTasks - completedTasks;

    document.getElementById('totalTasks').textContent = `Total: ${totalTasks}`;
    document.getElementById('completedTasks').textContent = `Completadas: ${completedTasks}`;
    document.getElementById('pendingTasks').textContent = `Pendientes: ${pendingTasks}`;
}

// Función para eliminar una tarea
function deleteTask() {
    const listItem = this.parentNode;
    const list = listItem.parentNode;
    list.removeChild(listItem);
}

// Función para mostrar notificaciones
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    const container = document.querySelector('.notifications-container');
    container.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Función de logout
function logout() {
    localStorage.removeItem('token');
    document.getElementById('authContainer').style.display = 'flex';
    document.getElementById('mainContainer').style.display = 'none';
    // Limpiar las listas de tareas
    document.getElementById('pendingList').innerHTML = '';
    document.getElementById('completedList').innerHTML = '';
}

// Agregar event listener para el botón de logout
document.getElementById('logoutBtn').addEventListener('click', logout);