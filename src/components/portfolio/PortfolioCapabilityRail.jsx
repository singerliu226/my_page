import React from 'react';

/**
 * @fileoverview 首页能力证据带。
 * 先让招聘方看到能力链路，再进入具体项目，避免首页只留下抽象自我介绍。
 */

function PortfolioCapabilityRail({ items, sectionId }) {
  return (
    <section className="portfolio-capability-rail" id={sectionId} aria-label="AI 产品能力链路">
      <div className="portfolio-capability-rail__heading">
        <p>核心能力</p>
        <div>
          <h2>从真实问题到可验证结果的产品闭环</h2>
          <span>以用户洞察定义问题，用产品方案承接 AI 能力，再通过评估与反馈持续迭代。</span>
        </div>
      </div>

      <div className="portfolio-capability-rail__list">
        {items.map((item) => (
          <article key={item.index} className="portfolio-capability-rail__item">
            <div className="portfolio-capability-rail__meta">
              <span>{item.index}</span>
              <small>{item.eyebrow}</small>
            </div>
            <h2>{item.title}</h2>
            <p>{item.description}</p>
            <strong>{item.proof}</strong>
          </article>
        ))}
      </div>
    </section>
  );
}

export default PortfolioCapabilityRail;
