import React from 'react';

/**
 * @fileoverview 深度案例区块。
 * 这个部分的目标不是罗列功能，而是向招聘方解释我在复杂问题里如何做关键取舍。
 */

/**
 * 深度案例区块。
 *
 * @param {Object} props - 组件属性
 * @param {Array<{title: string, hook: string, context: string, decisions: string[], outcome: string}>} props.caseStudies - 案例数据
 * @returns {JSX.Element}
 */
function PortfolioCaseStudiesSection({ caseStudies }) {
  return (
    <section id="cases" className="portfolio-section">
      <div className="portfolio-section__heading">
        <p>编辑手记</p>
        <h2>真正能说明问题的，不是我会哪些工具，而是我如何做关键决策</h2>
      </div>

      <div className="portfolio-case-list">
        {caseStudies.map((caseStudy, index) => (
          <article key={caseStudy.title} className="portfolio-panel portfolio-case-card">
            <div className="portfolio-case-card__intro">
              <span className="portfolio-case-card__index">Case File {String(index + 1).padStart(2, '0')}</span>
              <h3>{caseStudy.title}</h3>
              <p>{caseStudy.hook}</p>
            </div>

            <div className="portfolio-case-card__body">
              <div>
                <span>背景与洞察</span>
                <p>{caseStudy.context}</p>
              </div>

              <div>
                <span>关键取舍</span>
                <ul className="portfolio-bullets">
                  {caseStudy.decisions.map((decision) => (
                    <li key={decision}>{decision}</li>
                  ))}
                </ul>
              </div>

              <div>
                <span>结果</span>
                <p>{caseStudy.outcome}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default PortfolioCaseStudiesSection;
