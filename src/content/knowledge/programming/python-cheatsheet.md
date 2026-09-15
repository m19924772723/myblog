---
title: "Python 速查手册"
description: "高频语法、内置函数、文件与异常处理的浓缩速查，附实用代码片段。"
category: "programming"
tags: ["python", "速查", "入门"]
pubDate: 2026-09-15
order: 1
---

## 基础语法三连

```python
# 列表推导式
squares = [x * x for x in range(10) if x % 2 == 0]

# 字典合并（3.9+）
a = {"x": 1}; b = {"y": 2}; merged = a | b

# 解包
head, *rest = [1, 2, 3, 4]   # head=1, rest=[2,3,4]
```

## 常用内置函数

| 函数 | 用途 | 示例 |
|---|---|---|
| `enumerate` | 带索引遍历 | `for i, v in enumerate(items)` |
| `zip` | 并行遍历 | `for a, b in zip(xs, ys)` |
| `sorted` | 排序（可逆） | `sorted(d.items(), key=lambda kv: kv[1])` |
| `map/filter` | 映射/过滤 | `list(map(str, [1,2]))` |
| `isinstance` | 类型判断 | `isinstance(x, (int, float))` |

## 文件读写

```python
# 推荐 with 上下文管理器（自动关闭）
with open("data.txt", "r", encoding="utf-8") as f:
    for line in f:
        print(line.strip())

# JSON 序列化
import json
data = {"loss": 0.23, "acc": 0.98}
with open("results.json", "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)
```

## 异常处理

```python
try:
    result = risky_operation()
except (ValueError, TypeError) as e:
    print(f"参数问题: {e}")
except Exception as e:          # 兜底，避免静默失败
    print(f"未知错误: {e}")
    raise                        # 保留堆栈
else:
    print("无异常时执行")
finally:
    cleanup()
```

## 调试小技巧

```python
# 打印完整 traceback
import traceback
traceback.print_exc()

# 慢代码定位（长时间训练也适用）
import faulthandler
faulthandler.dump_traceback_later(240, exit=False)  # 4 分钟超时打堆栈
```

> [!tip] 速查原则
> 记不住就查，但**常用的一定要肌肉记忆**：推导式、with、解包、异常捕获是写代码时出现频率最高的四件套。