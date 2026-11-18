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
├── public/
│   ├── play/               # 后花园里能直接玩的小游戏和交互示例（由同步脚本生成）
│   ├── media/              # 后花园的两部短片和封面（由同步脚本生成）
│   └── …                   # 头像、简历、项目截图等静态资源
├── scripts/garden/         # 后花园素材同步脚本和来源记录 manifest.json
├── src/
│   ├── pages/
│   │   ├── portfolio/      # 首页与各栏目页（experience / works / garden / notes）
│   │   └── collector/      # RedNote Collector 真实工具工作区
│   ├── components/portfolio/
│   ├── content/essays/     # 心得长文的 Markdown 正文
│   ├── data/
│   │   └── portfolio/      # 站点文案结构化数据（content / garden / essays）
│   ├── styles/
│   └── hooks/
├── docs/plans/             # 设计与实现记录
├── index.html
└── vite.config.js
```

## 路由

- `/` — 首页（hero + experience timeline + contact）
- `/experience` — 关键经历（实习、个人项目、训练营）
- `/works` — 项目 / vibe coding
- `/garden` — 后花园：四个小游戏、两部 AI 短片
- `/notes` — 产品心得与工作方法；`/notes/:slug` 是单篇长文
- `/contact` — 联系方式
- `/method` — 旧地址，自动跳到 `/notes`
- `/play/<名字>/` — 游戏和交互示例本体，静态文件，不经过 React 路由
- `/projects/rednote` — RedNote Collector 真实工具工作区
- `/projects/rednote/collections` — 采集数据管理
- `/projects/rednote/export` — 导出中心

## 关于 RedNote Collector

`/projects/rednote` 加载真实工具工作区，不再读取演示快照数据。搜索、采集、数据管理与导出界面
会直接调用 `/api` 下的后端接口；如果部署环境没有挂载后端服务，页面仍会正常打开，但执行采集类操作时
会提示后端服务不可用。

## 后花园的素材

`public/play/` 和 `public/media/` 里的文件不是手写的，是从本机的鹅创营目录同步过来的成品。
源目录默认是 `~/Desktop/鹅创营`，脚本只读不改。

```bash
node scripts/garden/sync.mjs                  # 四个小游戏、B 站示例页、卡片配图
node scripts/garden/sync.mjs films            # 两部短片转码和封面（要 macOS 自带的 swift）
node scripts/garden/sync.mjs eyuzu tongsui    # 只同步指定的几项
```

每项素材的来源路径、版本和校验值记在 `scripts/garden/manifest.json`。

- 鹅羽鮨放的是单机包：正式版 `server.js` 原样搬进页面里运行，店里只有电脑客人。联机版要一个常驻的 Node 服务，得另外部署，不在这个仓库里。
- 糖水小铺的背景音乐保留原曲。以后要撤下它，加 `--mute-tongsui-bgm` 重新同步，会换成静音占位。
- 页面上的文字和数字在 `src/data/portfolio/garden.js`，素材署名也在那里。
- 新增长文：在 `src/content/essays/` 放一篇 Markdown，再到 `src/data/portfolio/essays.js` 登记标题和导语。

