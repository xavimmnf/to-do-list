const $ = (el) => document.querySelector(el);
const $$ = (el) => document.querySelectorAll(el);

const textBox = $('.app__input');
const addTaskBtn = $('.app__btn');
const taskList = $('.app__tasklist');
const errorMessage = $('.error-message');
const textCount = $('.app__taskcount-number');
let tasKCount = 0;

textBox.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    addTask();
  }
});

addTaskBtn.addEventListener('click', () => addTask());

const addTask = () => {
  let newTaskText = textBox.value;

  if (newTaskText === '') {
    displayErrorMessage();
    return;
  }

  let newTask = document.createElement('div');
  newTask.classList.add('app__tasklist-item');
  newTask.innerHTML = `
    <input type="checkbox" class="app__tasklist-item-checkbox" name="checkbox" />
    <input type="text" name="tasktext" value="${newTaskText}" class="app__tasklist-item-text" disabled/>
    <button class="app__tasklist-item--btn edit">
        <i class="fa-solid fa-pen-to-square"></i>
    </button>
    <button class="app__tasklist-item--btn delete">
        <i class="fa-solid fa-trash-can"></i>
    </button>
  `;

  taskList.appendChild(newTask);
  tasKCount++;
  displayCount(tasKCount);

  addTaskEvents(newTask);
  saveData();
  resetTextBox();
};

const addTaskEvents = (task) => {
  const deleteBtn = task.querySelector('.delete');
  const checkbox = task.querySelector('.app__tasklist-item-checkbox');
  const editBtn = task.querySelector('.edit');
  const taskText = task.querySelector('.app__tasklist-item-text');

  //delete task
  deleteBtn.addEventListener('click', () => {
    task.remove();

    if (!checkbox.checked) {
      if (tasKCount > 0) {
        tasKCount--;
      }
    }

    displayCount(tasKCount);
    saveData();
  });

  //completed task
  checkbox.addEventListener('change', () => {
    task.classList.toggle('complete');
    editBtn.classList.toggle('disabled');

    if (checkbox.checked) {
      tasKCount--;
    } else {
      tasKCount++;
    }

    displayCount(tasKCount);
    saveData();
  });

  //edit task
  taskText.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      taskText.disabled = true;
      saveData();
    }
  });

  editBtn.addEventListener('click', () => {
    taskText.disabled = false;
    taskText.focus();
    let length = taskText.value.length;
    taskText.setSelectionRange(length, length);
  });
};

const displayCount = (count) => {
  textCount.innerText = count;
};

const displayErrorMessage = () => {
  errorMessage.classList.add('active');
  setTimeout(() => {
    errorMessage.classList.remove('active');
    resetTextBox();
  }, 1500);
};

const resetTextBox = () => {
  textBox.value = '';
  textBox.focus();
};

const saveData = () => {
  const tasks = [];
  $$('.app__tasklist-item').forEach((taskItem) => {
    const taskText = taskItem.querySelector('.app__tasklist-item-text').value;
    const taskCompleted = taskItem.querySelector(
      '.app__tasklist-item-checkbox'
    ).checked;
    tasks.push({ text: taskText, completed: taskCompleted });
  });

  localStorage.setItem('tasks', JSON.stringify(tasks));
  localStorage.setItem('count', tasKCount);
};

const getData = () => {
  const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasKCount = parseInt(localStorage.getItem('count')) || 0;

  savedTasks.forEach((task) => {
    let newTask = document.createElement('div');
    newTask.classList.add('app__tasklist-item');
    newTask.innerHTML = `
      <input type="checkbox" class="app__tasklist-item-checkbox" name="checkbox" ${
        task.completed ? 'checked' : ''
      }/>
      <input type="text" name="tasktext" value="${
        task.text
      }" class="app__tasklist-item-text" disabled/>
      <button class="app__tasklist-item--btn edit ${
        task.completed ? 'disabled' : ''
      }">
          <i class="fa-solid fa-pen-to-square"></i>
      </button>
      <button class="app__tasklist-item--btn delete">
          <i class="fa-solid fa-trash-can"></i>
      </button>
    `;

    if (task.completed) {
      newTask.classList.add('complete');
    }

    taskList.appendChild(newTask);
    addTaskEvents(newTask);
  });

  displayCount(tasKCount);
};

getData();
