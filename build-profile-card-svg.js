import fs from "fs";

const imgPath = "/Users/liuchang/Desktop/red note/d1df65a3fa666d99eaf9f0794f22fde6.png";
const outSvg = "/Users/liuchang/Desktop/red note/个人简介简图-小红书风.svg";
const imgBase64 = fs.readFileSync(imgPath).toString("base64");

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1200" height="1800" viewBox="0 0 1200 1800" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1200" y2="1800" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#FFFDFB"/>
      <stop offset="1" stop-color="#F8F5F2"/>
    </linearGradient>
    <linearGradient id="accent" x1="170" y1="0" x2="1030" y2="1800" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#FF5A5F"/>
      <stop offset="1" stop-color="#FF7B7F"/>
    </linearGradient>
    <filter id="shadow" x="0" y="0" width="1200" height="1800" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
      <feDropShadow dx="0" dy="18" stdDeviation="28" flood-color="#D9CFC8" flood-opacity="0.28"/>
    </filter>
    <clipPath id="avatarClip">
      <rect x="0" y="0" width="178" height="178" rx="34"/>
    </clipPath>
  </defs>

  <rect width="1200" height="1800" fill="url(#bg)"/>
  <circle cx="1050" cy="130" r="180" fill="#FFF1F1" opacity="0.7"/>
  <circle cx="120" cy="1630" r="220" fill="#FFF5F0" opacity="0.85"/>
  <rect x="78" y="72" width="1044" height="1656" rx="42" fill="#FFFEFD" filter="url(#shadow)"/>

  <rect x="126" y="120" width="10" height="108" rx="5" fill="url(#accent)"/>
  <text x="164" y="158" font-size="54" font-weight="700" fill="#181818" font-family="PingFang SC, Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif">刘唱</text>
  <text x="166" y="208" font-size="22" font-weight="500" fill="#7A6F69" font-family="PingFang SC, Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif">内容社区理解  ·  AI产品落地  ·  数据驱动产品判断</text>

  <g transform="translate(890,104)">
    <rect width="178" height="178" rx="34" fill="#FFF" stroke="#F0E6E0" stroke-width="2"/>
    <g clip-path="url(#avatarClip)">
      <image href="data:image/png;base64,${imgBase64}" x="-1238" y="-38" width="1458" height="2642" preserveAspectRatio="xMidYMid slice"/>
    </g>
  </g>

  <line x1="206" y1="360" x2="206" y2="1500" stroke="#E9DFD9" stroke-width="2"/>

  <circle cx="206" cy="408" r="16" fill="#FF5A5F"/>
  <circle cx="206" cy="640" r="14" fill="#FF8A8D"/>
  <circle cx="206" cy="872" r="14" fill="#FF8A8D"/>
  <circle cx="206" cy="1104" r="14" fill="#FF8A8D"/>
  <circle cx="206" cy="1336" r="14" fill="#FF8A8D"/>

  <rect x="252" y="338" width="794" height="136" rx="26" fill="#FFF8F7" stroke="#F4E7E4"/>
  <text x="286" y="388" font-size="18" font-weight="600" fill="#FF5A5F" font-family="PingFang SC, Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif">01  背景主线</text>
  <text x="286" y="432" font-size="28" font-weight="700" fill="#1C1C1C" font-family="PingFang SC, Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif">复旦新闻传播硕士  ·  上师大经济学本科</text>
  <text x="286" y="464" font-size="20" font-weight="400" fill="#6F6460" font-family="PingFang SC, Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif">从内容理解与商业分析出发，逐步转向真正做产品与做判断。</text>

  <rect x="252" y="566" width="794" height="152" rx="26" fill="#FFFFFF" stroke="#EFE5DE"/>
  <text x="286" y="618" font-size="18" font-weight="600" fill="#FF5A5F" font-family="PingFang SC, Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif">02  FuturX</text>
  <text x="286" y="658" font-size="30" font-weight="700" fill="#1C1C1C" font-family="PingFang SC, Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif">AI 产品实习</text>
  <text x="286" y="692" font-size="20" font-weight="400" fill="#6F6460" font-family="PingFang SC, Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif">董事长数字分身项目，深度参与需求调研、PRD、数据准备、</text>
  <text x="286" y="720" font-size="20" font-weight="400" fill="#6F6460" font-family="PingFang SC, Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif">提示词设计、原型沟通、测试评估与上线迭代。</text>

  <rect x="252" y="798" width="794" height="152" rx="26" fill="#FFFFFF" stroke="#EFE5DE"/>
  <text x="286" y="850" font-size="18" font-weight="600" fill="#FF5A5F" font-family="PingFang SC, Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif">03  界面财联社</text>
  <text x="286" y="890" font-size="30" font-weight="700" fill="#1C1C1C" font-family="PingFang SC, Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif">AI 产品实习</text>
  <text x="286" y="924" font-size="20" font-weight="400" fill="#6F6460" font-family="PingFang SC, Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif">参与小财神 Pro，负责数据准备、提示词工程、模型评估、</text>
  <text x="286" y="952" font-size="20" font-weight="400" fill="#6F6460" font-family="PingFang SC, Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif">A/B 测试与商业指标验证，强化信息效率与产品验证意识。</text>

  <rect x="252" y="1030" width="794" height="152" rx="26" fill="#FFFFFF" stroke="#EFE5DE"/>
  <text x="286" y="1082" font-size="18" font-weight="600" fill="#FF5A5F" font-family="PingFang SC, Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif">04  人民日报</text>
  <text x="286" y="1122" font-size="30" font-weight="700" fill="#1C1C1C" font-family="PingFang SC, Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif">媒体实习</text>
  <text x="286" y="1156" font-size="20" font-weight="400" fill="#6F6460" font-family="PingFang SC, Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif">做科学家访谈、传播数据分析与稿件主笔，形成对内容信任、</text>
  <text x="286" y="1184" font-size="20" font-weight="400" fill="#6F6460" font-family="PingFang SC, Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif">真实表达与传播效果之间关系的直观理解。</text>

  <rect x="252" y="1262" width="794" height="152" rx="26" fill="#FFFFFF" stroke="#EFE5DE"/>
  <text x="286" y="1314" font-size="18" font-weight="600" fill="#FF5A5F" font-family="PingFang SC, Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif">05  个人开发经历</text>
  <text x="286" y="1354" font-size="30" font-weight="700" fill="#1C1C1C" font-family="PingFang SC, Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif">RAG / Agent / AI 专家系统</text>
  <text x="286" y="1388" font-size="20" font-weight="400" fill="#6F6460" font-family="PingFang SC, Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif">持续在真实场景中做信息效率、产品可信度与用户决策相关的</text>
  <text x="286" y="1416" font-size="20" font-weight="400" fill="#6F6460" font-family="PingFang SC, Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif">产品探索，把 AI 能力落实到可验证、可落地的产品闭环里。</text>

  <rect x="146" y="1518" width="908" height="168" rx="30" fill="#FFF4F4" stroke="#F2DCDC"/>
  <text x="188" y="1578" font-size="22" font-weight="600" fill="#FF5A5F" font-family="PingFang SC, Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif">我对自己的概括</text>
  <text x="188" y="1614" font-size="24" font-weight="700" fill="#1C1C1C" font-family="PingFang SC, Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif">长时间接触内容社区，做过 AI 产品，能用调研和数据把复杂问题推进到落地。</text>
  <text x="188" y="1650" font-size="20" font-weight="400" fill="#6F6460" font-family="PingFang SC, Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif">对用产品改善人们生活和工作有浓厚兴趣和驱动力。</text>

</svg>`;

fs.writeFileSync(outSvg, svg, "utf8");
