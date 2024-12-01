// Code for ToDo List
const addButton = document.getElementById('addTask');
const updateButton = document.getElementById('updateTask');
const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');
const deleteAllButton = document.getElementById('deleteAllTasks');

let selectedTask = null; // Variable to store the selected task for update

loadTasks();

// Updating the task count display
function updateTaskCount() {
    const taskCount = taskList.getElementsByTagName('li').length;
    document.getElementById('taskCount').textContent = `Total Tasks: ${taskCount}`;
}

// Add Task function updated to call updateTaskCount
function addTask() {
    const task = taskInput.value.trim();

    if (task) {
        createTaskElement(task);
        taskInput.value = '';
        saveTasks();
        updateTaskCount(); // Update count after adding
    } else {
        alert('Enter a task');
    }
}

// Delete all tasks
deleteAllButton.addEventListener('click', function () {
    if (confirm('Are you sure you want to delete all tasks?')) {
        taskList.innerHTML = '';
        saveTasks();
        updateTaskCount(); // Update count after deleting
    }
});

function updateTask() {
    if (selectedTask) {
        const newText = taskInput.value.trim();
        if (newText) {
            selectedTask.querySelector('span').textContent = newText;
            taskInput.value = '';
            selectedTask = null; // Clear the selected task
            saveTasks();
        } else {
            alert('Enter a new task text');
        }
    } else {
        alert('Please select a task to update');
    }
}

addButton.addEventListener('click', addTask);
updateButton.addEventListener('click', updateTask);

// Create Task Element with checkbox and strikethrough already handled
function createTaskElement(task) {
    const listItem = document.createElement('li');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'taskCheckbox';
    listItem.appendChild(checkbox);

    const taskText = document.createElement('span');
    taskText.textContent = task;
    listItem.appendChild(taskText);

    checkbox.addEventListener('change', function () {
        if (checkbox.checked) {
            taskText.style.textDecoration = 'line-through'; // Mark as completed
        } else {
            taskText.style.textDecoration = 'none'; // Mark as not completed
        }
        saveTasks(); // Save state after checking/unchecking
    });

    listItem.addEventListener('click', function () {
        selectedTask = listItem;
        taskInput.value = taskText.textContent;
    });

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.className = 'deleteTask';
    listItem.appendChild(deleteButton);

    deleteButton.addEventListener('click', function () {
        taskList.removeChild(listItem);
        saveTasks();
        updateTaskCount(); // Update count after deletion
    });

    taskList.appendChild(listItem);
    updateTaskCount(); // Update count after creation
}

function saveTasks() {
    let tasks = [];
    taskList.querySelectorAll('li').forEach(function (item) {
        const taskText = item.querySelector('span').textContent;
        const isChecked = item.querySelector('.taskCheckbox').checked;
        tasks.push({ text: taskText, completed: isChecked });
    });

    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Load tasks and update the count
function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(function (task) {
        createTaskElement(task.text);
        if (task.completed) {
            const checkbox = taskList.lastChild.querySelector('.taskCheckbox');
            checkbox.checked = true;
            checkbox.nextElementSibling.classList.add('completed');
        }
    });
    updateTaskCount();
}

addButton.addEventListener('click', addTask);
updateButton.addEventListener('click', updateTask);

// Code for Slot Machine
const symbols = ['🍒', '🍋', '🍉', '🍇', '🍓', '🍊'];
const fruit1 = document.getElementById('fruit1');
const fruit2 = document.getElementById('fruit2');
const fruit3 = document.getElementById('fruit3');
const spinButton = document.getElementById('spinButton');
const autoSpinButton = document.getElementById('autoSpinButton');
const stopAutoSpinButton = document.getElementById('stopAutoSpinButton');
const tokenCountDisplay = document.getElementById('tokenCount');
const messageDisplay = document.getElementById('message');
let autoSpinInterval;
let tokens = 20; // Initial token count

function getRandomSymbol() {
    return symbols[Math.floor(Math.random() * symbols.length)];
}

function spinReels() {
    if (tokens > 0) {
        fruit1.textContent = getRandomSymbol();
        fruit2.textContent = getRandomSymbol();
        fruit3.textContent = getRandomSymbol();
        updateTokens(-1);
        checkWin();
    } else {
        alert('Out of token Please recharge!');
        stopAutoSpin(); 
    }
}

function updateTokens(amount) {
    tokens += amount;
    tokenCountDisplay.textContent = tokens;
}

function checkWin() {
    if (fruit1.textContent === fruit2.textContent && fruit2.textContent === fruit3.textContent) {
        updateTokens(5); 
        displayMessage('You win! +5 tokens');
    } else {
        displayMessage('');
    }
}

function displayMessage(message) {
    messageDisplay.textContent = message;
}

function startAutoSpin() {
    autoSpinButton.disabled = true;
    stopAutoSpinButton.disabled = false;
    autoSpinInterval = setInterval(spinReels, 500);
}

function stopAutoSpin() {
    clearInterval(autoSpinInterval);
    autoSpinButton.disabled = false;
    stopAutoSpinButton.disabled = true;
}

function retryGame() {
    // Reset tokens and fruit reels
    tokens = 20;
    tokenCountDisplay.textContent = tokens;
    fruit1.textContent = '🍒'
    fruit2.textContent = '🍋';
    fruit3.textContent = '🍉';
    messageDisplay.textContent = '';
    stopAutoSpin(); // Stop any ongoing auto spins
    autoSpinButton.disabled = false;
}

// Event Listeners
spinButton.addEventListener('click', spinReels);
autoSpinButton.addEventListener('click', startAutoSpin);
stopAutoSpinButton.addEventListener('click', stopAutoSpin);
retryButton.addEventListener('click', retryGame);