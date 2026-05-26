/**
 * @fileoverview 个人品牌站的结构化内容数据。
 * 将文案与展示组件解耦，避免页面组件里混入大量静态文本，
 * 便于后续持续补充项目截图、GitHub 链接和新的案例材料。
 */

/**
 * 首页导航配置。
 * 使用锚点而非多页面跳转，是为了让招聘方在一次滚动内快速建立完整印象。
 */
export const portfolioNavItems = [
  { key: 'method', label: '工作方法', href: '/method' },
  { key: 'experience', label: '关键经历', href: '/experience' },
  { key: 'works', label: '我做的项目', href: '/works' },
];

/**
 * 首页英文 tab 配置。
 * 顶部 tab 只保留少量关键入口，便于在首页与作品页之间快速切换。
 */
export const portfolioHomeTabs = [
  { key: 'about', label: 'ABOUT', href: '#about' },
  { key: 'timeline', label: 'TIMELINE', href: '#timeline' },
  { key: 'project', label: 'PROJECT', href: '/works' },
  { key: 'contact', label: 'CONTACT', href: '#contact' },
];

/**
 * 站点核心内容。
 * 统一维护主叙事、量化成果、作品链接和联系信息，
 * 让视觉层始终围绕“AI 产品落地能力”而不是简历罗列来展开。
 */
