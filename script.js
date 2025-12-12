const inputBox = document.getElementById('input-box');
const listContainer = document.getElementById('list-container');
const addBtn = document.getElementById('add-btn');
const prioSelect = document.getElementById('priority-select');
const counts = document.getElementById('counts');
const emptyState = document.getElementById('empty-state');
const themeToggle = document.getElementById('theme-toggle');

let tasks = []; 


loadTheme();
loadTasks();
render();

addBtn.addEventListener('click', () => addTask());
inputBox.addEventListener('keydown', (e) => { if (e.key === 'Enter') addTask(); });

function addTask(){
  const text = inputBox.value.trim();
  const priority = prioSelect.value || 'medium';
  if (!text) { alert('Please enter a task'); return; }

  tasks.push({ id: Date.now().toString(), text, completed: false, priority });
  inputBox.value = '';
  saveTasks();
  render();
}


function render(){
  listContainer.innerHTML = '';
  if (tasks.length === 0) {
    emptyState.style.display = 'block';
  } else {
    emptyState.style.display = 'none';
  }

  tasks.forEach(task => {
    const li = document.createElement('li');
    if (task.completed) li.classList.add('completed');


    const chk = document.createElement('div');
    chk.className = 'chk';
    chk.innerHTML = task.completed ? '✔' : '';
    chk.title = 'Toggle complete';
    chk.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleComplete(task.id);
    });


    const txt = document.createElement('div');
    txt.className = 'task-text' + (task.completed ? ' completed' : '');
    txt.textContent = task.text;
    txt.title = 'Double-click to edit';
    txt.addEventListener('dblclick', () => startEdit(task.id, txt));


    const badge = document.createElement('div');
    badge.className = 'priority-badge ' + (task.priority === 'high'? 'bad-high' : (task.priority === 'medium' ? 'bad-medium' : 'bad-low'));
    badge.textContent = task.priority;

    
    const del = document.createElement('button');
    del.className = 'del-btn';
    del.innerHTML = '✕';
    del.title = 'Delete task';
    del.addEventListener('click', (e) => {
      e.stopPropagation();
      deleteTask(task.id);
    });


    const rightWrap = document.createElement('div');
    rightWrap.style.display = 'flex';
    rightWrap.style.alignItems = 'center';
    rightWrap.appendChild(badge);
    rightWrap.appendChild(del);

    
    li.appendChild(chk);
    li.appendChild(txt);
    li.appendChild(rightWrap);

    li.addEventListener('click', (e) => {
    
      if (e.target.tagName === 'INPUT') return;
      toggleComplete(task.id);
    });

    listContainer.appendChild(li);
  });

  updateCounts();
}


function toggleComplete(id){
  tasks = tasks.map(t => t.id === id ? {...t, completed: !t.completed} : t);
  saveTasks();
  render();
}

function deleteTask(id){
  tasks = tasks.filter(t => t.id !== id);
  saveTasks();
  render();
}

function startEdit(id, txtNode){
  const task = tasks.find(t => t.id === id);
  if (!task) return;
  const input = document.createElement('input');
  input.className = 'edit-input';
  input.value = task.text;
  txtNode.replaceWith(input);
  input.focus();
  
  const commit = () => {
    const newText = input.value.trim();
    if (newText) {
      tasks = tasks.map(t => t.id === id ? {...t, text: newText} : t);
    }
    saveTasks();
    render();
  };
  input.addEventListener('blur', commit);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') input.blur();
    if (e.key === 'Escape') { render(); }
  });
}

function updateCounts(){
  const total = tasks.length;
  const done = tasks.filter(t => t.completed).length;
  counts.textContent = `${done} / ${total}`;
}


function saveTasks(){
  localStorage.setItem('todo_tasks_v1', JSON.stringify(tasks));
}
function loadTasks(){
  const raw = localStorage.getItem('todo_tasks_v1');
  tasks = raw ? JSON.parse(raw) : [];
}


themeToggle.addEventListener('change', (e) => {
  document.body.classList.toggle('light', e.target.checked);
  localStorage.setItem('todo_theme_light', e.target.checked ? '1' : '0');
});
function loadTheme(){
  const light = localStorage.getItem('todo_theme_light') === '1';
  document.body.classList.toggle('light', light);
  themeToggle.checked = light;
}
