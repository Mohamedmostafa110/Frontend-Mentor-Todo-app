import '@fontsource/josefin-sans/latin-400.css';
import '@fontsource/josefin-sans/latin-700.css';
import './scss/main.scss';

import {
  addTodo,
  clearCompleted,
  moveVisible,
  removeTodo,
  setFilter,
  subscribe,
  toggleTodo,
} from './js/store.js';
import { focusCheckbox, render } from './js/render.js';
import { initTheme } from './js/theme.js';
import { initDragAndDrop } from './js/dnd.js';

const form = document.getElementById('new-todo-form');
const input = document.getElementById('new-todo-input');
const listEl = document.getElementById('todo-list');

initTheme();
subscribe(render);
render();
initDragAndDrop(listEl);

// Add
form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (addTodo(input.value)) input.value = '';
});

// Complete / delete (event delegation)
listEl.addEventListener('change', (e) => {
  if (!e.target.matches('.todo__checkbox')) return;
  const id = e.target.closest('.todo').dataset.id;
  toggleTodo(id, e.target.checked);
  focusCheckbox(id);
});

listEl.addEventListener('click', (e) => {
  const del = e.target.closest('.todo__delete');
  if (!del) return;
  const item = del.closest('.todo');
  const next = item.nextElementSibling?.dataset.id ?? item.previousElementSibling?.dataset.id;
  removeTodo(item.dataset.id);
  if (next) focusCheckbox(next);
  else input.focus();
});

// Keyboard reorder: Alt + ↑ / ↓ on a focused todo
listEl.addEventListener('keydown', (e) => {
  if (!e.altKey || (e.key !== 'ArrowUp' && e.key !== 'ArrowDown')) return;
  const item = e.target.closest('.todo');
  if (!item?.dataset.id) return;
  e.preventDefault();
  const id = item.dataset.id;
  if (moveVisible(id, e.key === 'ArrowUp' ? -1 : 1)) focusCheckbox(id);
});

// Filters
document.querySelector('.filters').addEventListener('click', (e) => {
  const btn = e.target.closest('[data-filter]');
  if (btn) setFilter(btn.dataset.filter);
});

// Clear completed
document.getElementById('clear-completed').addEventListener('click', clearCompleted);
