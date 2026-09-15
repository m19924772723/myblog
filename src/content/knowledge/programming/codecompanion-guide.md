---
title: "码伴 CodeCompanion.AI 使用指南"
description: "桌面 AI 编程助手：装什么、怎么用、能做什么，与 Cursor/Claude Code 的定位对比。"
category: "programming"
tags: ["AI", "编程助手", "工具"]
pubDate: 2026-09-15
order: 4
---

## 它是什么

**码伴.AI（CodeCompanion.AI）** 是一款基于 AI 的**桌面编程助手应用**：不是陪你聊天的补全插件，而是"你说需求、它直接动手"的编程副驾驶——读取/编写/修改本地代码、执行 shell 命令、搭建项目、跑测试。

- 官网：https://codecompanion.ai
- 开源仓库：https://github.com/codecompanion-ai/code-companion
- 定位：ChatGPT 驱动的桌面 AI 编码助手（2023 年起收录于各类 AI 工具目录）

## 安装

1. 官网下载对应平台安装包（Windows / macOS / Linux）
2. 安装后打开，主界面即**聊天窗口**
3. 首次使用按提示配置 AI 模型（早期版本基于 OpenAI GPT 系）

## 基本用法（三步）

```text
1. 用自然语言描述任务："创建一个 Express 项目，带 .gitignore 和 Dockerfile"
2. AI 自动执行：建文件、跑 npm install、生成配置
3. 检查结果，继续追问或让它修改
```

常见指令示例：

| 场景 | 说法 |
|---|---|
| 建项目 | "搭建 Rails/Django/Express 项目骨架" |
| 配环境 | "生成 .gitignore + Dockerfile + CI/CD 配置" |
| 查代码 | "找到处理登录的逻辑并解释" |
| 改代码 | "给这个控制器加参数校验" |
| 数据库 | "用自然语言查：最近 7 天订单数按天分组"（NL→SQL） |
| 部署 | "打包部署到服务器 / 发布到 S3" |

## 核心能力清单

- 📝 代码读取、编写、修改（多语言多框架）
- ⌨️ 执行 shell 命令（装依赖、跑脚本、配置环境）
- 🗂 项目搭建与文件生成
- 🧠 自然语言转 SQL
- 🔍 代码库搜索 + 网页信息提取
- ⚙️ 自动化任务（测试、依赖更新、漏洞排查）

## 与同类工具定位对比

| 工具 | 形态 | 特点 |
|---|---|---|
| **码伴 CodeCompanion** | 桌面应用 | 聊天式指挥 AI 直接操作本机，老牌全能选手 |
| Cursor | IDE | AI 原生编辑器，补全 + 对话 + 多文件编辑一体 |
| Claude Code / Codex | CLI | 终端里跑代码任务，适合自动化/脚本化工作流 |
| GitHub Copilot | IDE 插件 | 补全最强，对话较弱 |

> [!tip] 选择建议
> 喜欢"给指令、看它干活"的聊天式体验 → 码伴；依赖补全和编辑器内联体验 → Cursor；要跑自动化批处理/集成到脚本 → Claude Code 或 Codex CLI。

## 注意

- 桌面应用 ≠ 网页服务：需要下载安装，不能直接在浏览器里用
- 它会**执行本机命令**：重要操作前确认它要跑什么，权限边界想清楚
- 依赖外部 AI 模型 API，网络与额度（如 OpenAI key）需要自行准备