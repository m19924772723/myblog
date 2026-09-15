/**
 * 站内助理 SiteAgent — 规则匹配 agent
 * 意图路由：问候 / 知识库检索 / 导航检索 / 博客检索 / 系统指路 / 帮助 / 兜底
 */
interface KBItem {
  id: string; title: string; desc: string; tags: string[]; cat: string; url: string;
}
interface NavItem {
  id: string; name: string; desc: string; cat: string; tags: string[]; url: string;
}
interface PostItem {
  id: string; title: string; desc: string; url: string;
}
interface Payload {
  base: string;
  kb: KBItem[];
  navItems: NavItem[];
  posts: PostItem[];
}

const saDataEl = document.getElementById("sa-data") as HTMLScriptElement;
const saData: Payload = JSON.parse(saDataEl.textContent || "{}");

const BASE = (saData.base || "/myblog/").replace(/\/+$/, "");

const fab = document.getElementById("sa-fab") as HTMLButtonElement;
const panel = document.getElementById("sa-panel") as HTMLDivElement;
const closeBtn = document.getElementById("sa-close") as HTMLButtonElement;
const msgs = document.getElementById("sa-msgs") as HTMLDivElement;
const input = document.getElementById("sa-input") as HTMLInputElement;
const sendBtn = document.getElementById("sa-send") as HTMLButtonElement;
const quickRow = document.getElementById("sa-quick") as HTMLDivElement;

// ---- 分词：英文单词 + 中文双字组合 ----
function tokenize(q: string): string[] {
  const tokens: string[] = [];
  for (const m of q.match(/[a-zA-Z0-9]+/g) ?? []) tokens.push(m.toLowerCase());
  const cjk = (q.match(/[\u4e00-\u9fff]/g) ?? []) as string[];
  for (let i = 0; i < cjk.length - 1; i++) tokens.push(cjk[i] + cjk[i + 1]);
  if (cjk.length === 1) tokens.push(cjk[0]);
  return tokens;
}

function score(tokens: string[], text: string): number {
  const low = text.toLowerCase();
  let s = 0;
  for (const t of tokens) if (low.includes(t)) s += t.length >= 2 ? 2 : 1;
  return s;
}

function linkHtml(href: string, label: string, sub = ""): string {
  const external = href.startsWith("http");
  return `<a class="sa-link" href="${href}" ${external ? 'target="_blank" rel="noopener noreferrer"' : ""}>${label}${sub ? ` <span class="sa-link-sub">${sub}</span>` : ""}</a>`;
}

