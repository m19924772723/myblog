import { defineAstroPaperConfig } from "./src/types/config";

export default defineAstroPaperConfig({
  site: {
    url: "https://ling-ou-pq.github.io/myblog/",
    title: "ling-ou-pq · 博客",
    description: "电子信息 / 人工智能方向研究生的个人博客与工作台——每日记录、学习笔记、实验报告与随笔。",
    author: "ling-ou-pq",
    profile: "https://github.com/ling-ou-pq",
    ogImage: "default-og.jpg",
    lang: "zh-cn",
    timezone: "Asia/Shanghai",
    dir: "ltr",
  },
  posts: {
    perPage: 8,
    perIndex: 5,
    scheduledPostMargin: 15 * 60 * 1000,
  },
  features: {
    lightAndDarkMode: true,
    dynamicOgImage: true,
    showArchives: true,
    showBackButton: true,
    editPost: {
      enabled: true,
      url: "https://github.com/ling-ou-pq/myblog/edit/main/",
    },
    search: "pagefind",
  },
  socials: [
    { name: "github", url: "https://github.com/ling-ou-pq" },
    { name: "mail", url: "mailto:ou13787629125@163.com" },
  ],
  shareLinks: [
    { name: "whatsapp", url: "https://wa.me/?text=" },
    { name: "x", url: "https://x.com/intent/post?url=" },
    { name: "telegram", url: "https://t.me/share/url?url=" },
  ],
});