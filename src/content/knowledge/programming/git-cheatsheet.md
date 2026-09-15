---
title: "Git 命令速查"
description: "日常 90% 场景覆盖：提交、分支、撤销、远程、协作，附常见事故自救。"
category: "programming"
tags: ["git", "github", "速查"]
pubDate: 2026-09-15
order: 2
---

## 每日必用

```bash
git status                    # 先看状态！
git add -A && git commit -m "feat: 描述"   # 提交
git pull --rebase             # 拉取（线性历史）
git push                      # 推送
git log --oneline -5          # 最近 5 条提交
```

## 分支操作

```bash
git switch -c feature/x       # 新建并切换（旧命令 checkout -b）
git switch main               # 切回
git merge feature/x           # 合并
git branch -d feature/x       # 删除已合并分支
git push origin --delete feature/x   # 删除远程分支
```

## 撤销（三件套，按严重程度）

```bash
git restore file.txt          # 丢弃工作区改动（未 add）
git restore --staged file.txt # 取消暂存（已 add）
git reset --hard HEAD~1       # 回退上一个提交并丢弃改动（慎重！）
git revert <hash>             # 安全回退：生成反向提交（已推送时用这个）
```

## 远程与推送

```bash
git remote -v                          # 查看远程
git remote add origin <url>            # 关联仓库
git push -u origin main                # 首次推送并建立跟踪
git push origin main                   # 常规推送
```

## 常见事故自救

| 事故 | 自救命令 |
|---|---|
| commit 信息写错了 | `git commit --amend -m "新信息"` |
| 少提交了一个文件 | `git add 漏掉的 && git commit --amend` |
| 想找回误删的分支 | `git reflog` 找到 hash → `git switch -c 分支名 <hash>` |
| 提交到了错误分支 | `git reset --soft HEAD~1` → `git switch 正确分支` → 重新 commit |

> [!warning] 两条铁律
> 1. **推送前的提交随便改，推送后的提交别 `reset`**，用 `revert`。
> 2. 不确定就用 `git status` / `git reflog` 先看，别盲打命令。

## 与 GitHub 热力图相关

GitHub 只统计**默认分支**上、commit 邮箱与账号绑定的提交，私有仓库还要在设置中打开贡献显示。想点亮热力图，就把真实内容的小提交做起来（比如每天的学习笔记、daily log），比空提交刷图有意义得多。