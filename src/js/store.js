import { loadTodos, saveTodos } from "./storage.js";

export const FILTERS = ["all", "active", "completed"];

const SEED_TODOS = [
  { text: "Complete online JavaScript course", completed: true },
  { text: "Jog around the park 3x", completed: false },
  { text: "10 minutes meditation", completed: false },
  { text: "Read for 1 hour", completed: false },
  { text: "Pick up groceries", completed: false },
  { text: "Complete Todo App on Frontend Mentor", completed: false },
];

const createId = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

let todos = loadTodos() ?? SEED_TODOS.map((t) => ({ ...t, id: createId() }));
let filter = "all";
const listeners = new Set();

function commit() {
  saveTodos(todos);
  listeners.forEach((fn) => fn());
}

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function getFilter() {
  return filter;
}

export function setFilter(next) {
  if (!FILTERS.includes(next) || next === filter) return;
  filter = next;
  listeners.forEach((fn) => fn());
}

export function getVisibleTodos() {
  if (filter === "active") return todos.filter((t) => !t.completed);
  if (filter === "completed") return todos.filter((t) => t.completed);
  return todos;
}

export function getActiveCount() {
  return todos.filter((t) => !t.completed).length;
}

export function hasCompleted() {
  return todos.some((t) => t.completed);
}

export function addTodo(text) {
  const clean = text.trim();
  if (!clean) return false;
  todos = [...todos, { id: createId(), text: clean, completed: false }];
  commit();
  return true;
}

export function toggleTodo(id, completed) {
  todos = todos.map((t) =>
    t.id === id ? { ...t, completed: completed ?? !t.completed } : t,
  );
  commit();
}

export function removeTodo(id) {
  todos = todos.filter((t) => t.id !== id);
  commit();
}

export function clearCompleted() {
  todos = todos.filter((t) => !t.completed);
  commit();
}

export function reorderVisible(orderedIds) {
  const visible = new Set(orderedIds);
  const slots = [];
  todos.forEach((t, i) => visible.has(t.id) && slots.push(i));

  const byId = new Map(todos.map((t) => [t.id, t]));
  const next = [...todos];
  orderedIds.forEach((id, k) => {
    next[slots[k]] = byId.get(id);
  });

  todos = next;
  commit();
}

export function moveVisible(id, offset) {
  const ids = getVisibleTodos().map((t) => t.id);
  const from = ids.indexOf(id);
  const to = from + offset;
  if (from === -1 || to < 0 || to >= ids.length) return false;

  ids.splice(to, 0, ids.splice(from, 1)[0]);
  reorderVisible(ids);
  return true;
}
