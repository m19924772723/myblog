import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";
import config from "@/config";

export const BLOG_PATH = "src/content/posts";

const posts = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: `./${BLOG_PATH}` }),
  schema: ({ image }) =>
    z.object({
      author: z.string().default(config.site.author),
      pubDatetime: z.date(),
      modDatetime: z.date().optional().nullable(),
      title: z.string(),
      featured: z.boolean().optional(),
      draft: z.boolean().optional(),
      tags: z.array(z.string()).default(["others"]),
      ogImage: image().or(z.string()).optional(),
      description: z.string(),
      canonicalURL: z.string().optional(),
      hideEditPost: z.boolean().optional(),
      timezone: z.string().optional(),
    }),
});

const pages = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/content/pages" }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    ogImage: z.string().optional(),
    canonicalURL: z.string().optional(),
  }),
});

const workbench = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/content/workbench" }),
  schema: z.object({
    title: z.string(),
    date: z.string(),
    type: z.enum(["todo", "record", "note"]).default("record"),
  }),
});

// ===== 知识库 =====
// 四系统之一：编程 / 科研 / AI / 效率 / 学习 五大类学习笔记
export const KNOWLEDGE_PATH = "src/content/knowledge";
export const KNOWLEDGE_CATEGORIES = [
  {
    id: "programming",
    name: "编程",
    icon: "💻",
    color: "#4d6bfe",
    description: "Python、Git、编辑器与开发效率速查",
  },
  {
    id: "research",
    name: "科研",
    icon: "🔬",
    color: "#7c3aed",
    description: "论文写作、LaTeX 与科研工作流",
  },
  {
    id: "ai",
    name: "AI",
    icon: "🤖",
    color: "#0ea5e9",
    description: "提示词工程、大模型 API 应用指南",
  },
  {
    id: "productivity",
    name: "效率",
    icon: "⚡",
    color: "#f59e0b",
    description: "环境配置、命令行与日常效率工具",
  },
  {
    id: "learning",
    name: "学习",
    icon: "📚",
    color: "#10b981",
    description: "学习方法论与知识管理体系",
  },
] as const;

const knowledge = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: `./${KNOWLEDGE_PATH}` }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.enum([
      "programming",
      "research",
      "ai",
      "productivity",
      "learning",
    ]),
    tags: z.array(z.string()).default([]),
    pubDate: z.date(),
    updatedDate: z.date().optional(),
    order: z.number().default(99),
    draft: z.boolean().optional(),
  }),
});

export const collections = { posts, pages, workbench, knowledge };
