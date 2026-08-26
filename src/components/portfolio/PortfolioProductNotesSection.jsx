import React from 'react';

/**
 * @fileoverview 产品心得专题。
 * 以评测集建设为例，呈现从题域、标准到回归验证的真实产品判断。
 */
function PortfolioProductNotesSection({ notes, sectionId }) {
  return (
    <section className="portfolio-product-notes" id={sectionId} aria-label="产品心得">
      <div className="portfolio-section__heading portfolio-section__heading--page">
        <p>评论 · NOTES</p>
        <h1>产品心得与方法</h1>
        <small>把对 AI 产品质量、边界与用户体验的判断，写成可以复查和持续迭代的标准。</small>
      </div>
      <div className="portfolio-product-notes__mast">
        <p>{notes.eyebrow}</p>
        <h2>{notes.title}</h2>
        <p className="portfolio-product-notes__intro">{notes.intro}</p>
      </div>

      <div className="portfolio-product-notes__body">
        <ol className="portfolio-product-notes__steps">
          {notes.steps.map((step) => (
            <li key={step.title}>
              <span>{step.index}</span>
              <div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            </li>
          ))}
        </ol>
        <aside className="portfolio-product-notes__sidebar">
          <p>一套评测体系的价值，是明确什么算好、什么不能出错，以及问题该如何被解释。</p>
          <dl>
            {notes.evidence.map((item) => (
              <div key={item.label}>
                <dt>{item.label}</dt>
                <dd>{item.value}</dd>
              </div>
            ))}
          </dl>
        </aside>
      </div>
    </section>
  );
}

export default PortfolioProductNotesSection;