export const portfolioContent = {
  hero: {
    eyebrow: 'AI Product Builder / Editorial Thinker',
    name: '刘唱',
    headline: '把内容洞察、用户理解与 AI 能力，变成真正被使用的产品。',
    summaryLines: [
      '复旦大学新闻与传播硕士，做过媒体内容、AI 产品实习与多次独立上线。',
      '更关心真实需求和落地结果，而不是工具堆砌。',
    ],
    portrait: {
      src: '/profile/liuchang-portrait.jpg',
      alt: '刘唱正式照片',
      note: 'Fudan · Journalism & Communication',
    },
    quickFacts: [
      { label: '院校', value: '复旦大学 · 新闻与传播' },
      { label: '专注', value: 'AI 产品 · 内容理解 · 用户研究' },
      { label: '在做', value: 'RAG / Agent 真实落地' },
      { label: '坐标', value: '上海' },
    ],
    timeline: [
      {
        labelTime: '2015 — 2020',
        detailTime: '2015 — 2020',
        title: '上海师范大学 · 经济学',
        summary: '建立商业分析与结构化思考底层能力。',
        details: ['经济学训练为后续的商业判断、结构化分析与产品思维打下基础。'],
      },
      {
        labelTime: '2024 — 2026',
        detailTime: '2024 — 2026',
        title: '复旦大学 · 新闻与传播硕士',
        summary: '系统训练内容理解、传播判断与用户洞察。',
        details: ['系统沉淀内容研究、传播判断与用户洞察能力，形成更稳定的问题理解框架。'],
      },
      {
        labelTime: '2024.11 — 2025.04',
        detailTime: '2024.11 — 2025.04',
        title: '人民日报',
        summary: '在采访策划与传播反馈里理解信任和表达。',
        details: ['参与访谈内容策划、直播数据分析与稿件主笔，理解内容信任与传播反馈之间的关系。'],
      },
      {
        labelTime: '2025.06 — 2025.11',
        detailTime: '2025.06 — 2025.11',
        title: '界面财联社',
        summary: '进入垂类模型产品，开始系统做评测与提示词迭代。',
        details: ['数据准备、提示词工程、模型评估与 A/B 测试，让 AI 产品验证能力逐步成型。'],
      },
      {
        labelTime: '2025.11 — 2026.02',
        detailTime: '2025.11 — 2026.02',
        title: 'FuturX',
        summary: '第一次把调研、PRD、数据与上线迭代真正连成闭环。',
        details: ['需求调研、PRD、数据准备、提示词设计与测试上线，第一次完整连成产品闭环。'],
      },
      {
        labelTime: '2025 — 至今',
        detailTime: '2025 — 至今',
        title: '个人 AI 项目',
        summary: '围绕 RAG、Agent 与真实业务持续做独立上线实验。',
        details: ['围绕 RAG、Agent 与真实业务需求持续做独立产品实验，把想法推进到可验证状态。'],
        href: '/works',
      },
    ],
  },
  homeFeaturedProject: {
    eyebrow: 'Featured AI Project',
    title: '新传 Mind',
    subtitle: '考研备考 AI 专家系统',
    summary:
      '我把院校真题分析、专业知识库、AI 作答、练习评估和反馈飞轮收束成一个真正能帮助学生备考的 AI 产品系统。',
    highlights: [
      '围绕 30+ 名学生访谈拆出真实备考场景，而不是先堆功能',
      '完成知识库入库、RAG 作答、真题分析与四维评估的端到端闭环',
      '持续积累回归集与 SFT 数据，让系统进入可验证、可迭代阶段',
    ],
    href: '/works',
    actionLabel: '查看完整项目',
  },
  methods: [
    {
      title: '先把问题问准',
      badge: 'User Insight',
      description:
        '我习惯先通过访谈、观察和结构化追问把需求拆开，而不是一上来堆功能。无论是数字分身、恋爱测试还是备考系统，都会先判断用户真正卡在哪里。',
    },
    {
      title: '把 AI 能力落到可信闭环',
      badge: 'AI Product Delivery',
      description:
        '我关注的不只是“能不能生成”，而是结果是否可信、流程是否可控、用户是否愿意持续使用。所以会把知识库策略、评估集、人工反馈和产品交互一起设计。',
    },
    {
      title: '用数据验证取舍',
      badge: 'Validation',
      description:
        '我会把判断转成可验证指标。包括标注一致性、留存、功能使用率、转化率、对话轮次、转人工率等，让产品决策不只停留在直觉层面。',
    },
    {
      title: '兼顾表达与转化',
      badge: 'Narrative Design',
      description:
        '内容、传播与界面不是包装层，而是产品的一部分。我的页面通常会优先讲清“这是什么、为什么值得用、下一步该做什么”，让复杂能力快速被理解。',
    },
  ],
  experiences: [
    {
      period: '2025.11 — 2026.02',
      organization: 'FuturX',
      role: 'AI 产品实习生',
      summary:
        '参与“火炬智库”董事长数字分身项目，覆盖需求调研、PRD、数据准备、提示词设计、原型沟通、测试评估与上线后优化。',
      highlights: [
        '深访 10+ 名员工与高层，输出 5 份 PRD，明确产品方向与功能边界',
        '主导收集 200+ 份核心资料，结合脚本与人工校验把数据准确率提升到 98%',
        '围绕决策支持与思维训练设计 30+ 条场景提示词，增强模型场景适配能力',
      ],
    },
    {
      period: '2025.06 — 2025.11',
      organization: '界面财联社',
      role: 'AI 产品实习生',
      summary:
        '参与“小财神 Pro”垂类模型产品的数据准备、提示词工程、模型评估和在线 A/B 测试，形成对模型效果与商业指标联动的理解。',
      highlights: [
        '通过特征向量与关键词匹配完成数据去重，并以抽样标注推动一致性提升至 95%',
        '使用 few-shot 与 CoT 持续迭代系统提示词，优化模型表达与场景稳定性',
        '参与线上 5% 用户 A/B 评测，跟踪次日留存 60%、核心功能使用率 70% 等指标',
      ],
    },
    {
      period: '2024.11 — 2025.04',
      organization: '人民日报',
      role: '顶科协项目实习生',
      summary:
        '参与顶尖科学家 IP 访谈内容策划、直播数据分析与稿件主笔工作，让我更理解内容可信度、传播节奏和受众反馈之间的关系。',
      highlights: [
        '独立完成 1.2 万字采访指南与嘉宾资料沉淀，为后续采访统一方法论',
        '直播后 24h 内抽取高光片段并用 AI 剪辑，次周播放量提升 40%',
        '主笔 4 篇深度稿，总阅读量达到 25 万+',
      ],
    },
    {
      period: '2025 — 至今',
      organization: '个人项目',
      role: '产品 / 设计 / 开发',
      summary:
        '持续围绕 RAG、Agent 与真实业务需求做独立产品实验，把 AI 能力推进到可以体验、可验证、可迭代的产品状态。',
      highlights: [
        '独立完成新传 Mind 的知识库入库、智能作答、真题分析、四维评估与用户体系设计开发',
        '为酒吧场景打造 RAG 智能客服，转人工率降至 25%，运营成本降低 25%',
        '围绕论文场景、歌词工具、情感测试等不同题材验证产品表达与页面转化能力',
      ],
    },
  ],
  works: [
    {
      type: 'external',
      title: '论文盾',
      subtitle: '论文 AI 率检测与智能降重工具',
      description:
        '把复杂的检测、改写与下载流程压成清晰的四步体验，更强调结果导向与用户可控性。',
      ownership: '独立完成产品定位、页面结构与 AI 改写链路表达',
      practiceHighlights: ['覆盖上传、检测、改写、下载完整链路设计', '把复杂论文处理流程压缩成用户易理解的四步体验', '兼顾自动降重与逐段精修两种使用方式'],
      tech: ['Web App', 'AI Workflow', '转化型页面设计'],
      href: 'https://aigctest.zeabur.app/',
      actionLabel: '在线体验',
    },
    {
      type: 'external',
      title: '正缘引力',
      subtitle: '恋爱人格与城市匹配测试',
      description:
        '用更强叙事性的 landing page 承载轻测试产品，把测试价值、双人玩法与付费转化讲清楚。',
      ownership: '独立完成品牌叙事、转化路径与测试产品包装',
      practiceHighlights: ['把人格测试、城市匹配和双人玩法整合成统一品牌体验', '强化单人探索与双人同频两条转化路径', '用叙事型落地页验证轻测试产品的包装能力'],
      tech: ['Landing Page', '心理测试产品', '付费转化'],
      href: 'https://zhengyuanyinli.zeabur.app/',
      actionLabel: '查看页面',
    },
    {
      type: 'external',
      title: '泊乐网易云滚动歌词工具',
      subtitle: '音频识别与歌词配对工具',
      description:
        '把上传、识别、编辑、复制四个动作做成无门槛工具流，突出效率与结果可得性。',
      ownership: '独立完成工具流设计、上传识别链路与编辑体验规划',
      practiceHighlights: ['把工具使用门槛压缩到上传-识别-编辑-复制四步', '兼顾云端极速识别与手动歌词配对两种路径', '围绕效率工具场景强化即时预览与一键复制体验'],
      tech: ['音频处理', 'AI 识别', '效率工具'],
      href: 'https://boyuewyy.zeabur.app/',
      actionLabel: '打开工具',
    },
    {
      type: 'external',
      title: '青丝源',
      subtitle: '品牌化业务页面尝试',
      description:
        '围绕业务入口、功能表达与品牌一致性做页面搭建，验证不同业务主题下的视觉调性控制。',
      ownership: '独立完成页面策划、信息架构与品牌化视觉表达',
      practiceHighlights: ['围绕品牌业务入口做更克制的登录页与功能页表达', '练习在不同业务主题下保持一致的视觉语气', '沉淀可复用的业务页信息分层方式'],
      tech: ['品牌页面', '信息分层'],
      href: 'https://qingsiyuan.preview.huawei-zeabur.cn/',
      actionLabel: '访问站点',
    },
    {
      type: 'internal',
      title: 'RedNote Collector',
      subtitle: '小红书内容采集与整理工具',
      description:
        '当前仓库中的全栈项目，用于定向搜索、采集、整理和导出小红书笔记数据，也是我把产品能力与工程实现结合起来的一次完整练习。',
      ownership: '独立完成产品结构设计、React 前端、Express 服务端与导出能力',
      practiceHighlights: ['从搜索、采集到导出把完整工具链落到可运行系统', '同时覆盖前端交互、服务端接口、导出能力与日志追踪', '把工程实现与产品工作流结合成一个可演示的完整作品'],
      tech: ['React', 'Vite', 'Express', 'MCP', 'Winston'],
      href: '/projects/rednote',
      actionLabel: '打开真实工具',
    },
  ],
  caseStudies: [
    {
      title: '新传 Mind · 考研备考 AI 专家系统',
      hook: '我最重视的不是“能回答”，而是“答案是否可信、是否真能帮助用户进步”。',
      context:
        '和 30+ 名学生深谈后，我把备考场景拆成院校真题分析、专业知识库、AI 作答、练习评估与反馈飞轮五个核心环节。',
      decisions: [
        '把“答案可信度”设为第一产品指标，而不是单纯追求回答流畅',
        '按新传学科 6 大方向做主题分库检索，而不是用单一大库兜底',
        '采用 LanceDB + SQLite 双通道召回，并结合查询改写与可选重排提升相关性',
      ],
      outcome:
        '目前已完成知识库入库、RAG 作答、练习四维评估、真题分析与用户体系等核心模块，系统可以端到端运行，并进入回归集与 SFT 数据积累阶段。',
    },
    {
      title: '酒吧智能问答客服',
      hook: '夜间消费场景的关键不是把话说得漂亮，而是减少转人工、缩短轮次并提升订台效率。',
      context:
        '围绕酒吧经营侧的营销成本问题，我从员工与客户访谈切入，确认了智能问答、实时价格查询、情绪判断和复杂情况转人工等需求。',
      decisions: [
        '用微信与电话转写文本、酒单价格表和访谈笔录构建冷启动知识底座',
        '采用 RRF 重排与 Top5 段落送入生成模块，在成本与命中率之间取平衡',
        '按真实峰值 QPS 预估做本地部署，控制成本同时预留夜间业务余量',
      ],
      outcome:
        '上线后转人工率降至 25%，平均对话轮次减少 30%，运营成本降低 25%，订台率提升 10%。',
    },
  ],
  contact: {
    intro:
      '如果你在寻找一位既能做需求洞察、又能把 AI 能力推进到产品闭环中的候选人，欢迎和我聊聊。',
    coverTitle: 'Contact',
    primary: { label: '简历 PDF', value: '下载完整简历', href: '/resume/liuchang-resume.pdf' },
    channels: [
      { label: 'GitHub', value: 'singerliu226', href: 'https://github.com/singerliu226' },
      { label: '邮箱', value: 'singer226@163.com', href: 'mailto:singer226@163.com' },
      { label: '手机', value: '152 0217 1290', href: 'tel:15202171290' },
    ],
    note: '更完整的项目材料与实现细节，可通过简历、GitHub 与在线作品继续查看。',
  },
};
