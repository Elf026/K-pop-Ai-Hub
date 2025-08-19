// Theme, year, search, tiny helpers

// Current year
document.addEventListener("DOMContentLoaded", () => {
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
});

// Theme toggle
const themeToggle = document.getElementById("themeToggle");
if (themeToggle) {
  const key = "kpop_ai_lab_theme";
  const set = v => document.documentElement.dataset.theme = v;
  const saved = localStorage.getItem(key);
  if (saved) set(saved);
  themeToggle.addEventListener("click", () => {
    const now = document.documentElement.dataset.theme === "light" ? "dark" : "light";
    set(now);
    localStorage.setItem(key, now);
  });
  // Default by system
  if (!saved) {
    set(window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
  }
}

// Live filter for tool cards
const search = document.getElementById("toolSearch");
if (search) {
  const cards = Array.from(document.querySelectorAll(".card"));
  const index = cards.map(c => ({
    el: c,
    text: (c.querySelector("h2")?.textContent + " " + c.querySelector("p")?.textContent + " " + c.dataset.tags).toLowerCase()
  }));
  search.addEventListener("input", () => {
    const q = search.value.trim().toLowerCase();
    index.forEach(({ el, text }) => {
      el.style.display = text.includes(q) ? "" : "none";
    });
  });
}

// Small utilities used by tool pages
window.$ = (sel, root = document) => root.querySelector(sel);
window.$$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

window.copyText = async (id) => {
  const el = document.getElementById(id);
  if (!el) return;
  try {
    await navigator.clipboard.writeText(el.textContent);
    alert("Copied");
  } catch {
    alert("Copy failed");
  }
};

// Simple seeded random for repeatable results based on input text
window.seeded = (seedText) => {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < seedText.length; i++) {
    h ^= seedText.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return () => {
    // xorshift
    h ^= h << 13; h ^= h >>> 17; h ^= h << 5;
    return (h >>> 0) / 4294967296;
  };
};
