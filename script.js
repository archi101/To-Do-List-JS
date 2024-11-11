let currentTaskToEdit = null;
let currentTaskToDelete = null;

document.getElementById('addTaskButton').addEventListener('click', addTask);
document.addEventListener('keypress', function (event) {
    if (event.key === "Enter") {
        addTask();
    }
});
document.getElementById('clearCompleted').addEventListener('click', clearCompleted);

document.addEventListener('DOMContentLoaded', loadTasks);
document.getElementById('taskList').addEventListener('click', function (event) {
    if (event.target.classList.contains('crossIcon')) {
        openDeleteModal(event);
    } else if (event.target.classList.contains('editIcon')) {
        openEditModal(event);
    }
});

function removeTask() {
    if (currentTaskToDelete) {
        currentTaskToDelete.remove();
        saveTasks();
        closeDeleteModal();
    }
}

function openDeleteModal(event) {
    const taskDiv = event.target.closest('.task');
    currentTaskToDelete = taskDiv;
    const modal = document.getElementById('deleteModal');
    modal.classList.add('show');
}

function closeDeleteModal() {
    const modal = document.getElementById('deleteModal');
    modal.classList.remove('show');
    currentTaskToDelete = null;
}

document.getElementById('confirmDelete').addEventListener('click', removeTask);
document.getElementById('cancelDelete').addEventListener('click', closeDeleteModal);
document.querySelector('.close-delete').addEventListener('click', closeDeleteModal);

window.addEventListener('click', function(event) {
    const deleteModal = document.getElementById('deleteModal');
    if (event.target === deleteModal) {
        closeDeleteModal();
    }
});

function addTask() {
    const taskText = document.getElementById('taskInput').value;
    if (taskText.trim() === '') return;

    const taskDiv = document.createElement('div');
    taskDiv.classList.add('task');
    taskDiv.setAttribute('data-state', 'To Do');

    const taskName = document.createElement('span');
    taskName.innerText = taskText;

    const iconsDiv = document.createElement('div');
    iconsDiv.classList.add('icons');

    const todoIcon = createStateIcon('To Do', taskDiv);
    const inProgressIcon = createStateIcon('In Progress', taskDiv);
    const completedIcon = createStateIcon('Completed', taskDiv);

    const additionalFunctionality = document.createElement('div');
    additionalFunctionality.classList.add('additionalFunctionality');

    const editIcon = document.createElement('img');
    editIcon.classList.add('editIcon');
    editIcon.src = 'https://www.svgrepo.com/show/485559/edit.svg';
    editIcon.alt = 'edit icon';
    editIcon.width = 24;
    editIcon.height = 24;

    const crossIcon = document.createElement('img');
    crossIcon.classList.add('crossIcon');
    crossIcon.src = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgRj9c9AlJpKO8IGQL-8kZQOo4Gtfrut6ztw&s';
    crossIcon.alt = 'cross icon';
    crossIcon.width = 24;
    crossIcon.height = 24;

    todoIcon.classList.add('highlighted');

    additionalFunctionality.append(editIcon, crossIcon);
    iconsDiv.append(todoIcon, inProgressIcon, completedIcon);

    const iconsCrossContainer = document.createElement('div');
    iconsCrossContainer.classList.add('icons-cross-container');
    iconsCrossContainer.append(iconsDiv, additionalFunctionality);

    taskDiv.append(taskName, iconsCrossContainer);
    document.getElementById('taskList').appendChild(taskDiv);
    document.getElementById('taskInput').value = '';
}

function openEditModal(event) {
    const taskDiv = event.target.closest('.task');
    currentTaskToEdit = taskDiv;
    const taskName = taskDiv.querySelector('span').innerText;
    document.getElementById('editInput').value = taskName;

    const modal = document.getElementById('editModal');
    modal.classList.add('show');
}

