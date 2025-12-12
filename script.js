//-------------------------- APP ------------------------------
// DOM Elements
const taskInput = document.getElementById('task-input');
const addTaskBtn = document.getElementById('add-task');
const todosList = document.getElementById('todos-list');
const itemsLeft = document.getElementById('items-left');
const clearCompletedBtn = document.getElementById('clear-completed');
const emptyState = document.querySelector('.empty-state');
const dateElement = document.getElementById('date');
const filters = document.querySelectorAll('.filter');

let todos = [];
let currentFilter = 'all';

addTaskBtn.addEventListener('click', () => {
  addTodo(taskInput.value);
});

taskInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') addTodo(taskInput.value);
});

clearCompletedBtn.addEventListener('click', clearCompleted);

function addTodo(text) {
  if (text.trim() === '') return;

  const todo = {
    id: Date.now(),
    date: new Date().getTime(),
    text,
    completed: false,
  };

  todos.push(todo);

  saveTodos();
  renderTodos();
  taskInput.value = '';
}

function saveTodos() {
  localStorage.setItem('todos', JSON.stringify(todos));
  updateItemsCount();
  checkEmptyState();
}

function updateItemsCount() {
  const uncompletedTodos = todos.filter((todo) => !todo.completed);
  itemsLeft.textContent = `falta${uncompletedTodos?.length > 1 ? 'm' : ''} ${
    uncompletedTodos?.length
  } item${uncompletedTodos?.length > 1 ? 's' : ''}`;
}

function checkEmptyState() {
  const filteredTodos = filterTodos(currentFilter);
  if (filteredTodos?.length === 0) emptyState.classList.remove('hidden');
  else emptyState.classList.add('hidden');
}

function filterTodos(filter) {
  switch (filter) {
    case 'active':
      return todos.filter((todo) => !todo.completed);
    case 'completed':
      return todos.filter((todo) => todo.completed);
    default:
      return todos;
  }
}

function renderTodos() {
  todosList.innerHTML = '';

  const filteredTodos = filterTodos(currentFilter);

  checkEmptyState();

  filteredTodos.forEach((todo) => {
    const todoItem = document.createElement('li');
    todoItem.classList.add('todo-item');
    if (todo.completed) todoItem.classList.add('completed');

    const checkboxContainer = document.createElement('label');
    checkboxContainer.classList.add('checkbox-container');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.classList.add('todo-checkbox');
    checkbox.checked = todo.completed;
    checkbox.addEventListener('change', () => toggleTodo(todo.id));

    const checkmark = document.createElement('span');
    checkmark.classList.add('checkmark');

    checkboxContainer.appendChild(checkbox);
    checkboxContainer.appendChild(checkmark);

    const todoText = document.createElement('span');
    todoText.classList.add('todo-item-text');
    todoText.textContent = todo.text;

    const days = timeAgo(todo);
    let todoDateEl = null;
    if (days) {
      todoDateEl = document.createElement('span');
      todoDateEl.classList.add('todo-item-date');
      todoDateEl.innerHTML = `${days} day${days > 1 ? 's' : ''} ago`;
    }

    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('delete-btn');
    deleteBtn.innerHTML = '<i class="fas fa-times"></i>';
    deleteBtn.addEventListener('click', () => deleteTodo(todo.id));

    todoItem.appendChild(checkboxContainer);
    todoItem.appendChild(todoText);
    if (todoDateEl) todoItem.appendChild(todoDateEl);
    todoItem.appendChild(deleteBtn);

    todosList.appendChild(todoItem);
  });
}

function timeAgo(todo) {
  const todoDate = todo.date;
  const nowDate = new Date().getTime();

  const differenceInMs = nowDate - todoDate;
  const differenceInDays = Math.floor(differenceInMs / (1000 * 60 * 60 * 24));

  if (differenceInDays >= 1) {
    return differenceInDays;
  } else {
    return false;
  }
}

function clearCompleted() {
  todos = todos.filter((todo) => !todo.completed);
  saveTodos();
  renderTodos();
}

function toggleTodo(id) {
  todos = todos.map((todo) => {
    if (todo.id === id) {
      return { ...todo, completed: !todo.completed };
    }

    return todo;
  });
  saveTodos();
  renderTodos();
}

function deleteTodo(id) {
  todos = todos.filter((todo) => todo.id !== id);
  saveTodos();
  renderTodos();
}

function loadTodos() {
  const storedTodos = localStorage.getItem('todos');
  if (storedTodos) todos = JSON.parse(storedTodos);
  renderTodos();
}

filters.forEach((filter) => {
  filter.addEventListener('click', () => {
    setActiveFilter(filter.getAttribute('data-filter'));
  });
});

function setActiveFilter(filter) {
  currentFilter = filter;

  filters.forEach((item) => {
    if (item.getAttribute('data-filter') === filter) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });

  renderTodos();
}

function setDate() {
  const options = { weekday: 'long', month: 'short', day: 'numeric' };
  const today = new Date();
  dateElement.textContent = today.toLocaleDateString('pt-BR', options);
}

window.addEventListener('DOMContentLoaded', () => {
  loadTodos();
  updateItemsCount();
  setDate();
});

//---------------------- Welcome-Page --------------------------
var date = new Date().toLocaleTimeString();
var horas = date.slice(0, 2);

setTimeout(() => {
  const welcomeScreen = document.getElementById('welcomeScreen');
  welcomeScreen.classList.add('fade-out');

  welcomeScreen.addEventListener(
    'animationend',
    () => {
      welcomeScreen.classList.add('hidden');
    },
    { once: true }
  );
}, 2000);

const message = document.querySelector('.welcome-message');

function setThemeByTime() {
  const root = document.documentElement;

  if (horas >= 6 && horas < 13) {
    // Manhã
    message.innerHTML = 'Bom <span>Dia!</span>';
    root.style.setProperty('--primary', 'var(--primary-morning)');
    root.style.setProperty('--background', 'var(--background-morning)');
  }

  if (horas >= 13 && horas < 18) {
    // Tarde
    message.innerHTML = 'Boa <span>Tarde!</span>';
    root.style.setProperty('--primary', 'var(--primary-afternoon)');
    root.style.setProperty('--background', 'var(--background-afternoon)');
  }

  if (horas < 6 || horas >= 18) {
    // Noite
    message.innerHTML = 'Boa <span>Noite!</span>';
    root.style.setProperty('--primary', 'var(--primary-night)');
    root.style.setProperty('--background', 'var(--background-night)');
  }
}

setThemeByTime();
