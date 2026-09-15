---
title: "LaTeX 入门速查"
description: "数学公式、表格、图片、引用与中文支持 —— 毕业/投稿前够用的最小集。"
category: "research"
tags: ["latex", "排版", "论文"]
pubDate: 2026-09-15
order: 2
---

## 结构骨架

```latex
\documentclass[11pt]{article}
\usepackage[UTF8]{ctex}          % 中文支持
\usepackage{graphicx, booktabs, amsmath}
\title{中文小论文}
\author{ling-ou-pq}
\begin{document}
\maketitle
\section{引言}
\section{方法}
\section{实验}
\section{结论}
\end{document}
```

## 数学公式

```latex
行内公式：$E = mc^2$
独立公式：
\begin{equation}
  \text{Accuracy} = \frac{TP + TN}{TP + TN + FP + FN}
  \label{eq:acc}
\end{equation}
引用：\ref{eq:acc}

常用：\sum_{i=1}^n  \prod  \int_a^b  \frac{a}{b}
      \hat{x}  \bar{y}  \mathbf{W}  \mathcal{L}
```

## 表格（booktabs 三线表）

```latex
\begin{table}[htbp]
\centering
\caption{模型对比}
\begin{tabular}{lccc}
\toprule
模型 & 参数量 & 准确率 & 耗时 \\
\midrule
Baseline & 20,522 & 99.62\% & 8s \\
Ours     & 57,748 & 98.94\% & 5s \\
\bottomrule
\end{tabular}
\label{tab:compare}
\end{table}
```

## 图片

```latex
\begin{figure}[htbp]
  \centering
  \includegraphics[width=0.8\linewidth]{figures/acc.pdf}
  \caption{训练曲线对比}
  \label{fig:acc}
\end{figure}
```

## 引用文献

```latex
\bibliographystyle{unsrt}       % 按引用顺序排序
\bibliography{refs}             % refs.bib

% refs.bib 里：
@article{lecun1998gradient,
  author  = {LeCun, Yann and others},
  title   = {Gradient-based learning applied to document recognition},
  journal = {Proceedings of the IEEE},
  year    = {1998}
}
```

## 踩坑清单

| 坑 | 解法 |
|---|---|
| 中文乱码 | `\usepackage[UTF8]{ctex}`，文件存 UTF-8 |
| 表格超出页宽 | 用 `tabularx` + 指定列宽，或调 `\small` |
| 图片不显示 | 路径用相对路径，编译两次 |
| 引用显示 ?? | 编译两次（LaTeX → BibTeX → LaTeX → LaTeX） |
| 中文字体缺失 | 换 XeLaTeX 编译引擎（`xelatex`） |