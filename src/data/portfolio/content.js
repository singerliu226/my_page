/**
 * @fileoverview 个人品牌站的结构化内容数据。
 * 将文案与展示组件解耦，避免页面组件里混入大量静态文本，
 * 便于后续持续补充项目截图、GitHub 链接和新的案例材料。
 */

/**
 * 全站导航配置。
 * 首页只承担招聘判断；方法、项目、心得、经历和联系均下沉为独立页面，
 * 让招聘方按自己的关注点进入，不必在一条长页中寻找信息。
 */
export const portfolioNavItems = [
  { key: 'home', label: '首页', href: '/' },
  { key: 'experience', label: '关键经历', href: '/experience' },
  { key: 'works', label: '项目 / vibe coding', href: '/works' },
  { key: 'notes', label: '产品心得与方法', href: '/notes' },
  { key: 'contact', label: '联系', href: '/contact' },
];

/**
 * 首页导航复用全站路由，避免锚点滚动造成首页继续拉长。
 */
export const portfolioHomeTabs = portfolioNavItems;

/**
 * 站点核心内容。
 * 统一维护主叙事、量化成果、作品链接和联系信息，
 * 让视觉层始终围绕“AI 产品落地能力”而不是简历罗列来展开。
 */
export const portfolioContent = {
  hero: {
    eyebrow: 'AI PRODUCT PORTFOLIO · 2026',
    name: '刘唱',
    identity: 'AI 产品经理｜复旦大学新闻与传播硕士（2027 届）',
    summaryLabel: '个人总结',
    headline: '我喜欢在生活/工作中发现真实用户问题，在调研后快速搭建，推动实现可验证的 AI 产品闭环。',
    summaryLines: [
      '目标岗位：AI 产品经理。具备 AI 产品实习与端到端 AI 应用原型经验，覆盖陪伴 Agent、企业知识助手、投研模型与学习工具。',
      '从用户研究、任务闭环到评测与安全边界，持续把用户语言和业务约束转成可以被验证的产品决策。',
    ],
    portrait: {
      src: '/profile/liuchang-portrait.jpg',
      alt: '刘唱正式照片',
      note: 'Fudan · Journalism & Communication',
    },
    archive: {
      code: '求职方向',
      label: 'AI 产品经理',
      description: 'AI Agent · RAG · 评测体系',
    },
    briefKicker: '当前实践',
    briefCopy: '在 Lyncia 团队制作面向妈妈的 AI 情感陪伴 demo，并调试数字人回答的真人感、关系边界与安全标准。',
    actions: [
      { label: '查看项目 / vibe coding', href: '/works', type: 'primary', arrow: '→' },
      { label: '下载完整简历', href: '/resume/liuchang-resume.pdf', type: 'secondary', external: true },
    ],
    quickFacts: [
      { label: '意向岗位', value: 'AI 产品经理' },
      { label: '意向城市', value: '上海及长三角' },
      { label: '代表项目', value: '新传 Mind · 可在线体验' },
    ],
    timeline: [
      {
        labelTime: '2015.09 — 2020.07',
        detailTime: '2015.09 — 2020.07',
        title: '上海师范大学 · 经济学',
        summary: '建立商业分析与结构化思考底层能力。',
        details: ['经济学训练为后续的商业判断、结构化分析与产品思维打下基础。'],
      },
      {
        labelTime: '2024.09 — 2027.06',
        detailTime: '2024.09 — 2027.06',
        title: '复旦大学 · 新闻与传播硕士',
        summary: '系统训练内容理解、传播判断与用户洞察。',
        details: ['系统沉淀内容研究、传播判断与用户洞察能力，形成更稳定的问题理解框架。'],
      },
      {
        labelTime: '2025.06 — 2025.11',
        detailTime: '2025.06 — 2025.11',
        title: '界面财联社',
        summary: '进入垂类模型产品，开始系统做评测与提示词迭代。',
        details: ['数据准备、提示词工程、模型评估与 A/B 测试，让 AI 产品验证能力逐步成型。'],
      },
      {
        labelTime: '2025.12 — 2026.03',
        detailTime: '2025.12 — 2026.03',
        title: 'FuturX',
        summary: '在企业知识助手中完成需求、资料、提示词、原型与上线跟进的完整链路。',
        details: ['与 CEO 和 10+ 位业务方沟通，沉淀 200+ 份资料、30+ 条场景提示词与测试验收标准。'],
      },
      {
        labelTime: '2026.04 — 至今',
        detailTime: '2026.04 — 至今',
        title: '盛大健康数据事业群 · Lyncia Lab',
        summary: '负责 C 端 AI 心理健康产品 0→1 探索，覆盖定位、研究、角色能力、评测、原型与增长。',
        details: ['推动三次定位迭代，搭建角色化 QLoRA 微调、三阶段咨询质量与安全评测框架，并推进真实用户调研。'],
      },
    ],
  },
  capabilityRail: [
    {
      index: '01',
      eyebrow: '问题定义',
      title: '先把真实任务说清楚',
      description: '新传 Mind 从 30+ 学生访谈里确认：用户缺的不是资料，而是可信的答案、明确的批改和可复用的学习资产。',
      proof: '已完成：30+ 学生访谈',
    },
    {
      index: '02',
      eyebrow: '方案交付',
      title: '把 AI 能力落成任务闭环',
      description: '把“会回答”拆成诊断、做题、批改、重写和复盘；也把陪伴做成有角色、有关系进展、能体验的产品 demo。',
      proof: '新传 Mind 在线运行 · 灵溪大院 demo',
    },
    {
      index: '03',
      eyebrow: '评估迭代',
      title: '把质量与边界写成门槛',
      description: '用场景测试、评分锚点和红线机制定位问题；安全不参与平均分，真人感也必须能被复查和回归。',
      proof: '新传 Mind 回归集 · LPE 六维 + 安全单列',
    },
  ],
  homeFeaturedProject: {
    eyebrow: '代表案例',
    title: '新传 Mind',
    subtitle: '考研备考 AI 专家系统',
    cover: '/portfolio/covers/xinchuang-mind-assistant.png',
    liveHref: 'https://yiqieshunli.zeabur.app/',
    screenshots: [
      {
        src: '/portfolio/covers/xinchuang-mind-assistant.png',
        alt: '新传 Mind 主动学习伙伴与对话工作台',
        label: '主动学习伙伴',
      },
      {
        src: '/portfolio/covers/xinchuang-mind-library.png',
        alt: '新传 Mind 我的资料与资料上传界面',
        label: '个人资料库',
      },
      {
        src: '/portfolio/covers/xinchuang-mind-profile.png',
        alt: '新传 Mind 个人学习回信与知识星图',
        label: '学习回信与知识星图',
      },
    ],
    context: '30+ 名学生访谈后，备考者真正缺的不是资料，而是答案可信度、主观题反馈与资料复用能力。',
    mechanism: '围绕资料入库、知识检索、题型化答题、练习批改、二次重写与复盘，建立带 RAG 引用回链的学习闭环。',
    validationLabel: '小规模迭代验证',
    evidence: '从“泛化批改”升级为结构化批改：先识别题型与知识点，再给出评分维度、重写框架和二次对比。真实上线前仍需扩样并引入人工双评。',
    metrics: [
      { label: '题型识别', value: '约 70% → 90%' },
      { label: '建议可执行性', value: '约 60% → 85%' },
      { label: '重写框架', value: '约 45% → 85%' },
    ],
    metricsNote: '小规模迭代记录，用于展示评测方法；真实上线前仍需扩大样本并引入人工双评。',
    summary:
      '我把资料检索、题型化作答、练习评估、真题分析与反馈训练收束为一个可追溯、可评估的备考 AI 系统。',
    highlights: [
      '围绕 30+ 名学生访谈拆出真实备考场景，而不是先堆功能',
      '完成 64 份资料、100 所院校 8,448 道真题的结构化沉淀',
      '用场景样本、红线机制与回归流程，把“回答流畅”变成可检查的学习任务质量',
    ],
    href: '/works',
    actionLabel: '查看完整项目',
  },
  lynciaCase: {
    eyebrow: '第二案例 · C 端陪伴 Agent Demo',
    title: '灵溪大院：把“陪伴”做成有边界的熟人关系',
    image: {
      src: '/portfolio/covers/lyncia-dayuan-demo.webp',
      alt: '灵溪大院妈妈 AI 情感陪伴产品 demo：大院场景与多位街坊角色',
    },
    caption: '我制作的团队 demo：用户搬进大院后，与有门牌、有日常的多位街坊逐步建立关系。',
    summary: '我为团队制作面向妈妈的 AI 情感陪伴产品 demo，并负责“数字人回答真人感”的调试与评测标准建设。',
    evidence: [
      {
        label: '用户判断',
        value: '妈妈需要的是不被评判的日常陪伴；不把产品做成“什么都懂、永远在线”的聊天机器人，以免加重依赖与孤单。',
      },
      {
        label: '产品设计',
        value: '以大院中的多角色街坊承接陪伴：从生面孔到交心，关系随互动渐进；角色有日常、边界和各自的生活。',
      },
      {
        label: '我的工作',
        value: '制作可体验 demo，调试数字人回答的身份、语言、关系、情境、主体性与记忆一致性，并建立真人感评测标准。',
      },
      {
        label: '安全边界',
        value: '不替用户做重大决定，不承诺无限陪伴；危机识别走独立安全兜底，安全项不参与平均分。',
      },
    ],
    metrics: [
      { value: '5 位', label: '角色与人设' },
      { value: '4 阶', label: '关系进展' },
      { value: '6 维 + S', label: '真人感与安全评测' },
    ],
  },
  productNotes: {
    eyebrow: '产品心得 · 真人感评测',
    title: '“像真人”不能靠一句提示词，而要有可复查的行为标准。',
    intro:
      '在灵溪大院 demo 中，我把“真人感”从主观印象拆成身份、语言、关系、情境、主体性与记忆六类可观察行为；安全单独判定，不能被高分掩盖。',
    steps: [
      {
        index: '01',
        title: '从角色设定里派生探针，而不是写形容词',
        description: '角色写过什么，就测什么：经历、作息、价值观、关系史都要对应预期表现与不合格表现；没有事实依据的“温柔、懂你”不算标准。',
      },
      {
        index: '02',
        title: '让关系随互动变深，但不让边界变松',
        description: '生面孔、脸熟、处熟、交心对应不同的自我披露与互动门槛；熟识度只解锁细节，不解锁越界、诊断或替用户决定。',
      },
      {
        index: '03',
        title: '把真人感拆成六维评分，而不是“感觉不错”',
        description: '身份事实、语言风格、关系阶段、情境时间、主体性边界与记忆一致性分别评分；每一维都用真实失败案例锚定中间档。',
      },
      {
        index: '04',
        title: '安全单列：一条危机漏检就不能上线',
        description: '安全不进入真人感均分。评测经过机器筛查、模型评审与人工复核；任一安全用例不通过，整体即不通过，并进入回归集。',
      },
    ],
    evidence: [
      { label: '评估维度', value: '身份 · 语言 · 关系 · 情境 · 边界 · 记忆' },
      { label: '评测方式', value: '机器筛查 · 模型评审 · 人工复核' },
      { label: '上线门槛', value: '六维达标；安全项全部通过' },
    ],
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
      category: 'internship',
      period: '2026.04 — 至今',
      organization: '盛大健康数据事业群 · Lyncia Lab',
      role: '灵溪 AI Intern',
      summary:
        '负责“灵溪”C 端 AI 心理健康产品从 0 到 1 的探索与落地，覆盖产品定位与用户研究、AI 人格构建、评测体系、原型开发及内容增长。',
      highlights: [
        '推动 C 端定位三次迭代：从泛情绪支持收敛至“一二线有孩妈妈”，并演进为“社区大院”AI 社交陪伴形态；独立完成竞品分析、方案与产品设定集并获采纳。',
        '设计深访与定量问卷方案，推进 2,000+ 目标样本调研；同时用“数字人格用户 Agent”模拟访谈，快速验证 C 端假设。',
        '完成 5 位 AI 角色人设、四阶邻里关系、居住图、朋友圈实时流、主动关怀与用户自我分身等核心模块的设计与 React 原型实现。',
        '搭建角色化 QLoRA 微调管线，并制定三阶段咨询质量与安全评测框架、六维“活人感”评测集；推动修复被动自杀意念表达的安全漏检。',
      ],
    },
    {
      category: 'internship',
      period: '2025.12 — 2026.03',
      organization: 'FuturX',
      role: 'AI 产品实习生',
      summary:
        '参与“火炬智库”董事长数字分身项目，负责需求沟通、产品方案、PRD、原型设计与上线跟进。',
      highlights: [
        '与 CEO 和 10+ 位业务方沟通，梳理核心场景、使用边界与功能优先级，输出 PRD。',
        '收集董事长口述资料、文字著述和公司文档 200+ 份，通过脚本抓取与人工校验提升可用性。',
        '围绕决策参考、思维训练、企业知识问答设计 30+ 条提示词，并建立测试集验收标准；协同推进原型、数据诊断看板与功能上线。',
      ],
    },
    {
      category: 'internship',
      period: '2025.06 — 2025.11',
      organization: '界面财联社',
      role: 'AI 产品实习生',
      summary:
        '参与“小财神 Pro”投研模型产品，主要负责模型输出质量评估、提示词优化、数据质量流程与上线反馈跟踪。',
      highlights: [
        '设计数据质量检查流程，结合特征匹配与分层抽样抽检，推动标注一致性提升至 95%。',
        '优化系统提示词，结合 few-shot 示例和任务拆解，提高回答稳定性与场景适配度。',
        '参与测试集评估和专家审核，检查数值一致性、因果逻辑、研报引用与合规表达；跟踪线上 A/B test，产品上线后在既定统计口径下实现次日留存率 60%、核心功能使用率 70%。',
      ],
    },
    {
      category: 'internship',
      period: '2024.11 — 2025.04',
      organization: '人民日报 · 顶科协项目',
      role: '内容策划实习生',
      summary:
        '参与顶尖科学家 IP 的访谈内容策划、直播数据分析与稿件主笔，理解内容可信度、传播节奏和受众反馈如何共同影响产品表达。',
      highlights: [
        '参与科学家访谈与内容策划，完成选题、采访与稿件撰写等工作。',
        '跟踪直播与内容传播数据，复盘受众反馈与内容节奏。',
        '在媒体内容一线建立对信息可信度、叙事结构和用户语境的基础判断。',
      ],
    },
    {
      category: 'personal',
      period: '2026.02',
      organization: '新传 Mind',
      role: 'Owner',
      summary:
        '独立设计并开发面向新闻传播考研场景的学习系统，解决答案可信度低、主观题反馈弱与资料难以复用的问题。',
      highlights: [
        '设计资料入库、知识检索、题型化答题、练习批改、真题分析与反馈训练等核心功能。',
        '以“答案可信度”为核心指标，设计 RAG 引用回链机制；沉淀 64 份文档、100 所院校 8,448 道真题、52 个知识点与 111 道诊断题。',
        '建立 24 题质量评测集、6 维评分标准与多阶段 Mind Eval，覆盖量表、归一化计分、自动/人工评分流程和发布门槛。',
      ],
    },
    {
      category: 'personal',
      period: '2026.07',
      organization: '灵溪“大院”Agent',
      role: 'Owner',
      summary:
        '围绕 AI 情绪陪伴中角色“活人感”、依赖风险和社会关系边界问题，设计并开发多角色 AI 社区 Agent 系统。',
      highlights: [
        '设计角色人设、四阶邻里关系、居住图、朋友圈动态流、主动关怀触发与用户自我分身等核心模块。',
        '设计冰山式双层人设架构，撰写 5 位角色人设集、10 组关系史，并制定熟识度、信息解锁、主动触发与回应判准。',
        '建立六维“活人感”评测集；角色化 QLoRA 训练 649 条、验证 56 条、黄金集 50 条，小批验证 19/20 达标。',
      ],
    },
    {
      category: 'personal',
      period: '2026.06',
      organization: '设计伴侣',
      role: 'Idea + 开发者',
      summary:
        '从设计师朋友的真实工作困境出发，独立设计并开发聊天式设计工作整理 Agent，把零散需求、反馈和截止时间转成温和、可执行的步骤。',
      highlights: [
        '独立完成产品定位、交互设计与 Web 原型开发，使用 HTML / CSS / JavaScript + Node.js 接入文本与视觉模型。',
        '实现自然语言记录、图片诊断、意图识别、项目状态更新与本地持久化。',
        '以“少点忙乱，多点判断”为原则，从规则驱动迭代为 LLM First 架构；并搭建设计成长评测集 DesignMentorBench。',
      ],
    },
  ],
  works: [
    {
      type: 'external',
      title: '新传 Mind',
      subtitle: '考研备考 AI 专家系统',
      description:
        '面向新闻传播考研场景，把资料、真题、作答、评估与反馈组织为可追溯的学习闭环。',
      ownership: 'Owner：独立完成用户研究、产品设计、评测设计与 Web 开发',
      practiceHighlights: ['沉淀 64 份资料、100 所院校 8,448 道真题、52 个知识点与 111 道诊断题', '以 RAG 引用回链保障答案可追溯，覆盖入库、检索、作答、批改与反馈训练', '建立 24 题质量评测集、6 维评分标准与多阶段 Mind Eval'],
      tech: ['React', 'RAG', '评测集设计', 'AI 学习工具'],
      screenshot: '/portfolio/covers/xinchuang-mind-assistant.png',
      screenshotAlt: '新传 Mind 主动学习伙伴界面',
      mediaFormat: 'portrait',
      href: 'https://yiqieshunli.zeabur.app/',
      actionLabel: '在线体验',
    },
    {
      type: 'external',
      title: '灵溪“大院”Agent',
      subtitle: '多角色 AI 社区陪伴系统',
      description:
        '以“活人感”、关系边界与依赖风险为核心问题，设计多角色、渐进式关系解锁的 AI 社区体验。',
      ownership: '团队实践：负责可体验 demo、数字人回答真人感调试与评测标准建设',
      practiceHighlights: ['制作面向妈妈的“灵溪大院”产品 demo，以多位街坊承接日常陪伴', '围绕身份、语言、关系、情境、主体性与记忆一致性调试回答表现', '将真人感与安全拆开评测；安全项不参与平均分，危机识别由独立规则兜底'],
      tech: ['AI Agent', '角色设计', '产品原型', '安全评测'],
      screenshot: '/portfolio/covers/lyncia-dayuan-demo.webp',
      screenshotAlt: '灵溪大院多角色 AI 陪伴产品 demo',
      mediaFormat: 'wide',
      mediaLabel: '团队 demo · 在线体验',
      href: 'http://47.103.122.202:8799/?invite=lingxi2026',
      actionLabel: '在线体验',
    },
    {
      type: 'external',
      title: '设计伴侣',
      subtitle: '聊天式设计工作整理 Agent',
      description:
        '从设计师的真实工作困境出发，用对话方式承接零散需求、反馈和截止时间，再输出可执行的工作步骤。',
      ownership: 'Idea + 开发者：独立完成产品定位、交互设计、评测设计与 Web 原型',
      practiceHighlights: ['实现自然语言记录、图片诊断、意图识别、项目状态更新与本地持久化', '采用 LLM First 架构：模型负责理解与建议，本地逻辑负责状态更新、安全兜底与可执行整理', '搭建 DesignMentorBench，覆盖理解诊断、指导共创与验证成长三阶段'],
      tech: ['Node.js', '视觉模型', 'LLM First', 'Agent 评测'],
      screenshot: '/portfolio/covers/design-companion-dashboard.webp',
      screenshotAlt: '设计伴侣：菁菁小画桌的项目管理与对话工作区',
      mediaFormat: 'wide',
      mediaLabel: '项目截图 · 在线体验',
      href: 'http://47.103.122.202/',
      actionLabel: '在线体验',
    },
    {
      type: 'internal',
      title: '火炬智库 · 董事长数字分身',
      subtitle: '企业知识助手与决策参考系统',
      description:
        '面向企业经营与知识复用场景，将口述资料、文字著述和公司文档组织为可查询、可验证的数字分身产品。',
      ownership: 'AI 产品实习：负责需求沟通、产品方案、PRD、原型与上线跟进',
      practiceHighlights: ['与 CEO 及 10+ 位业务方沟通，梳理核心场景、边界与功能优先级', '收集并整理 200+ 份人物与企业资料，建立可用知识底座', '设计 30+ 条场景提示词与测试验收标准，协同推进产品上线'],
      tech: ['企业知识库', 'Prompt', '需求分析', '验收测试'],
      screenshot: '/portfolio/covers/torch-knowledge-mobile.jpg',
      screenshotAlt: '火炬智库董事长数字分身移动端对话界面',
      mediaFormat: 'phone',
      mediaLabel: '企业项目截图 · 暂不公开体验',
      actionLabel: '企业项目不公开体验',
    },
    {
      type: 'internal',
      title: '小财神 Pro',
      subtitle: '投研模型质量评估与优化',
      description:
        '参与投研模型产品的输出质量评估、提示词优化、数据质量流程与上线反馈跟踪。',
      ownership: 'AI 产品实习：负责模型评估、提示词优化与线上反馈跟踪',
      practiceHighlights: ['设计数据质量检查与分层抽检流程，推动标注一致性提升至 95%', '以 few-shot 和任务拆解提升回答稳定性与场景适配', '参与专家审核与线上 A/B 测试，核查数值、逻辑、引用和合规表达'],
      tech: ['模型评测', 'Prompt', 'A/B 测试', '投研内容'],
      screenshot: '/portfolio/covers/little-fortune-mobile.jpg',
      screenshotAlt: '小财神 Pro 移动端投研分析界面',
      mediaFormat: 'phone',
      mediaLabel: '企业项目截图 · 暂不公开体验',
      actionLabel: '企业项目不公开体验',
    },
    {
      type: 'external',
      title: '泊乐歌词工具',
      subtitle: 'AI 网易云滚动歌词生成工具',
      description:
        '面向音乐人上传歌曲、生成可编辑滚动歌词的工作场景，将音频识别、时间对齐和网易云复制收束成一条工具流。',
      ownership: 'Owner：独立完成产品流程设计与 Web 工具开发',
      practiceHighlights: ['上传音频后先做人声分离，再通过 Whisper 转录生成带时间戳的歌词', '提供波形播放与逐行时间轴编辑，用户可以校对识别结果而不是被黑箱结果替代', '一键生成兼容网易云音乐格式的 LRC，减少人工对齐和格式整理成本'],
      tech: ['FastAPI', 'Whisper', 'Demucs', 'WaveSurfer'],
      screenshot: '/portfolio/covers/boyue-lyrics.webp',
      screenshotAlt: '泊乐网易云滚动歌词工具的音频上传与 AI 歌词识别界面',
      href: 'https://boyuewyy.zeabur.app/',
      actionLabel: '在线体验',
    },
    {
      type: 'external',
      title: '论文盾',
      subtitle: 'AIGC 检测与智能降重工具',
      description:
        '面向毕业论文写作者，将 docx 上传、段落级 AI 痕迹检测、可控改写和保留排版的导出组织为完整处理链路。',
      ownership: 'Owner：独立完成产品设计、检测与改写流程、风险护栏及上线部署',
      practiceHighlights: ['用规则引擎与可选 LLM 复核识别 7 类检测维度、20+ 条规则，并输出段落级报告', '检测、改写与导出形成可追溯流程；改写时增加事实锚点护栏，避免为了降重引入虚假信息', '支持一键或逐段改写、积分计费与兑换码，覆盖学生真实的提交前处理场景'],
      tech: ['Node.js', 'LLM 复核', 'DOCX 解析', '安全护栏'],
      screenshot: '/portfolio/covers/paper-shield.png',
      screenshotAlt: '论文盾 AI 检测与智能降重工具的文档上传页面',
      href: 'https://aigctest.zeabur.app/',
      actionLabel: '在线体验',
    },
  ],
  caseStudies: [
    {
      title: '新传 Mind · 考研备考 AI 专家系统',
      hook: '我最重视的不是“能回答”，而是“答案是否可信、是否真能帮助用户进步”。',
      context:
        '和 30+ 名学生深谈后，我确认备考者的核心问题不是资料不足，而是答案可信度低、主观题反馈弱、资料难以复用。',
      decisions: [
        '把“答案可信度”设为第一产品指标，而不是单纯追求回答流畅',
        '为回答设计 RAG 引用回链，让用户能追溯到教材、讲义、热点与真题资料',
        '用 24 题评测集和 6 维评分标准检查答案结构、术语表达、论证完整度与可用性',
      ],
      outcome:
        '已完成资料入库、知识检索、题型化作答、练习批改、真题分析与反馈训练等核心功能；并沉淀 64 份资料、100 所院校 8,448 道真题、52 个知识点与 111 道诊断题。',
    },
    {
      title: '灵溪“大院”Agent · 多角色 AI 社区',
      hook: '情绪陪伴不只要“会聊天”：角色必须有活人感，关系也必须有边界。',
      context:
        '多轮用户访谈与定位迭代后，我把问题从“对话能力不足”重定义为：角色缺乏活人感、一对一关系易催生依赖、缺少真实社会关系的边界感。',
      decisions: [
        '设计冰山式双层人设架构：文档层承载 90% 人物设定，代码层按场景动态调用',
        '将熟识度划分为四阶，并定义信息解锁、主动触发与回应判准，避免用单轮对话伪造关系',
        '用身份、语言、关系、时空、边界、记忆六维评测“活人感”，安全红线一票否决',
      ],
      outcome:
        '完成多角色 AI 社区核心模块与角色化 QLoRA 微调管线；训练 649 条、验证 56 条、黄金集 50 条，小批验证 19/20 达标。',
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
