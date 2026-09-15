---
title: "命令行速查手册"
description: "每日高频命令：文件、进程、网络、磁盘，Windows Git-bash 环境实测。"
category: "productivity"
tags: ["命令行", "终端", "速查"]
pubDate: 2026-09-15
order: 2
---

## 文件与目录

```bash
ls -la                    # 详细列表（含隐藏文件）
du -sh <dir>              # 目录占用（-sh = 汇总人类可读）
find . -name "*.py"       # 按名找文件
grep -rn "TODO" src/      # 内容搜索（-r 递归 -n 行号）
head -20 / tail -20       # 头尾
```

## 进程管理

```bash
netstat -ano | grep ':3000' | grep -i listen   # 谁占着 3000 端口（拿 PID）
ps aux | grep node                              # 找进程
kill -9 <PID>                                   # 强杀（Windows 下 taskkill /F /PID <PID> 亦可）
```

## 网络诊断

```bash
curl -s -o /dev/null -w '%{http_code}\n' http://localhost:3000   # 只看状态码
curl -s -m 15 --noproxy '*' http://localhost:4321/                # 绕过代理测本地
ping -n 3 github.com                                               # 连通性
ssh -T git@ssh.github.com -p 443                                   # SSH 隧道测试
```

## 磁盘与占用

```bash
df -h                       # 各盘剩余
du -sh D:/code/* | sort -rh | head -10   # 找出最大的目录（清理目标）
```

## 重定向与管道

```bash
cmd 2>&1 | tee output.log   # 同时屏幕 + 日志
cmd > /dev/null 2>&1        # 静默（错误也吞）
cat a.txt b.txt | sort -u   # 合并去重
```

## 三秒救命组合

```text
端口被占  →  netstat -ano | grep :端口  →  kill 对应 PID
命令找不到 →  检查 PATH / which 命令（git-bash 用 which，不用 where）
中文乱码  →  iconv -f GBK -t UTF-8 或 chcp 65001
删不掉的目录 → 先查占用进程（node/explorer），再 rd /s /q
```

> [!tip]
> 别背命令——**记住"找什么"比记住"怎么找"重要**：忘了用什么，先 `man` / `--help`，或在博客知识库搜"速查"。