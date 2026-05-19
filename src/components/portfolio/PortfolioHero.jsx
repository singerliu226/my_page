import React from 'react';

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
          <h2>{hero.headline}</h2>
          <div className="portfolio-hero__summary" aria-label="个人简介">
            {hero.summaryLines.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
        </div>

        <aside className="portfolio-hero__portrait-block" aria-hidden="false">
          <div className="portfolio-hero__portrait-frame">
            <img
              className="portfolio-hero__portrait"
              src={hero.portrait.src}
              alt={hero.portrait.alt}
              loading="eager"
              decoding="async"
            />
          </div>
          {hero.portrait.note && (
            <p className="portfolio-hero__portrait-note">{hero.portrait.note}</p>
          )}
        </aside>

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
      </div>
    </section>
  );
}

export default PortfolioHero;
