---
title: "VS Code 效率技巧"
description: "多光标、命令面板、代码片段、git 集成，把编辑器调教成顺手的样子。"
category: "programming"
tags: ["vscode", "编辑器", "效率"]
pubDate: 2026-09-15
order: 3
---

## 必须记住的快捷键

| 快捷键 | 作用 |
|---|---|
| `Ctrl+P` | 快速打开文件（输名字直达） |
| `Ctrl+Shift+P` | 命令面板（一切操作入口） |
| `Ctrl+D` | 选中下一个相同单词（配合改变量名） |
| `Alt+Click` | 多光标 |
| `Ctrl+Shift+L` | 全选所有相同单词 |
| `Alt+↑/↓` | 整行上下移动 |
| `Ctrl+/` | 注释/取消注释 |
| `F2` | 重命名符号（全项目联动） |

## 多光标改名的正确姿势

改变量名**永远优先 F2**（联想改名，智能）；`Ctrl+D` 适合一次性批量改文本相同的片段。

## 项目级搜索

```text
Ctrl+Shift+F   全局搜索（默认排除 node_modules/.git）
搜索框右上角：正则 / 大小写 / 全字匹配
```

## 实用设置（settings.json）

```json
{
  "editor.formatOnSave": true,
  "editor.minimap.enabled": false,
  "files.trimTrailingWhitespace": true,
  "explorer.confirmDelete": false,
  "workbench.colorTheme": "GitHub Dark Default",
  "terminal.integrated.defaultProfile.windows": "Git Bash"
}
```

## 推荐扩展组合

- **中文语言包**：Microsoft 官方
- **Prettier**：前端格式化（保存即格式化）
- **Python / Pylance**：Python 静态检查
- **ESLint**：JS 规范检查
- **GitLens**：看代码责任人与历史
- **Error Lens**：错误直接显示在行尾

## 终端集成

在项目根目录 `Ctrl+\`` 打开内置终端，直接跟 `git`、`npm`、`python` 交互，不必来回切窗口。把默认 shell 设为 Git Bash（Windows 下体验最好）。