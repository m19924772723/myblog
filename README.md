# ling-ou-pq 的个人博客 + 工作台

基于 [astro-paper](https://github.com/satnaing/astro-paper)（★5k+）深度定制的个人站点：
**博客 + 工作台一体化**，内容全 markdown 驱动，带 Decap CMS 图形后台。

## 功能

- 📝 博客：文章、标签、归档、搜索（pagefind）、RSS、暗色/亮色模式
- 🗂 工作台（`/workbench`）：每日待办 + 每日记录（由 `D:\code\workbench\scripts\daily.sh` 自动同步）
- 🎛 后台（`/admin`）：Decap CMS 网页编辑器，直接读写仓库 markdown 并提交 GitHub
- 🔄 自动部署：GitHub Actions 推送到 main 即构建并发布到 GitHub Pages

## 本地开发

```bash
npm install            # 首次
npm run dev            # 开发服务器 http://localhost:4321
npm run build          # 构建到 dist/（含 astro check + pagefind 索引）
npm run preview        # 预览构建产物
```

### CMS 后台本地使用

```bash
npx decap-server       # 启动本地后端（端口 8081）
# 然后打开 http://localhost:4321/admin
```

生产环境后台需配置 GitHub OAuth（decapbridge 或 GitHub OAuth App），见 `public/admin/config.yml` 注释。

## 内容结构

```
src/content/
├── posts/       博客文章（frontmatter: author, pubDatetime, title, tags, description, draft）
├── pages/       独立页面（about 等）
└── workbench/   工作台内容（todo / 每日记录 / 笔记，由 daily.sh 同步）
```

## 每日工作台流水线

`D:\code\workbench\scripts\daily.sh`（Windows 计划任务，每天 22:00）：
收集待办 + Hermes 会话摘要 + 文件活动快照 → 生成记录 → 同步到本仓库 `src/content/workbench/` →
提交三个仓库（主页、daily-log、myblog）→ 弹窗提醒。GitHub Actions 收到 push 后自动重建站点。

## 部署

- 仓库：https://github.com/ling-ou-pq/myblog
- 站点：GitHub Pages（仓库 Settings → Pages → 部署源选 GitHub Actions）

## 致谢

- [astro-paper](https://github.com/satnaing/astro-paper) — 基础主题
- [Decap CMS](https://decapcms.org/) — Git 内容后台
