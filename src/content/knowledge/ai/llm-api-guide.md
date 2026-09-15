---
title: "大模型 API 接入指南"
description: "OpenAI 兼容 / Anthropic 协议的端点、鉴权、参数与自托管环境实测经验。"
category: "ai"
tags: ["api", "llm", "openai", "anthropic"]
pubDate: 2026-09-15
order: 2
---

## 两种主流协议

### OpenAI 兼容（最多）

```bash
POST /v1/chat/completions
Authorization: Bearer $API_KEY
Content-Type: application/json

{"model": "deepseek-v4-flash", "messages": [{"role": "user", "content": "你好"}]}
```

### Anthropic Messages（Claude 系）

```bash
POST /v1/messages
x-api-key: $API_KEY
anthropic-version: 2023-06-01
Content-Type: application/json

{"model": "claude-sonnet-5", "max_tokens": 1024,
 "messages": [{"role": "user", "content": "你好"}]}
```

## 鉴权三原则

1. **密钥走环境变量**：`export SIYU_API_KEY=...`，绝不写进代码/配置文件
2. **临时密钥文件用完即删**，不经过命令行回显
3. 不同服务独立密钥，一个泄露不影响全部

## 关键参数

| 参数 | 作用 | 建议 |
|---|---|---|
| `temperature` | 随机性 | 摘要/代码 0.2；创意 0.8 |
| `max_tokens` | 输出上限 | 按任务预估，别默认最小 |
| `top_p` | 核采样 | 一般保持默认 1 |
| `stream` | 流式输出 | 交互场景开，长文必开 |

## 中转站 vs 官方直连

- **官方直连**：稳定、延迟低，但国内支付/网络是门槛
- **中转站**：按量付费、模型多，但要验证：模型列表是否真实、额度是否透明、**辅助客户端是否也走同一网关**

> [!warning] 切换供应商的隐藏坑
> 主模型配置切了 ≠ 全部流量切了。辅助/审批子客户端可能还连旧网关——换完供应商务必查日志确认**所有出口**都指向新地址，必要时重启进程。

## 实测链路（2026-09 本机）

```text
Hermes      → siyu.site  /v1/messages   (anthropic_messages)
Claude Code → cc-switch 127.0.0.1:15721 → api.hcnsec.cn (DeepSeek-V4-Flash)
PI          → siyu.site 独立密钥
```

自测命令：

```bash
curl -s -X POST https://siyu.site/v1/chat/completions \
  -H "Authorization: Bearer $API_KEY" -H "Content-Type: application/json" \
  -d '{"model":"deepseek-v4-flash","messages":[{"role":"user","content":"ping"}]}'
```