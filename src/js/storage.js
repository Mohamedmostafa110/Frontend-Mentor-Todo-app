const TODOS_KEY = 'todo-items';
const THEME_KEY = 'todo-theme';

function read(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function write(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {
  }
}

export function loadTodos() {
  const raw = read(TODOS_KEY);
  if (raw === null) return null;

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;

    return parsed
      .filter((t) => t && typeof t.id === 'string' && typeof t.text === 'string')
      .map((t) => ({ id: t.id, text: t.text, completed: Boolean(t.completed) }));
  } catch {
    return null;
  }
}

export function saveTodos(todos) {
  write(TODOS_KEY, JSON.stringify(todos));
}

export function loadTheme() {
  const theme = read(THEME_KEY);
  return theme === 'light' || theme === 'dark' ? theme : null;
}

export function saveTheme(theme) {
  write(THEME_KEY, theme);
}
