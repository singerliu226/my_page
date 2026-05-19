import React from 'react';
import { Link } from 'react-router-dom';

/**
 * @fileoverview 精选作品矩阵。
 * 外部作品用于证明转化与表达能力，内部项目用于展示更完整的工程与产品闭环。
 */

/**
 * 作品区块。
 *
 * @param {Object} props - 组件属性
 * @param {Array<{title: string, subtitle: string, description: string, ownership: string, practiceHighlights: string[], tech: string[], href: string, actionLabel: string, type: string}>} props.works - 作品数据
 * @returns {JSX.Element}
 */
function PortfolioWorksSection({ works }) {
  return (
    <section id="works" className="portfolio-section">
      <div className="portfolio-section__heading">
        <p>Selected Works</p>
        <h2>我做的每一件事情，都是基于生活中遇到的真实需求</h2>
      </div>

      <div className="portfolio-work-grid">
        {works.map((work) => {
          const resolvedHref = work.href;
          const isExternal = work.type === 'external' || /^https?:\/\//.test(resolvedHref);
          const hasLink = Boolean(resolvedHref);

          const linkProps = isExternal
            ? { href: resolvedHref, target: '_blank', rel: 'noreferrer noopener' }
            : { to: resolvedHref };

          return (
            <article key={work.title} className="portfolio-panel portfolio-work-card">
              <div className="portfolio-work-card__top">
                <span className="portfolio-work-card__type">
                  {isExternal ? 'Live Site' : 'Local Project'}
                </span>
                <h3>{work.title}</h3>
                <p className="portfolio-work-card__subtitle">{work.subtitle}</p>
              </div>

              <p className="portfolio-work-card__description">{work.description}</p>

              <div className="portfolio-work-card__group">
                <strong>职责占比</strong>
                <p className="portfolio-work-card__ownership">{work.ownership}</p>
              </div>

              <div className="portfolio-work-card__group">
                <strong>实践亮点</strong>
                <ul className="portfolio-bullets portfolio-bullets--compact">
                  {work.practiceHighlights.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="portfolio-work-card__group">
                <strong>关键词</strong>
                <div className="portfolio-chip-list">
                  {work.tech.map((item) => (
                    <span key={item} className="portfolio-chip portfolio-chip--ghost">
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              {!hasLink ? (
                <span className="portfolio-work-card__link" aria-disabled="true">
                  {work.actionLabel}
                </span>
              ) : isExternal ? (
                <a className="portfolio-work-card__link" {...linkProps}>
                  {work.actionLabel}
                </a>
              ) : (
                <Link className="portfolio-work-card__link" {...linkProps}>
                  {work.actionLabel}
                </Link>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default PortfolioWorksSection;
