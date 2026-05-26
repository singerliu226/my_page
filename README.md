# 刘唱 · AI Product Portfolio

个人品牌站与作品集源代码。

线上版本：https://pageofme.zeabur.app/

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
│   │   └── collector/      # RedNote Collector 真实工具工作区
│   ├── components/portfolio/
│   ├── data/
│   │   └── portfolio/      # 站点文案结构化数据
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
- `/projects/rednote` — RedNote Collector 真实工具工作区
- `/projects/rednote/collections` — 采集数据管理
- `/projects/rednote/export` — 导出中心

## 关于 RedNote Collector

`/projects/rednote` 加载真实工具工作区，不再读取演示快照数据。搜索、采集、数据管理与导出界面
会直接调用 `/api` 下的后端接口；如果部署环境没有挂载后端服务，页面仍会正常打开，但执行采集类操作时
会提示后端服务不可用。
