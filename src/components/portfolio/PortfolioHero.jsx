import React from 'react';
import { Link } from 'react-router-dom';

/**
 * @fileoverview 首页 Hero 区块。
 * 采用左对齐的 editorial 排版：眼眉 → 姓名 → 主标题 → 简介 →
 * 关键事实，让访客在第一屏完成「这是谁 / 在做什么 / 凭什么」的初次判断。
 */

function PortfolioHero({ hero }) {
  return (
    <section className="portfolio-hero" id="about">
      <div className="portfolio-hero__content">
        <div className="portfolio-hero__lede">
          <p className="portfolio-eyebrow">{hero.eyebrow}</p>
          <h1>{hero.name}</h1>
          {hero.identity && <p className="portfolio-hero__identity">{hero.identity}</p>}
          <div className="portfolio-hero__summary-block" aria-label="个人简介">
            <p className="portfolio-hero__summary-label">{hero.summaryLabel ?? '个人总结'}</p>
            <h2>{hero.headline}</h2>
            <div className="portfolio-hero__summary">
              {hero.summaryLines.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          </div>
          {hero.actions?.length > 0 && (
            <div className="portfolio-hero__actions" aria-label="重点入口">
              {hero.actions.map((action) => {
                const className = `portfolio-hero__action portfolio-hero__action--${action.type}`;

                if (action.external) {
                  return (
                    <a key={action.label} className={className} href={action.href} target="_blank" rel="noreferrer">
                      {action.label}
                      <span aria-hidden="true">{action.arrow ?? '↗'}</span>
                    </a>
                  );
                }

                return (
                  <Link key={action.label} className={className} to={action.href}>
                    {action.label}
                    <span aria-hidden="true">{action.arrow ?? '→'}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        <aside className="portfolio-hero__news-brief" aria-label="个人简介补充">
          <div className="portfolio-hero__archive-mark">
            <span>{hero.archive?.code}</span>
            <strong>{hero.archive?.label}</strong>
          </div>
          <p className="portfolio-hero__brief-kicker">{hero.briefKicker ?? '我在做什么'}</p>
          <p className="portfolio-hero__brief-copy">{hero.briefCopy ?? '从信息判断出发，把内容、模型与真实使用场景组织成可验证的产品闭环。'}</p>
          {hero.archive?.description && <p className="portfolio-hero__archive-description">{hero.archive.description}</p>}
          {hero.quickFacts && hero.quickFacts.length > 0 && (
            <dl className="portfolio-hero__facts" aria-label="关键事实">
              {hero.quickFacts.map((fact) => (
                <div key={fact.label}>
                  <dt>{fact.label}</dt>
                  <dd>{fact.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </aside>
      </div>
    </section>
  );
}

export default PortfolioHero;
