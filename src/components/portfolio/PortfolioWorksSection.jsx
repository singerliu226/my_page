import React from 'react';

/**
 * 项目案例以同一张左右结构卡片呈现：左侧只放可核验的真实界面与链接，
 * 右侧统一交代问题、个人角色与可复查的工作证据。
 */
function PortfolioWorksSection({ works }) {
  return (
    <section id="works" className="portfolio-section portfolio-projects" aria-label="项目案例">
      <div className="portfolio-section__heading">
        <p>深度专栏 · WORKS / VIBE CODING</p>
        <h1>项目 / vibe coding</h1>
        <small>说明：部分作品为 demo 级，仅用于呈现问题判断与产品想法；后续仍将持续完善。</small>
      </div>

      <div className="portfolio-project-list">
        {works.map((work, index) => {
          const isExternal = work.type === 'external' || /^https?:\/\//.test(work.href ?? '');
          const actionProps = isExternal
            ? { target: '_blank', rel: 'noreferrer noopener' }
            : {};

          return (
            <article key={work.title} className="portfolio-project-card">
              <figure className={`portfolio-project-card__media portfolio-project-card__media--${work.mediaFormat ?? 'pending'}`}>
                {work.screenshot ? (
                  work.href ? (
                    <a href={work.href} aria-label={`查看 ${work.title}`} {...actionProps}>
                      <img src={work.screenshot} alt={work.screenshotAlt ?? `${work.title} 产品截图`} />
                      <span>查看产品 {isExternal ? '↗' : '→'}</span>
                    </a>
                  ) : (
                    <div className="portfolio-project-card__media-static">
                      <img src={work.screenshot} alt={work.screenshotAlt ?? `${work.title} 产品截图`} />
                      <span>{work.mediaLabel ?? '项目截图 · 暂不公开体验'}</span>
                    </div>
                  )
                ) : (
                  <div className="portfolio-project-card__asset-pending">
                    <span>项目视觉素材待补</span>
                    <p>{work.assetNote ?? '需要提供真实产品截图或可访问体验地址后展示。'}</p>
                  </div>
                )}
                <figcaption>项目 {String(index + 1).padStart(2, '0')} · {work.subtitle}</figcaption>
              </figure>

              <div className="portfolio-project-card__content">
                <div className="portfolio-project-card__title">
                  <p>{work.type === 'external' ? '可在线体验' : '产品实践'}</p>
                  <h3>{work.title}</h3>
                  <span>{work.subtitle}</span>
                </div>

                <dl className="portfolio-project-card__details">
                  <div>
                    <dt>问题与方案</dt>
                    <dd>{work.description}</dd>
                  </div>
                  <div>
                    <dt>我的角色</dt>
                    <dd>{work.ownership}</dd>
                  </div>
                </dl>

                <div className="portfolio-project-card__evidence">
                  <p>产品证据</p>
                  <ul className="portfolio-bullets portfolio-bullets--compact">
                    {work.practiceHighlights.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                </div>

                <div className="portfolio-project-card__footer">
                  <div className="portfolio-chip-list">
                    {work.tech.map((item) => <span key={item} className="portfolio-chip portfolio-chip--ghost">{item}</span>)}
                  </div>
                  {work.href ? (
                    <a className="portfolio-project-card__link" href={work.href} {...actionProps}>
                      {work.actionLabel} <span aria-hidden="true">{isExternal ? '↗' : '→'}</span>
                    </a>
                  ) : (
                    <span className="portfolio-project-card__link portfolio-project-card__link--disabled">{work.actionLabel}</span>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default PortfolioWorksSection;
