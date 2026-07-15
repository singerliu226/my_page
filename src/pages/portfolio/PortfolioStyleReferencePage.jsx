import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import usePageMetadata from '../../hooks/usePageMetadata';
import '../../styles/style-reference.css';

const capabilityTabs = [
  {
    key: 'insight',
    label: '洞察',
    eyebrow: 'User Insight',
    title: '先把真实问题问出来',
    copy: '从访谈、场景拆解到指标定义，先判断用户为什么需要 AI，再决定产品应该长什么样。',
    proof: ['30+ 备考学生访谈', '10+ 员工与客户访谈', '需求边界与 PRD 输出'],
  },
  {
    key: 'content',
    label: '内容',
    eyebrow: 'Content AI',
    title: '把内容沉淀成知识资产',
    copy: '把专业资料、业务文档、访谈记录和媒体内容整理成可检索、可追溯、可评估的知识底座。',
    proof: ['6 大主题知识库', '200+ 核心资料整理', '内容可信度判断'],
  },
  {
    key: 'system',
    label: '系统',
    eyebrow: 'AI System',
    title: '设计可验证的 AI 闭环',
    copy: '不只做生成入口，而是把知识库、提示词、评估集、反馈数据和交互流程一起设计。',
    proof: ['RAG / Agent', 'Prompt Engineering', '回归测试与反馈飞轮'],
  },
  {
    key: 'launch',
    label: '落地',
    eyebrow: 'Launch',
    title: '让产品进入真实使用',
    copy: '通过 A/B、留存、转化、转人工率和使用成本等指标，持续校准 AI 产品判断。',
    proof: ['A/B 评测', '留存与功能使用率', '降本增效指标'],
  },
];

const projectCards = [
  {
    key: 'mind',
    title: '新传 Mind',
    meta: 'AI 备考专家系统',
    role: '产品 / 设计 / 开发',
    scene: '新传考研学生需要把真题、知识点、练习和反馈统一起来。',
    ai: 'RAG 知识库、真题分析、AI 作答、四维评估。',
    result: '核心模块已端到端运行，正在建设回归测试集与 SFT 数据。',
    href: '/works',
    cover: '/portfolio/covers/xinchuang-mind-cover.png',
    tags: ['RAG', '知识库', '评估系统'],
  },
  {
    key: 'bar',
    title: '酒吧智能客服',
    meta: '夜间消费 RAG 客服',
    role: '产品 / 开发',
    scene: '客户在价格、预订、活动、转人工之间反复沟通，门店运营成本高。',
    ai: '多轮问答、价格查询、意图识别、业务资料 RAG 检索。',
    result: '转人工率降至 25%，运营成本降低 25%，意图识别准确率 92%。',
    href: '/works',
    tags: ['客服自动化', 'RRF Top5', '本地部署'],
  },
  {
    key: 'paper',
    title: '论文盾',
    meta: '论文 AI 检测与降重',
    role: '独立产品',
    scene: '写作者希望快速理解 AI 痕迹，并用可控方式完成逐段改写。',
    ai: '上传、检测、改写、下载四步工具流。',
    result: '把复杂论文处理压缩成清晰流程，降低用户理解和操作成本。',
    href: 'https://aigctest.zeabur.app/',
    tags: ['AI Workflow', '转化页面', '工具体验'],
  },
  {
    key: 'rednote',
    title: 'RedNote Collector',
    meta: '内容采集与整理工具',
    role: 'React / Vite',
    scene: '内容研究需要批量搜索、采集、整理小红书笔记，并导出可复用材料。',
    ai: '搜索、采集、整理、导出与日志服务。',
    result: '把内容研究工作链落到可运行系统，方便选题分析和资料沉淀。',
    href: '/projects/rednote',
    tags: ['内容研究', '采集导出', '工程落地'],
  },
];

const photos = [
  {
    src: '/portfolio/photos/forest-portrait.jpg',
    title: '个人照片',
    copy: '保留一点真实生活感，让 AI 作品集不只有系统和指标。',
  },
  {
    src: '/portfolio/photos/blossom.jpg',
    title: '影像审美',
    copy: '后续可以把你的风景照变成页面里的个人影集模块。',
  },
  {
    src: '/portfolio/photos/city-building.jpg',
    title: '城市观察',
    copy: '内容产品经理需要对场景、人和表达保持敏感。',
  },
];

