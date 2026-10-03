import { loadTheme, saveTheme } from "./storage.js";

const root = document.documentElement;
const button = document.getElementById("theme-toggle");

function apply(theme) {
  root.setAttribute("data-theme", theme);
  button.setAttribute(
    "aria-label",
    theme === "dark" ? "Switch to light mode" : "Switch to dark mode",
  );
}

export function initTheme() {
  const system = window.matchMedia("(prefers-color-scheme: dark)");
  apply(loadTheme() ?? (system.matches ? "dark" : "light"));

  button.addEventListener("click", () => {
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    apply(next);
    saveTheme(next);
  });

  system.addEventListener("change", (e) => {
    if (!loadTheme()) apply(e.matches ? "dark" : "light");
  });
}
