---
author: ling-ou-pq
pubDatetime: 2026-09-14T21:00:00.000Z
title: 我的 AI 工作台：从零到全自动
featured: true
draft: false
tags:
  - 工具链
  - 自动化
description: 一台 Windows 机器上搭出 Hermes + Claude Code + Codex + PI 的完整 AI 工作台，以及每日自动记录上 GitHub 的流水线。
---

# 我的 AI 工作台：从零到全自动

## 工具链

| 工具 | 用途 |
|---|---|
| Hermes Agent | 主力 agent（跨会话记忆 + 技能系统）|
| Claude Code / Codex | IDE 内编程委派 |
| PI / PI-Desktop | 通用任务 agent |
| cc-switch | 中转站统一切换（Claude 桌面版/Codex）|

统一走中转站 API（当前 siyu.site，Anthropic Messages 协议），密钥全部走环境变量，不落盘。

## 每日自动化流水线

```
每天 22:00 Windows 计划任务（系统级，Hermes 关着也跑）
  → daily.sh：收集待办 + inbox 素材 + Hermes 今日会话摘要 + 文件活动快照
  → 生成当日 markdown 记录
  → 更新 GitHub 主页 README 的"今日"区块
  → 自动 commit + push（SSH）
  → Windows 弹窗提醒
```

两个仓库：`ling-ou-pq/ling-ou-pq`（主页）、`ling-ou-pq/daily-log`（每日记录）。

## 论文管线：真实实验

写论文时不编数字：PyTorch 真跑实验（MNIST 等 CPU 可承担的规模），所有数字落盘 `results.json`，引用全部核验，Word/PDF 自动渲染。示例成果：一篇完整的《基于在线知识蒸馏与动态早期退出的轻量化图像分类方法》就是在这套管线上产出的。

## 原则

1. **不造假**：热力图、提交记录、论文数据，全部真实。
2. **可复现**：每个自动化都有脚本，每个数字都可追溯。
3. **自动化是认真的**：能脚本化的绝不手动。