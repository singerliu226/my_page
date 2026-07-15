import React from 'react';

/**
 * @fileoverview Lyncia 大院 demo 的脱敏案例展示。
 * 通过可体验 demo、负责范围与评测边界，让招聘方理解候选人具体做了什么，
 * 而不是把内部项目包装成无法验证的功能清单。
 */
function PortfolioLynciaCase({ caseStudy }) {
  return (
    <section className="portfolio-lyncia-case" aria-label="Lyncia 大院案例">
      <div className="portfolio-lyncia-case__heading">
        <p>{caseStudy.eyebrow}</p>
        <h2>{caseStudy.title}</h2>
        <span>{caseStudy.summary}</span>
      </div>

      <div className="portfolio-lyncia-case__card">
        <figure className="portfolio-lyncia-case__visual">
          <img src={caseStudy.image.src} alt={caseStudy.image.alt} />
          <figcaption>{caseStudy.caption}</figcaption>
        </figure>

        <div className="portfolio-lyncia-case__content">
          <dl>
            {caseStudy.evidence.map((item) => (
              <div key={item.label}>
                <dt>{item.label}</dt>
                <dd>{item.value}</dd>
              </div>
            ))}
          </dl>

          <div className="portfolio-lyncia-case__metrics" aria-label="Lyncia 大院案例事实">
            {caseStudy.metrics.map((item) => (
              <div key={item.label}>
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default PortfolioLynciaCase;
