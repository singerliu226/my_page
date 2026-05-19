# 刘唱 · AI Product Portfolio

个人品牌站与作品集源代码。

线上版本：尚未部署（计划放到 Zeabur / Vercel）。

## 技术栈

React 19 + Vite 6 + React Router 7 + Tailwind 3 + Ant Design 6 + Vitest。

## 运行

```bash
npm install
npm run dev      # 默认 http://localhost:5174
npm run build    # 产物输出到 dist/
```

## 目录

```
personal-homepage/
├── public/                 # 头像、简历等静态资源
├── src/
│   ├── pages/
│   │   ├── portfolio/      # 首页与详情页（method / experience / works）
│   │   └── rednote/        # RedNote Collector 演示页
│   ├── components/portfolio/
│   ├── data/
│   │   ├── portfolio/      # 站点文案结构化数据
│   │   └── rednote/        # 演示用的小红书采集快照
│   ├── styles/
│   └── hooks/
├── docs/plans/             # 设计与实现记录
├── index.html
└── vite.config.js
```

## 路由

- `/` — 首页（hero + experience timeline + contact）
- `/method` — 工作方法
- `/experience` — 关键经历
- `/works` — 精选作品 + 案例拆解
- `/projects/rednote` — RedNote Collector 工具演示页（基于本地 demo 数据）

## 关于 RedNote Collector 演示页

此页面是一份**演示快照**：包含 45 条 "人生 ERP 小红书调研" 主题下采集到的笔记元数据，
可在线感受筛选、浏览与导出三步流程。搜索采集、登录态接入、笔记正文与评论抓取这些需要后端的能力，
需要在本地运行独立的 rednote-collector 服务时启用，本站点不连接任何线上接口。
