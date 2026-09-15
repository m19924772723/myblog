/**
 * 万象导航 OMNIA — 客户端交互（原生 TS，无框架）
 * 数据来自页面内嵌 JSON；全部功能：搜索/分类/模式筛选、收藏(localStorage)、
 * 外部搜索引擎跳转、随机发现、键盘快捷键。
 */
interface NavResource {
  id: string;
  name: string;
  description: string;
  url: string;
  category: string;
  tags: string[];
  featured: boolean;
  free: boolean;
  addedAt: string;
  initials: string;
  color: string;
}
interface NavCategory {
  id: string;
  name: string;
  englishName: string;
  icon: string;
  description: string;
  accent: string;
}

type FilterMode = "all" | "featured" | "free" | "favorites";

const FAV_KEY = "omnia-nav-favorites";
const dataEl = document.getElementById("nav-data") as HTMLScriptElement;
const payload = JSON.parse(dataEl.textContent || "{}") as {
  categories: NavCategory[];
  resources: NavResource[];
};
const { categories, resources } = payload;

const searchInput = document.getElementById("nav-search") as HTMLInputElement;
const providerSel = document.getElementById("nav-provider") as HTMLSelectElement;
const randomBtn = document.getElementById("nav-random") as HTMLButtonElement;
const countEl = document.getElementById("nav-count") as HTMLSpanElement;

const cardEls = new Map<string, HTMLElement>();
resources.forEach(r => {
  const el = document.getElementById(`card-${r.id}`);
  if (el) cardEls.set(r.id, el);
});
const sectionEls = new Map<string, HTMLElement>();
categories.forEach(c => {
  const el = document.getElementById(`section-${c.id}`);
  if (el) sectionEls.set(c.id, el);
});

let favorites: Set<string> = new Set(
  JSON.parse(localStorage.getItem(FAV_KEY) || "[]"),
);
let query = "";
let category: string = "all";
let mode: FilterMode = "all";

function saveFavorites() {
  localStorage.setItem(FAV_KEY, JSON.stringify([...favorites]));
}

function matches(r: NavResource): boolean {
  if (category !== "all" && r.category !== category) return false;
  if (mode === "featured" && !r.featured) return false;
  if (mode === "free" && !r.free) return false;
  if (mode === "favorites" && !favorites.has(r.id)) return false;
  if (query) {
    const cat = categories.find(c => c.id === r.category);
    const hay = [
      r.name,
      r.description,
      r.category,
      cat?.name ?? "",
      cat?.englishName ?? "",
      ...r.tags,
    ]
      .join(" ")
      .toLowerCase();
    const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
    if (!terms.every(t => hay.includes(t))) return false;
  }
  return true;
}

function apply() {
  let visible = 0;
  const secCount = new Map<string, number>();
  resources.forEach(r => {
    const ok = matches(r);
    cardEls.get(r.id)?.classList.toggle("nav-hidden", !ok);
    if (ok) {
      visible++;
      secCount.set(r.category, (secCount.get(r.category) ?? 0) + 1);
    }
  });
  categories.forEach(c => {
    sectionEls.get(c.id)?.classList.toggle("nav-hidden", (secCount.get(c.id) ?? 0) === 0);
  });
  countEl.textContent = `当前显示 ${visible} / ${resources.length} 个站点`;
}

function setChips() {
  document.querySelectorAll<HTMLElement>(".nav-chip").forEach(ch => {
    const key = ch.dataset.key || "";
    const kind = ch.dataset.kind || "";
    const active =
      kind === "cat" ? key === category : kind === "mode" ? key === mode : false;
    ch.classList.toggle("active", active);
  });
}

/* ---- 搜索 ---- */
let debounce: number | undefined;
searchInput.addEventListener("input", () => {
  window.clearTimeout(debounce);
  debounce = window.setTimeout(() => {
    query = searchInput.value.trim();
    apply();
  }, 120);
});

/* ---- 外部搜索 ---- */
function externalSearch(q: string) {
  const p = providerSel.value;
  const url =
    p === "google"
      ? `https://www.google.com/search?q=${encodeURIComponent(q)}`
      : p === "bing"
        ? `https://www.bing.com/search?q=${encodeURIComponent(q)}`
        : p === "github"
          ? `https://github.com/search?q=${encodeURIComponent(q)}&type=repositories`
          : "";
  if (url) window.open(url, "_blank", "noopener");
}
searchInput.addEventListener("keydown", e => {
  if (e.key === "Enter") {
    const q = searchInput.value.trim();
    if (q && providerSel.value !== "site") {
      e.preventDefault();
      externalSearch(q);
    }
  }
});

/* ---- 分类/模式切换 ---- */
document.querySelectorAll<HTMLElement>(".nav-chip").forEach(ch => {
  ch.addEventListener("click", () => {
    const key = ch.dataset.key || "";
    if (ch.dataset.kind === "cat") category = key;
    else if (ch.dataset.kind === "mode") mode = key as FilterMode;
    setChips();
    apply();
  });
});

/* ---- 收藏 ---- */
document.querySelectorAll<HTMLElement>(".nav-fav").forEach(btn => {
  btn.addEventListener("click", e => {
    e.preventDefault();
    e.stopPropagation();
    const id = btn.dataset.fav || "";
    if (favorites.has(id)) {
      favorites.delete(id);
      btn.classList.remove("active");
      btn.textContent = "☆";
    } else {
      favorites.add(id);
      btn.classList.add("active");
      btn.textContent = "★";
    }
    saveFavorites();
    if (mode === "favorites") apply();
  });
});
favorites.forEach(id => {
  const btn = document.querySelector<HTMLElement>(`.nav-fav[data-fav="${id}"]`);
  if (btn) {
    btn.classList.add("active");
    btn.textContent = "★";
  }
});

/* ---- 随机发现 ---- */
randomBtn.addEventListener("click", () => {
  const visible = resources.filter(matches);
  if (!visible.length) return;
  const pick = visible[Math.floor(Math.random() * visible.length)];
  const el = cardEls.get(pick.id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    el.classList.remove("flash");
    void el.offsetWidth;
    el.classList.add("flash");
  }
});

/* ---- 快捷键：/ 或 Ctrl/Cmd+K 聚焦搜索 ---- */
window.addEventListener("keydown", e => {
  const tag = (e.target as HTMLElement)?.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
  if (e.key === "/" || ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k")) {
    e.preventDefault();
    searchInput.focus();
    searchInput.select();
  }
  if (e.key === "Escape") {
    searchInput.blur();
    query = "";
    searchInput.value = "";
    apply();
  }
});

setChips();
apply();
