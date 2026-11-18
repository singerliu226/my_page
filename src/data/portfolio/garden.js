/**
 * @fileoverview “后花园”页的内容：能直接玩的小游戏、能直接看的短片。
 * 这里的数字和说法都取自各项目自己的 README、交付说明和自测记录；
 * 没验证过的事写在 limit 里，不写进卖点。游戏文件由 scripts/garden/sync.mjs 同步进 public/play。
 */
export const gardenContent = {
  masthead: {
    eyebrow: '副刊 · BACK GARDEN',
    title: '后花园',
    lead: '正经项目之外，我和 AI 一起做的小东西。游戏点开就能玩，不用登录；短片点开就能看。',
    note: '四个小游戏做于 2026 年 11 月 9 日到 16 日。东西是 AI 做的，我管三件事：告诉它我想要什么，自己玩一玩、挑毛病，最后把它发出去。',
  },

  headline: {
    id: 'eyuzu',
    kicker: '头条 · 联机小游戏',
    title: '鹅羽鮨',
    tagline: '一家只招待企鹅的寿司小店',
    meta: '2026.11.16 · 约 16 小时 · 一天三版',
    summary:
      '点开同一个链接的人会进同一家店。每人是一只小企鹅，找座、点菜、干杯；坐满了，后来的人在门口等叫号。',
    decisionsTitle: '我在意的几件事',
    decisions: [
      { label: '店里不能冷清', text: '真人少的时候，电脑客人来补位；有真人排队，电脑客人就让座。' },
      { label: '坐满就叫号', text: '50 个座位坐满后自动取号，等位的人看得见店里。叫到号 75 秒不进店算过号，重新排。' },
      { label: '掉线不丢座', text: '切出去回条消息再回来，座位、账单和还没上的菜保留 90 秒。' },
      { label: '开店的人看得见账', text: '联机版带一块经营看板，能看来了多少人、多少是回头客、待了多久、最多同时有几位在店、从哪儿来的。只算真人。' },
    ],
    facts: [
      { value: '50', label: '个座位，坐满取号' },
      { value: '50 + 3', label: '道菜，其中 3 道是隐藏菜' },
      { value: '0', label: '张外部图片、0 段外部音频，画面和配乐都由代码生成' },
    ],
    play: { href: '/play/eyuzu/index.html', label: '进店坐坐', note: '单机试玩 · 约 0.4 MB' },
    solo: '这里放的是单机试玩：正式版的服务端代码原样装进网页里运行，规则不变，只是店里的其他客人都由电脑扮演。',
    online:
      '联机版是一个常驻的 Node 服务，2026 年 11 月 16 日在 WorkBuddy 上线过。项目里带着 Dockerfile 和部署配置，放到服务器上就能开店。',
    limit: '手机上的操作是在电脑里模拟测的，没有在真手机上逐台试过。',
    image: {
      src: '/portfolio/garden/eyu-solo-desktop.jpg',
      alt: '鹅羽鮨单机试玩：电脑上看到的整家店，吧台、餐桌和正在吃饭的企鹅',
      caption: '单机试玩 · 电脑上的店内',
    },
    phone: {
      src: '/portfolio/garden/eyu-phone.jpg',
      alt: '鹅羽鮨联机版在手机上的画面：坐满的店、聊天气泡和底部的操作按钮',
      caption: '联机版自测截图 · 店里的客人由测试程序扮演',
    },
  },

  gamesTitle: '三个一个人就能玩的',
  games: [
    {
      id: 'tongsui',
      title: '糖水小铺',
      version: 'V5',
      tagline: '在手机上做一碗 3D 糖水',
      meta: '2026.11.09 – 11.10 · 首版到 V5',
      summary: '挑碗、配勺、倒底料、加配料、淋奶，给这一碗起个名字，存一张成品卡。',
      highlight: '没有分数，也没有倒计时。6 种“黑暗料”做完第一碗才解锁：先让人正经做一碗，再给他捣乱的权利。',
      limit: '35 项规则测试和 5 项整页流程通过，没有在真手机上逐台试过。',
      play: { href: '/play/tongsui/index.html', label: '做一碗', note: '约 21 MB' },
      image: { src: '/portfolio/garden/tongsui-play.jpg', alt: '糖水小铺：一碗做好的糖水放在木桌上' },
      extra: { src: '/portfolio/garden/tongsui-card.jpg', alt: '糖水小铺导出的成品卡', caption: '成品卡' },
    },
    {
      id: 'kitchen',
      title: '胡闹鹅厨房',
      version: '1.5',
      tagline: '四篮食材随便搭，出餐才知道有多黑暗',
      meta: '2026.11.10 – 11.11 · 1.0 到 1.5',
      summary: '从 185 种食材里挑几样下锅，鹅老板给一张出餐卡。撞对了配方，会做出 64 道真菜里的一道。',
      highlight: '正宗度、暗黑度、可食性藏到出餐才揭晓。出餐后可以只换一样再做一锅，两锅的分数放在一起比。',
      limit: '这不是真的烹饪模拟，分数高不代表真能吃。两首配乐没有人从头听完过。',
      play: { href: '/play/kitchen/index.html', label: '做一单', note: '约 28 MB，第一次打开要等一会儿' },
      image: { src: '/portfolio/garden/kitchen-soup.jpg', alt: '胡闹鹅厨房的出餐卡：一碗“被全网拉黑的虾米汤”和三项评分' },
    },
    {
      id: 'luck',
      title: '鹅来切霉运',
      version: '1.0',
      tagline: '把烦恼切成 16 块，一块块甩出去',
      meta: '2026.11.10 · 约 3 小时',
      summary: '划六刀切开一板霉豆腐，每块上写着一个烦恼。甩走一块，换一句安慰；收工时给一张小票。',
      highlight: '没有倒计时，不扣分，也没有失败这回事。想续板就续，想收工就收。',
      limit: '打包后只在电脑模拟的手机尺寸里测过，没上真机。两首原创配乐只做了技术检查，没有人从头听过。',
      play: { href: '/play/luck/index.html', label: '切一板', note: '约 7 MB' },
      image: { src: '/portfolio/garden/luck-cut.jpg', alt: '鹅来切霉运：一板等着被切开的霉豆腐' },
      extra: { src: '/portfolio/garden/luck-poster.jpg', alt: '鹅来切霉运的收工小票', caption: '收工小票' },
    },
  ],

  filmsTitle: '两部 AI 短片',
  filmsLead: '都是鹅创营的作业。我负责定故事方向、选片和审核，画面生成和后期由 AI 完成。',
  films: [
    {
      id: 'guo-shengri',
      title: '过生日',
      meta: '2026.11 · 1 分 55 秒 · 25 镜',
      summary: '五位同事给马维斯准备生日惊喜：草莓被偷吃了，音乐放早了，蛋糕还被压坏。马维斯吃了一口，又吃了第二口。',
      craft: '全片没有对白，靠动作和 12 条短字幕把事情讲清楚。六个角色各有脾气，也各用了一次自己的本事。',
      limit: '角色的脸型在不同镜头之间还有变化，最后一幕有几个笑容不自然。这两处没修。',
      video: '/media/guo-shengri.mp4',
      poster: '/media/guo-shengri.jpg',
      posterAlt: '《过生日》片尾：六个戴围巾的角色围着一块蛋糕',
    },
    {
      id: 'hey-marvis',
      title: 'Hey Marvis',
      meta: '2026.10 – 11 · 2 分 12 秒',
      summary: '像素闯关片。小企鹅在生活、学习、工作三关里被电脑问题卡住，每次喊一声“Hey, Marvis!”，请 Marvis 来帮忙。',
      craft: '鹅创营的第一次个人作业，给腾讯 Marvis 做的产品宣传短片。这里放的是 132 秒的作业完整版，里面有三处真实的产品界面。',
      limit: '第 69 到 72 秒那一段还是旧版的角色形象。全片的声音没有人从头听过一遍。',
      video: '/media/hey-marvis.mp4',
      poster: '/media/hey-marvis.jpg',
      posterAlt: '《Hey Marvis》画面：小企鹅站在书桌上喊出“Hey, Marvis!”',
    },
  ],

  neighbor: {
    kicker: '隔壁 · 互动影单',
    title: '鹅羽鮨 · 下饭放映室',
    summary: '给鹅羽鮨配的一份影单：七部关于吃饭的片子，带讨论话题和轻音乐。',
    href: 'https://mirasim.ai/@pc-5bfda68139d4894e245c/eyuzu-film-room',
    label: '去放映室',
  },

  creditsTitle: '素材的来路',
  credits: [
    { text: '鹅羽鮨：画面和三首配乐都由游戏代码现画、现合成，没有外部素材。' },
    {
      text: '糖水小铺：字体 Noto Sans SC（SIL OFL 1.1）；动作音效是 CC0 采样；背景音乐是《Summer (Nature’s Crescendo)》，默认关着，右上角可以打开；企鹅造型参考腾讯 QQ，属个人创作。',
    },
    {
      text: '胡闹鹅厨房：配乐是 Kevin MacLeod 的《Fluffing a Duck》《Jaunty Gumption》，按 CC BY 4.0 使用，做了节选和音量调整；字体 Noto Sans SC、ZCOOL XiaoWei（SIL OFL 1.1）。',
      links: [
        { label: 'incompetech.com', href: 'https://incompetech.com/' },
        { label: 'CC BY 4.0', href: 'https://creativecommons.org/licenses/by/4.0/' },
        { label: '完整署名', href: '/play/kitchen/licenses/BGM署名.md' },
      ],
    },
    { text: '鹅来切霉运：字体 ZCOOL KuaiLe（SIL OFL 1.1）；两首配乐由项目脚本合成。' },
    {
      text: '《过生日》：角色是腾讯 Marvis 的官方形象，生日故事和个性细节是我的二创。配乐是 Scott Buckley 的《Growing Up》，按 CC BY 4.0 使用，与动画同步并调整了音量。',
      links: [
        { label: 'scottbuckley.com.au', href: 'https://www.scottbuckley.com.au/library/growing-up/' },
        { label: 'CC BY 4.0', href: 'https://creativecommons.org/licenses/by/4.0/' },
      ],
    },
    { text: '《Hey Marvis》：音效和配乐取自《超级马里奥》系列游戏。' },
    { text: '游戏和短片里的图片、画面由 AI 生成；游戏运行时不调用任何模型。' },
  ],
};
