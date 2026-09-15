/**
 * 知识图谱 — 力导向图（WeKnora 风格静态版）
 * 数据来自页面内嵌 JSON；canvas 渲染 + 手写斥力/弹簧模拟。
 */
interface GNode {
  id: string;
  label: string;
  kind: "article" | "category";
  color: string;
  url?: string;
  size: number;
}
interface GEdge {
  a: string;
  b: string;
}

interface GData {
  nodes: GNode[];
  edges: GEdge[];
}

const graphDataEl = document.getElementById("kb-graph-data") as HTMLScriptElement;
const graphData: GData = JSON.parse(graphDataEl.textContent || "{}");
const canvas = document.getElementById("kb-graph") as HTMLCanvasElement;
const tip = document.getElementById("kb-graph-tip") as HTMLDivElement;
const ctx = canvas.getContext("2d")!;

const W = () => canvas.clientWidth;
const H = () => canvas.clientHeight;
const dpr = window.devicePixelRatio || 1;

function resize() {
  canvas.width = W() * dpr;
  canvas.height = H() * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
window.addEventListener("resize", resize);
resize();

// ---- 物理模拟状态 ----
const pos = new Map<string, { x: number; y: number; vx: number; vy: number }>();
const nodes = new Map<string, GNode>();
graphData.nodes.forEach(n => {
  nodes.set(n.id, n);
  pos.set(n.id, {
    x: Math.random() * W(),
    y: Math.random() * H(),
    vx: 0,
    vy: 0,
  });
});

const links = graphData.edges.map(e => ({ a: pos.get(e.a)!, b: pos.get(e.b)! }));

const REPULSION = 1400; // 斥力系数
const SPRING = 0.06; // 弹簧系数
const SPRING_LEN = 110; // 弹簧自然长度
const CENTER = 0.004; // 中心引力
const FRICTION = 0.85; // 速度衰减

function step() {
  // 斥力（所有节点对）
  const arr = [...pos.values()];
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      const a = arr[i];
      const b = arr[j];
      let dx = a.x - b.x;
      let dy = a.y - b.y;
      let d2 = dx * dx + dy * dy;
      if (d2 < 1) d2 = 1;
      const f = REPULSION / d2;
      const d = Math.sqrt(d2);
      dx /= d;
      dy /= d;
      a.vx += dx * f;
      a.vy += dy * f;
      b.vx -= dx * f;
      b.vy -= dy * f;
    }
  }
  // 弹簧（边）
  for (const l of links) {
    const dx = l.b.x - l.a.x;
    const dy = l.b.y - l.a.y;
    const d = Math.sqrt(dx * dx + dy * dy) || 1;
    const f = SPRING * (d - SPRING_LEN);
    const fx = (dx / d) * f;
    const fy = (dy / d) * f;
    l.a.vx += fx;
    l.a.vy += fy;
    l.b.vx -= fx;
    l.b.vy -= fy;
  }
  // 中心引力 + 积分
  const cx = W() / 2;
  const cy = H() / 2;
  for (const n of nodes.values()) {
    const p = pos.get(n.id)!;
    p.vx += (cx - p.x) * CENTER;
    p.vy += (cy - p.y) * CENTER;
    p.vx *= FRICTION;
    p.vy *= FRICTION;
    p.x += p.vx;
    p.y += p.vy;
  }
}

function draw() {
  ctx.clearRect(0, 0, W(), H());
  // 边
  ctx.lineWidth = 1;
  ctx.strokeStyle = "rgba(140,150,170,0.35)";
  for (const l of links) {
    ctx.beginPath();
    ctx.moveTo(l.a.x, l.a.y);
    ctx.lineTo(l.b.x, l.b.y);
    ctx.stroke();
  }
  // 节点
  for (const n of nodes.values()) {
    const p = pos.get(n.id)!;
    ctx.beginPath();
    ctx.arc(p.x, p.y, n.size, 0, Math.PI * 2);
    ctx.fillStyle = n.color;
    ctx.fill();
    if (n.kind === "category") {
      ctx.strokeStyle = "rgba(0,0,0,0.15)";
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
    // 标签
    ctx.font = n.kind === "category" ? "700 13px sans-serif" : "12px sans-serif";
    ctx.fillStyle = "rgba(128,136,150,0.95)";
    ctx.textAlign = "center";
    ctx.fillText(n.label, p.x, p.y + n.size + 14);
  }
}

// ---- 交互：悬浮提示 / 点击跳转 ----
let hoverId: string | null = null;
let dragged: string | null = null;
let moved = false;

function hit(x: number, y: number): string | null {
  let best: string | null = null;
  let bestD = 900;
  for (const n of nodes.values()) {
    const p = pos.get(n.id)!;
    const d = (p.x - x) ** 2 + (p.y - y) ** 2;
    if (d < bestD) {
      bestD = d;
      best = n.id;
    }
  }
  return bestD < 625 ? best : null; // 25px 内命中
}

canvas.addEventListener("mousemove", e => {
  const r = canvas.getBoundingClientRect();
  const x = e.clientX - r.left;
  const y = e.clientY - r.top;
  const id = hit(x, y);
  if (dragged) {
    const p = pos.get(dragged)!;
    p.x = x;
    p.y = y;
    moved = true;
    hoverId = dragged;
  } else {
    hoverId = id;
  }
  if (hoverId) {
    const n = nodes.get(hoverId)!;
    tip.textContent = `${n.label}${n.kind === "article" ? " — 点击查看" : "（分类）"}`;
    tip.style.left = `${x + 14}px`;
    tip.style.top = `${y + 10}px`;
    tip.classList.add("show");
  } else {
    tip.classList.remove("show");
  }
});

canvas.addEventListener("mousedown", e => {
  const r = canvas.getBoundingClientRect();
  const id = hit(e.clientX - r.left, e.clientY - r.top);
  if (id) {
    dragged = id;
    moved = false;
    canvas.style.cursor = "grabbing";
  }
});

window.addEventListener("mouseup", e => {
  if (dragged && !moved) {
    const n = nodes.get(dragged);
    if (n?.url) window.location.href = n.url;
  }
  dragged = null;
  canvas.style.cursor = "grab";
});

canvas.addEventListener("mouseleave", () => {  tip.classList.remove("show");
  hoverId = null;
});

// ---- 主循环 ----
function loop() {
  for (let i = 0; i < 6; i++) step();
  draw();
  requestAnimationFrame(loop);
}
loop();
