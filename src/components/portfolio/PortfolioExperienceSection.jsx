import React from 'react';

/**
 * @fileoverview 关键经历时间带。
 * 使用“问题-动作-结果”的摘要结构，是为了避免页面退化成传统简历的流水账。
 */

/**
 * 经历区块。
 *
 * @param {Object} props - 组件属性
 * @param {Array<{period: string, organization: string, role: string, summary: string, highlights: string[]}>} props.experiences - 关键经历
 * @returns {JSX.Element}
 */
function PortfolioExperienceSection({ experiences }) {
  return (
    <section id="experience" className="portfolio-section">
      <div className="portfolio-section__heading">
        <p>Experience Arc</p>
        <h2>从内容、媒体到 AI 产品，我的能力主线一直在收束</h2>
      </div>

      <div className="portfolio-timeline">
        {experiences.map((experience) => (
          <article key={`${experience.organization}-${experience.period}`} className="portfolio-panel portfolio-timeline__item">
            <div className="portfolio-timeline__meta">
              <span>{experience.period}</span>
              <strong>{experience.organization}</strong>
              <small>{experience.role}</small>
            </div>

            <div className="portfolio-timeline__content">
              <p>{experience.summary}</p>
              <ul className="portfolio-bullets">
                {experience.highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default PortfolioExperienceSection;
