/**
 * @fileoverview “后花园”页的内容：能直接玩的小游戏、能直接看的短片。
 * 每件作品只讲两件事：这是什么，怎么玩。玩法照各游戏自带的说明写，按键和按钮名要和游戏里一致。
 * 游戏文件由 scripts/garden/sync.mjs 同步进 public/play。
 */
export const gardenContent = {
  masthead: {
    eyebrow: '副刊 · BACK GARDEN',
    title: '后花园',
    lead: '正经项目之外，我和 AI 一起做的小东西。游戏点开就能玩，不用登录；短片点开就能看。',
  },

  headline: {
    id: 'eyuzu',
    kicker: '头条',
    title: '鹅羽鮨',
    tagline: '一家只招待企鹅的寿司小店',
    summary: '先给自己的企鹅挑一身打扮，然后进店找个座，点几盘寿司，和邻座干个杯。这里是单机版，店里的其他客人由电脑扮演。',
    howTitle: '怎么玩',
    how: [
      { label: '电脑', text: 'WASD 或方向键走路。走到空凳子旁按 E 坐下，坐下后按 M 点餐，按 C 干杯。' },
      { label: '手机', text: '按住屏幕拖动走路，点空凳子坐下。点餐和干杯在底下一排按钮里。' },
    ],
    play: { href: '/play/eyuzu/index.html', label: '进店坐坐', note: '约 0.4 MB' },
    image: {
      src: '/portfolio/garden/eyu-solo-desktop.jpg',
      alt: '鹅羽鮨单机版：电脑上看到的整家店，吧台、餐桌和正在吃饭的企鹅',
    },
  },

  gamesTitle: '还有三个小游戏',
  games: [
    {
      id: 'tongsui',
      title: '糖水小铺',
      tagline: '亲手做一碗 3D 糖水',
      how: '挑碗和勺子，倒底料、放配料，再淋奶、撒点缀。做好了起个名字，存一张成品卡。',
      play: { href: '/play/tongsui/index.html', label: '做一碗', note: '约 21 MB' },
      image: { src: '/portfolio/garden/tongsui-play.jpg', alt: '糖水小铺：一碗做好的糖水放在木桌上' },
      extra: { src: '/portfolio/garden/tongsui-card.jpg', alt: '糖水小铺导出的成品卡', caption: '成品卡' },
    },
    {
      id: 'kitchen',
      title: '胡闹鹅厨房',
      tagline: '四篮食材随便搭，出餐才知道有多黑暗',
      how: '按顺序从主料、配料、调料、小灵感四篮里挑，一共 4 到 11 样。确认下锅后，鹅老板端出一张出餐卡，这时才看得到正宗度、暗黑度和可食性。',
      play: { href: '/play/kitchen/index.html', label: '做一单', note: '约 28 MB，第一次打开要等一会儿' },
      image: { src: '/portfolio/garden/kitchen-soup.jpg', alt: '胡闹鹅厨房的出餐卡：一碗“被全网拉黑的虾米汤”和三项评分' },
    },
    {
      id: 'luck',
      title: '鹅来切霉运',
      tagline: '把烦恼切成 16 块，一块块甩出去',
      how: '沿虚线划六刀，把一板霉豆腐切成 16 块。按住一块往外拖，松手就甩走了。清空一板可以再来一板，也可以收工领一张小票。',
      play: { href: '/play/luck/index.html', label: '切一板', note: '约 7 MB' },
      image: { src: '/portfolio/garden/luck-cut.jpg', alt: '鹅来切霉运：一板等着被切开的霉豆腐' },
      extra: { src: '/portfolio/garden/luck-poster.jpg', alt: '鹅来切霉运的收工小票', caption: '收工小票' },
    },
  ],

  filmsTitle: '两部 AI 短片',
  filmsLead: '都是我在鹅创营的作业，点开就能看。',
  films: [
    {
      id: 'guo-shengri',
      title: '过生日',
      meta: '1 分 55 秒',
      summary: '五位同事给马维斯准备生日惊喜：草莓被偷吃了，音乐放早了，蛋糕还被压坏。马维斯吃了一口，又吃了第二口。',
      video: '/media/guo-shengri.mp4',
      poster: '/media/guo-shengri.jpg',
      posterAlt: '《过生日》片尾：六个戴围巾的角色围着一块蛋糕',
    },
    {
      id: 'hey-marvis',
      title: 'Hey Marvis',
      meta: '2 分 12 秒',
      summary: '像素闯关片。小企鹅在生活、学习、工作三关里被电脑问题卡住，每次喊一声“Hey, Marvis!”，请 Marvis 来帮忙。',
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
      text: '糖水小铺：字体 Noto Sans SC（SIL OFL 1.1）；动作音效是 CC0 采样；背景音乐是《Summer (Nature\'s Crescendo)》，默认关着，右上角可以打开；企鹅造型参考腾讯 QQ，属个人创作。',
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
