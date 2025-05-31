// Obtener referencias a los elementos del DOM
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const pendingList = document.getElementById('pendingList');

// Función para agregar una nueva tarea
function addTask() {
    const taskText = taskInput.value.trim();

    if (taskText !== '') {
        // Crear un nuevo elemento de lista (li)
        const newTaskItem = document.createElement('li');

        // Crear un checkbox para marcar como completada
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.addEventListener('change', toggleComplete);

        // Crear un span para el texto de la tarea
        const taskSpan = document.createElement('span');
        taskSpan.textContent = taskText;

        // Crear un botón para eliminar la tarea
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'X';
        deleteBtn.addEventListener('click', deleteTask);

        // Agregar el checkbox, el span y el botón al elemento de lista
        newTaskItem.appendChild(checkbox);
        newTaskItem.appendChild(taskSpan);
        newTaskItem.appendChild(deleteBtn);

        // Agregar el nuevo elemento de lista a la lista de tareas pendientes
        pendingList.appendChild(newTaskItem);

        // Limpiar el input
        taskInput.value = '';
    }
}

// Event listener para el botón "Agregar"
addTaskBtn.addEventListener('click', addTask);

// Event listener para permitir agregar tarea con la tecla Enter
taskInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        addTask();
    }
});

// Función para marcar una tarea como completada
function toggleComplete() {
    const listItem = this.parentNode;
    const taskSpan = listItem.querySelector('span');
    const completedList = document.getElementById('completedList');

    if (this.checked) {
        taskSpan.classList.add('completed');
        completedList.appendChild(listItem);
    } else {
        taskSpan.classList.remove('completed');
        pendingList.appendChild(listItem);
    }
}

// Función para eliminar una tarea
function deleteTask() {
    const listItem = this.parentNode;
    const list = listItem.parentNode;
    list.removeChild(listItem);
}