const avatarConcepts = [
  {
    key: 'manga',
    title: '黑白漫画',
    tone: '锐利、年轻、记忆点强',
    use: '适合作为首页头像和社媒头像',
  },
  {
    key: 'sticker',
    title: '3D 贴纸',
    tone: '轻松、有产品感、适合动效',
    use: '适合悬浮头像和页面彩蛋',
  },
  {
    key: 'line',
    title: '手绘线稿',
    tone: '克制、聪明、内容气质强',
    use: '适合 About 和个人影集旁边',
    image: '/portfolio/avatars/liuchang-handdrawn.svg',
  },
  {
    key: 'editorial',
    title: '职业插画',
    tone: '正式、可信、招聘友好',
    use: '适合简历页和项目详情页',
  },
];

function PortfolioStyleReferencePage() {
  const [activeCapability, setActiveCapability] = useState(capabilityTabs[0].key);
  const [activeAvatar, setActiveAvatar] = useState(avatarConcepts[0].key);
  const active = useMemo(
    () => capabilityTabs.find((item) => item.key === activeCapability) ?? capabilityTabs[0],
    [activeCapability],
  );
  const selectedAvatar = useMemo(
    () => avatarConcepts.find((item) => item.key === activeAvatar) ?? avatarConcepts[0],
    [activeAvatar],
  );

  usePageMetadata({
    title: 'AI 产品能力展示型个人站 | 刘唱',
    description: '刘唱面向 AI 产品经理与内容 AI 产品方向的新版个人主页定位稿。',
  });

  useEffect(() => {
    const revealNodes = document.querySelectorAll('.sr-reveal');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.16 });

    revealNodes.forEach((node) => observer.observe(node));

    const hero = document.querySelector('.style-ref-hero');
    const handlePointerMove = (event) => {
      const rect = hero.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      hero.style.setProperty('--mx', x.toFixed(3));
      hero.style.setProperty('--my', y.toFixed(3));
    };

    hero?.addEventListener('pointermove', handlePointerMove);

    return () => {
      observer.disconnect();
      hero?.removeEventListener('pointermove', handlePointerMove);
    };
  }, []);

  return (
    <main className="style-ref-page">
      <header className="style-ref-nav">
        <Link className="style-ref-logo" to="/">
          <strong>刘唱</strong>
          <span>AI Product / Content AI</span>
        </Link>
        <nav aria-label="AI 产品个人站导航">
          <a href="#projects">Projects</a>
          <a href="#method">Method</a>
          <a href="#about">About</a>
        </nav>
        <Link className="style-ref-nav__home" to="/">
          Back Home
        </Link>
      </header>

      <section className="style-ref-hero" aria-label="AI 产品能力展示首屏">
        <div className="style-ref-hero__inner">
          <div className="style-ref-hero__copy sr-reveal">
            <p className="style-ref-kicker">AI Product Manager / Content AI</p>
            <h1>懂内容，也能把 AI 产品落地。</h1>
            <p className="style-ref-lede">
              我希望这个个人站第一眼传达的不是“会用工具”，而是能把用户问题、内容资产、模型能力和上线结果组织成一个可靠产品。
            </p>
            <div className="style-ref-memory" aria-label="核心记忆点">
              <span>有审美</span>
              <span>会落地</span>
              <span>懂内容</span>
            </div>
          </div>

          <aside className="style-ref-workbench sr-reveal" aria-label="AI 产品能力工作台">
            <div className="style-ref-workbench__header">
              <span>AI PM Workbench</span>
              <strong>{active.eyebrow}</strong>
            </div>
            <div className="style-ref-workbench__tabs">
              {capabilityTabs.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  className={item.key === activeCapability ? 'is-active' : ''}
                  onClick={() => setActiveCapability(item.key)}
                  aria-pressed={item.key === activeCapability}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <div className="style-ref-workbench__body" aria-live="polite">
              <h2>{active.title}</h2>
              <p>{active.copy}</p>
              <ul>
                {active.proof.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>

      <section className="style-ref-projects" id="projects">
        <div className="style-ref-section-title sr-reveal">
          <span>Selected Work</span>
          <h2>项目不按“炫技”排序，而按问题和结果排序。</h2>
          <p>每个案例都需要让招聘方快速看见：我理解谁、用了什么 AI 能力、最后验证到了什么。</p>
        </div>

        <div className="style-ref-project-grid">
          {projectCards.map((project, index) => {
            const external = project.href.startsWith('http');
            const CardLink = external ? 'a' : Link;
            const linkProps = external
              ? { href: project.href, target: '_blank', rel: 'noreferrer' }
              : { to: project.href };

            return (
              <CardLink
                key={project.key}
                className="style-ref-project-card sr-reveal"
                style={{ '--delay': `${index * 70}ms` }}
                {...linkProps}
              >
                <ProjectVisual project={project} />
                <div className="style-ref-project-card__body">
                  <div className="style-ref-project-card__meta">
                    <span>{project.meta}</span>
                    <strong>{project.role}</strong>
                  </div>
                  <h3>{project.title}</h3>
                  <dl>
                    <div>
                      <dt>场景</dt>
                      <dd>{project.scene}</dd>
                    </div>
                    <div>
                      <dt>AI 机制</dt>
                      <dd>{project.ai}</dd>
                    </div>
                    <div>
                      <dt>证据</dt>
                      <dd>{project.result}</dd>
                    </div>
                  </dl>
                  <div className="style-ref-project-card__tags">
                    {project.tags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                </div>
              </CardLink>
            );
          })}
        </div>
      </section>

      <section className="style-ref-method" id="method">
        <div className="style-ref-method__intro sr-reveal">
          <span>Product Method</span>
          <h2>我的 AI 产品方法是“先建立语境，再让模型工作”。</h2>
        </div>
        <div className="style-ref-method__grid">
          {capabilityTabs.map((item, index) => (
            <button
              key={item.key}
              type="button"
              className={`style-ref-method-card sr-reveal ${item.key === activeCapability ? 'is-active' : ''}`}
              style={{ '--delay': `${index * 65}ms` }}
              onClick={() => setActiveCapability(item.key)}
            >
              <span>{String(index + 1).padStart(2, '0')}</span>
              <strong>{item.title}</strong>
              <p>{item.copy}</p>
            </button>
          ))}
        </div>
      </section>

      <section className="style-ref-about" id="about">
        <div className="style-ref-about__copy sr-reveal">
          <span>Personal Texture</span>
          <h2>正式，但不无聊；年轻，但不漂浮。</h2>
          <p>
            新版可以用白底高对比建立专业感，用照片、卡通形象和项目封面建立记忆点。动效不需要很多，但每一次点击和滚动都应该在强化“AI 产品能力”。
          </p>
          <div className="style-ref-avatar-note">
            <img
              src={selectedAvatar.image ?? '/profile/liuchang-portrait.jpg'}
              alt={`${selectedAvatar.title}头像预览`}
            />
            <div>
              <strong>{selectedAvatar.title}</strong>
              <p>{selectedAvatar.tone}。{selectedAvatar.use}。</p>
            </div>
          </div>
          <div className="style-ref-avatar-switch" aria-label="卡通形象方向选择">
            {avatarConcepts.map((concept) => (
              <button
                key={concept.key}
                type="button"
                className={concept.key === activeAvatar ? 'is-active' : ''}
                onClick={() => setActiveAvatar(concept.key)}
                aria-pressed={concept.key === activeAvatar}
              >
                <span>{concept.title}</span>
                <strong>{concept.tone}</strong>
              </button>
            ))}
          </div>
        </div>

        <div className="style-ref-photo-grid sr-reveal">
          {photos.map((photo, index) => (
            <figure key={photo.src} className={index === 0 ? 'is-large' : ''}>
              <img src={photo.src} alt={photo.title} />
              <figcaption>
                <strong>{photo.title}</strong>
                <span>{photo.copy}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="style-ref-contact sr-reveal" id="contact">
        <div>
          <span>Contact</span>
          <h2>让页面最后落到可以联系、可以查看、可以继续判断。</h2>
        </div>
        <div className="style-ref-contact__links">
          <a href="mailto:singer226@163.com">singer226@163.com</a>
          <a href="tel:15202171290">152 0217 1290</a>
          <a href="https://github.com/singerliu226" target="_blank" rel="noreferrer">GitHub</a>
          <a href="/resume/liuchang-resume.pdf" target="_blank" rel="noreferrer">Resume</a>
        </div>
      </section>
    </main>
  );
}

function ProjectVisual({ project }) {
  if (project.cover) {
    return (
      <div className="style-ref-cover style-ref-cover--image">
        <img src={project.cover} alt={`${project.title} 项目封面`} />
      </div>
    );
  }

  return (
    <div className={`style-ref-cover style-ref-cover--${project.key}`} aria-label={`${project.title} 临时视觉头图`}>
      <span className="style-ref-cover__stamp" />
      <span className="style-ref-cover__panel style-ref-cover__panel--main" />
      <span className="style-ref-cover__panel style-ref-cover__panel--side" />
      <span className="style-ref-cover__line style-ref-cover__line--one" />
      <span className="style-ref-cover__line style-ref-cover__line--two" />
      <span className="style-ref-cover__label">{project.meta}</span>
    </div>
  );
}

export default PortfolioStyleReferencePage;
