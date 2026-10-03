import {
  FILTERS,
  getActiveCount,
  getFilter,
  getVisibleTodos,
  hasCompleted,
} from "./store.js";

const listEl = document.getElementById("todo-list");
const countEl = document.getElementById("items-left");
const clearBtn = document.getElementById("clear-completed");
const filterBtns = document.querySelectorAll("[data-filter]");

const EMPTY_MESSAGES = {
  all: "No todos yet — add one above.",
  active: "No active todos.",
  completed: "No completed todos.",
};

function createTodoItem(todo) {
  const li = document.createElement("li");
  li.className = "todo";
  li.dataset.id = todo.id;
  li.classList.toggle("is-completed", todo.completed);

  const label = document.createElement("label");
  label.className = "todo__label";

  const input = document.createElement("input");
  input.className = "todo__checkbox sr-only";
  input.type = "checkbox";
  input.checked = todo.completed;

  const circle = document.createElement("span");
  circle.className = "todo__circle";
  circle.setAttribute("aria-hidden", "true");

  const text = document.createElement("span");
  text.className = "todo__text";
  text.textContent = todo.text;

  label.append(input, circle, text);

  const del = document.createElement("button");
  del.className = "todo__delete";
  del.type = "button";
  del.setAttribute("aria-label", `Delete "${todo.text}"`);

  const icon = document.createElement("span");
  icon.className = "todo__delete-icon";
  icon.setAttribute("aria-hidden", "true");
  del.append(icon);

  li.append(label, del);
  return li;
}

function createEmptyItem(filter) {
  const li = document.createElement("li");
  li.className = "todo todo--empty";
  li.textContent = EMPTY_MESSAGES[filter];
  return li;
}

export function render() {
  const filter = getFilter();
  const todos = getVisibleTodos();

  listEl.replaceChildren(
    ...(todos.length ? todos.map(createTodoItem) : [createEmptyItem(filter)]),
  );

  const left = getActiveCount();
  countEl.textContent = `${left} ${left === 1 ? "item" : "items"} left`;
  clearBtn.disabled = !hasCompleted();

  filterBtns.forEach((btn) => {
    const isActive =
      FILTERS.includes(btn.dataset.filter) && btn.dataset.filter === filter;
    btn.classList.toggle("is-active", isActive);
    btn.setAttribute("aria-pressed", String(isActive));
  });
}

export function focusCheckbox(id) {
  listEl
    .querySelector(`[data-id="${CSS.escape(id)}"] .todo__checkbox`)
    ?.focus();
}
