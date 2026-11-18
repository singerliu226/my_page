import React from 'react';
import { Link } from 'react-router-dom';

/**
 * 项目案例以同一张左右结构卡片呈现：左侧只放可核验的真实界面与链接，
 * 右侧先交代“我的角色、关键取舍、验证边界”，再讲问题、证据与技术。
 */

/** 链接分三种：站外网址和 /play 下的静态页开新窗口；站内页面走前端路由 */
function linkKind(href = '') {
  if (/^https?:\/\//.test(href) || href.startsWith('/play/')) return 'newTab';
  return href.startsWith('/') ? 'route' : 'plain';
}

function WorkLink({ href, children, ...rest }) {
  const kind = linkKind(href);
  if (kind === 'route') return <Link to={href} {...rest}>{children}</Link>;
  return (
    <a href={href} {...(kind === 'newTab' ? { target: '_blank', rel: 'noreferrer noopener' } : {})} {...rest}>
      {children}
    </a>
  );
}

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
          const arrow = linkKind(work.href) === 'newTab' ? '↗' : '→';
          const gallery = work.supplementalScreenshots ?? [];
          const frontmatter = [
            ['我的角色', work.role ?? work.ownership],
            ['我的取舍', work.decision],
            ['要说明的', work.validationLimit],
          ].filter(([, text]) => text);
          const mediaClass = [
            'portfolio-project-card__media',
            `portfolio-project-card__media--${work.mediaFormat ?? 'pending'}`,
            work.href && gallery.length > 0 ? 'portfolio-project-card__media--gallery' : '',
          ].filter(Boolean).join(' ');
          const cover = <img src={work.screenshot} alt={work.screenshotAlt ?? `${work.title} 产品截图`} loading="lazy" />;

          return (
            <article key={work.title} className="portfolio-project-card">
              <figure className={mediaClass}>
                {!work.screenshot && (
                  <div className="portfolio-project-card__asset-pending">
                    <span>项目视觉素材待补</span>
                    <p>{work.assetNote ?? '需要提供真实产品截图或可访问体验地址后展示。'}</p>
                  </div>
                )}
                {work.screenshot && work.href && gallery.length > 0 && (
                  <div className="portfolio-project-card__gallery">
                    <WorkLink className="portfolio-project-card__gallery-main" href={work.href} aria-label={`查看 ${work.title}`}>
                      {cover}
                      <span>查看产品 {arrow}</span>
                    </WorkLink>
                    {gallery.map((shot) => (
                      <WorkLink
                        key={shot.src}
                        className="portfolio-project-card__gallery-detail"
                        href={shot.href ?? work.href}
                        aria-label={`查看 ${work.title}：${shot.label}`}
                      >
                        <img src={shot.src} alt={shot.alt} loading="lazy" />
                        <span>{shot.label}</span>
                      </WorkLink>
                    ))}
                  </div>
                )}
                {work.screenshot && work.href && gallery.length === 0 && (
                  <WorkLink href={work.href} aria-label={`查看 ${work.title}`}>
                    {cover}
                    <span>{work.mediaLabel && linkKind(work.href) === 'route' ? work.mediaLabel : `查看产品 ${arrow}`}</span>
                  </WorkLink>
                )}
                {work.screenshot && !work.href && (
                  <div className="portfolio-project-card__media-static">
                    {cover}
                    <span>{work.mediaLabel ?? '项目截图 · 暂不公开体验'}</span>
                  </div>
                )}
                <figcaption>项目 {String(index + 1).padStart(2, '0')} · {work.subtitle}</figcaption>
              </figure>

              <div className="portfolio-project-card__content">
                <div className="portfolio-project-card__title">
                  <div className="portfolio-project-card__title-meta">
                    <p>{work.kicker ?? (work.type === 'external' ? '可在线体验' : '产品实践')}</p>
                    {work.period && <span>{work.period}</span>}
                  </div>
                  <h3>
                    <span>{work.title}</span>
                    {work.identityTag && <em>{work.identityTag}</em>}
                  </h3>
                  <span>{work.subtitle}</span>
                </div>

                {frontmatter.length > 0 && (
                  <dl className="portfolio-project-card__frontmatter">
                    {frontmatter.map(([label, text]) => (
                      <div key={label}>
                        <dt>{label}</dt>
                        <dd>{text}</dd>
                      </div>
                    ))}
                  </dl>
                )}

                <dl className="portfolio-project-card__details">
                  <div>
                    <dt>问题与方案</dt>
                    <dd>{work.description}</dd>
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
                    <WorkLink className="portfolio-project-card__link" href={work.href}>
                      {work.actionLabel} <span aria-hidden="true">{arrow}</span>
                    </WorkLink>
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