document.getElementById('saveEditButton').addEventListener('click', function() {
    const newText = document.getElementById('editInput').value;
    if (currentTaskToEdit && newText.trim() !== '') {
        const taskName = currentTaskToEdit.querySelector('span');
        taskName.innerText = newText;
        saveTasks();
        closeEditModal();
    }
});

document.querySelector('.close').addEventListener('click', closeEditModal);

window.addEventListener('click', function(event) {
    const modal = document.getElementById('editModal');
    if (event.target === modal) {
        closeEditModal();
    }
});

function closeEditModal() {
    const modal = document.getElementById('editModal');
    modal.classList.remove('show');
    currentTaskToEdit = null;
}

function createStateIcon(label, taskDiv) {
    const icon = document.createElement('div');
    icon.classList.add('icon');
    icon.innerText = label;

    const tooltip = document.createElement('div');
    tooltip.classList.add('tooltip');
    tooltip.innerText = `Click to mark as ${label.toLowerCase()}`;
    icon.appendChild(tooltip);

    icon.addEventListener('click', function () {
        const icons = taskDiv.querySelectorAll('.icon');
        for (const i of icons) {
            i.classList.remove('highlighted');
        }
        icon.classList.add('highlighted');
        taskDiv.setAttribute('data-state', label);
        saveTasks();
    });
    return icon;
}

function clearCompleted() {
    const tasks = document.querySelectorAll('.task');
    tasks.forEach(task => {
        const completedIcon = task.querySelector('.icon.highlighted');
        if (completedIcon && completedIcon.innerText === 'Completed') {
            task.remove();
        }
    });
    saveTasks();
    sortTasks();
}

function saveTasks() {
    const tasks = [];
    const taskElements = document.querySelectorAll('.task');
    taskElements.forEach(task => {
        const taskText = task.querySelector('span').innerText;
        const taskState = task.getAttribute('data-state');
        tasks.push({ text: taskText, state: taskState });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
        const tasks = JSON.parse(storedTasks);
        tasks.forEach(taskData => {
            const taskDiv = document.createElement('div');
            taskDiv.classList.add('task');
            taskDiv.setAttribute('data-state', taskData.state);

            const taskName = document.createElement('span');
            taskName.innerText = taskData.text;

            const iconsDiv = document.createElement('div');
            iconsDiv.classList.add('icons');

            const todoIcon = createStateIcon('To Do', taskDiv);
            const inProgressIcon = createStateIcon('In Progress', taskDiv);
            const completedIcon = createStateIcon('Completed', taskDiv);

            const additionalFunctionality = document.createElement('div');
            additionalFunctionality.classList.add('additionalFunctionality');

            const editIcon = document.createElement('img');
            editIcon.classList.add('editIcon');
            editIcon.src = 'https://www.svgrepo.com/show/485559/edit.svg';
            editIcon.alt = 'edit icon';
            editIcon.width = 24;
            editIcon.height = 24;

            const crossIcon = document.createElement('img');
            crossIcon.classList.add('crossIcon');
            crossIcon.src = 'https://png.pngtree.com/png-vector/20190504/ourmid/pngtree-vector-cross-icon-png-image_1020156.jpg';
            crossIcon.alt = 'cross icon';
            crossIcon.width = 24;
            crossIcon.height = 24;

            if (taskData.state === 'To Do') {
                todoIcon.classList.add('highlighted');
            } else if (taskData.state === 'In Progress') {
                inProgressIcon.classList.add('highlighted');
            } else if (taskData.state === 'Completed') {
                completedIcon.classList.add('highlighted');
            }

            additionalFunctionality.append(editIcon, crossIcon);
            iconsDiv.append(todoIcon, inProgressIcon, completedIcon);

            const iconsCrossContainer = document.createElement('div');
            iconsCrossContainer.classList.add('icons-cross-container');
            iconsCrossContainer.append(iconsDiv, additionalFunctionality);

            taskDiv.append(taskName, iconsCrossContainer);
            document.getElementById('taskList').appendChild(taskDiv);
        });
    }
}

