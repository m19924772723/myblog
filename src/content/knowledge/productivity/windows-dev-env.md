---
title: "Windows 开发者环境配置"
description: "目录约定、代理、包管理器与工具链 —— 一套可长期复用的 Windows 开发底座。"
category: "productivity"
tags: ["windows", "环境", "开发"]
pubDate: 2026-09-15
order: 1
---

## 目录约定（先定规矩）

```text
D:\code\<project>          项目源码（一个项目一个目录）
D:\code\environment        环境/工具链/SDK/CLI 垫片
  ├─ nodejs                 Node.js + npm + pnpm
  ├─ Git                     Git（git-bash）
  ├─ gh                      GitHub CLI
  └─ cache\pnpm             pnpm 全局缓存
```

**原则**：环境装进 `D:\code\environment`，不散落到 `%LOCALAPPDATA%` 或 `C:\`。

## 代理（curl/git 不读系统代理！）

Windows 系统代理设置只对浏览器生效，CLI 要显式指定：

```bash
export http_proxy=http://127.0.0.1:7892
export https_proxy=http://127.0.0.1:7892
curl --proxy http://127.0.0.1:7892 https://api.github.com  # 单次
```

反而 localhost 请求要绕开代理：`curl --noproxy '*' http://localhost:3000`。

## 包管理器

- **npm 换镜像**：`npm config set registry https://registry.npmmirror.com`
- **pnpm**：更快、磁盘友好，`pnpm install` 用 `pnpm-lock.yaml` 锁定版本
- **GitHub 拉不动** → 先试 `--proxy http://127.0.0.1:7892`，再考虑镜像

## Git-bash 注意事项

- 终端是 POSIX 语法（`ls`、`$HOME`、单引号），不是 PowerShell
- 给原生命令传路径用 `C:/...` 正斜杠原生格式，避免 MSYS 转换问题
- 交互式 CLI（如设备码登录）优先走非交互路径（`--with-token`、配置文件）

## 验证清单

```bash
node -v && npm -v && pnpm -v      # Node 工具链
git --version                     # Git
gh --version && gh auth status    # GitHub CLI + 登录态
ssh -T git@ssh.github.com -p 443  # SSH over 443（受限网络）
```