function addMsg(html: string, who: "user" | "bot") {
  const div = document.createElement("div");
  div.className = `sa-msg ${who === "user" ? "sa-user" : "sa-bot"}`;
  div.innerHTML = html;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

// ---- 意图路由 ----
function reply(q: string): string {
  const raw = q.trim();
  if (!raw) return "请输入问题～";
  const tokens = tokenize(raw);
  const joined = raw.toLowerCase();

  // 1. 问候
  if (/^(你好|您好|hi|hello|嗨|在吗|hey)\b/.test(raw) && tokens.length <= 2) {
    return `你好呀 👋 我是站内助理，连接了四大系统：<br>· <a class="sa-link" href="${BASE}">博客</a><br>· <a class="sa-link" href="${BASE}workbench/">工作台</a><br>· <a class="sa-link" href="${BASE}nav/">万象导航</a>（53 个站点）<br>· <a class="sa-link" href="${BASE}kb/">知识库</a>（11 篇速查）<br>问我"Git 怎么用"或"推荐 AI 工具"试试～`;
  }
  // 2. 帮助
  if (/(帮助|help|能做什么|怎么用|你会什么|\?)/.test(raw)) {
    return `我能做这些：<br>📚 <b>知识库检索</b>：问"Python 速查""论文怎么写"<br>🧭 <b>导航推荐</b>：问"AI 工具""设计网站"<br>📝 <b>博客检索</b>：问"工作台文章"<br>🗺 <b>系统指路</b>：问"知识图谱在哪"<br>🔍 没答上来会自动引导到全站搜索。`;
  }
  // 3. 系统指路
  if (/(图谱|graph)/.test(raw)) {
    return `知识图谱在这里：${linkHtml(`${BASE}kb/graph/`, "🗺 知识图谱（10 文档 · 5 分类力导向图）")}`;
  }
  if (/(工作台|workbench|待办|记录)/.test(raw)) {
    return `个人工作台：${linkHtml(`${BASE}workbench/`, "📋 工作台（每日待办 · 活动记录）")}<br>想找全局内容可以用 ${linkHtml(`${BASE}search/`, "全站搜索")}。`;
  }
  if (/(导航|nav|站点|网站)/.test(raw) && !/(ai|人工智能|工具)/.test(raw)) {
    return `万象导航有 53 个精选站点：${linkHtml(`${BASE}nav/`, "🧭 打开导航")}<br>也可以直接问我"有哪些 AI 工具"。`;
  }
  if (/(知识库|kb|速查|笔记)/.test(raw)) {
    return `知识库共 11 篇速查：${linkHtml(`${BASE}kb/`, "📚 打开知识库")}<br>例如：Git / Python / LaTeX / 论文写作 / 提示词工程。`;
  }
  if (/(博客|文章|post)/.test(raw)) {
    return `博客文章：${linkHtml(`${BASE}`, "🏠 回到首页")} · ${linkHtml(`${BASE}archives/`, "归档")} · ${linkHtml(`${BASE}search/`, "搜索")}`;
  }

  // 4. 知识库检索
  const kbHits = saData.kb
    .map(k => ({ k, s: score(tokens, `${k.title} ${k.desc} ${k.tags.join(" ")} ${k.cat}`) }))
    .filter(x => x.s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, 3);
  if (kbHits.length) {
    return `📚 知识库里找到 ${kbHits.length} 篇相关：<br>${kbHits.map(h => linkHtml(h.k.url, `· ${h.k.title}`, h.k.desc.slice(0, 24))).join("<br>")}`;
  }

  // 5. 导航检索
  const navHits = saData.navItems
    .map(n => ({ n, s: score(tokens, `${n.name} ${n.desc} ${n.tags.join(" ")} ${n.cat}`) }))
    .filter(x => x.s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, 3);
  if (navHits.length) {
    return `🧭 导航里找到 ${navHits.length} 个相关站点：<br>${navHits.map(h => linkHtml(h.n.url, `· ${h.n.name}`, h.n.desc.slice(0, 24))).join("<br>")}`;
  }

  // 6. 博客检索
  const postHits = saData.posts
    .map(p => ({ p, s: score(tokens, `${p.title} ${p.desc}`) }))
    .filter(x => x.s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, 3);
  if (postHits.length) {
    return `📝 博客相关文章：<br>${postHits.map(h => linkHtml(h.p.url, `· ${h.p.title}`, h.p.desc.slice(0, 24))).join("<br>")}`;
  }

  // 7. 兜底
  const enc = encodeURIComponent(raw);
  return `没找到直接匹配的内容 🤔<br>试试 ${linkHtml(`${BASE}search/`, "🔍 全站搜索")}（覆盖四大系统）<br>或外部搜索：${linkHtml(`https://www.bing.com/search?q=${enc}`, "Bing")} · ${linkHtml(`https://www.google.com/search?q=${enc}`, "Google")}`;
}

// ---- 交互 ----
fab.addEventListener("click", () => {
  panel.hidden = !panel.hidden;
  if (!panel.hidden) input.focus();
});
closeBtn.addEventListener("click", () => {
  panel.hidden = true;
});

function ask() {
  const q = input.value.trim();
  if (!q) return;
  addMsg(q.replace(/</g, "&lt;"), "user");
  input.value = "";
  setTimeout(() => addMsg(reply(q), "bot"), 120);
}
sendBtn.addEventListener("click", ask);
input.addEventListener("keydown", e => {
  if (e.key === "Enter") ask();
});

quickRow.querySelectorAll("button").forEach(btn => {
  btn.addEventListener("click", () => {
    input.value = btn.textContent ?? "";
    ask();
  });
});
