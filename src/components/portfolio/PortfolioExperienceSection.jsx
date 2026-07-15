import React from 'react';

/**
 * @fileoverview 关键经历时间带。
 * 使用“问题-动作-结果”的摘要结构，是为了避免页面退化成传统简历的流水账。
 */

/**
 * 经历区块。
 *
 * @param {Object} props - 组件属性
 * @param {Array<{category: string, period: string, organization: string, role: string, summary: string, highlights: string[]}>} props.experiences - 关键经历
 * @returns {JSX.Element}
 */
function PortfolioExperienceSection({ experiences }) {
  const groups = [
    {
      key: 'internship',
      eyebrow: '实习经历',
      title: '在真实组织中学习把判断推进为产品',
      items: experiences.filter((experience) => experience.category === 'internship'),
    },
    {
      key: 'personal',
      eyebrow: '个人项目',
      title: '独立把问题、原型与验证做成闭环',
      items: experiences.filter((experience) => experience.category === 'personal'),
    },
  ];

  return (
    <section id="experience" className="portfolio-section" aria-label="经历">
      {groups.map((group) => (
        <section key={group.key} className="portfolio-experience-group" aria-label={group.eyebrow}>
          <div className="portfolio-experience-group__heading">
            <p>{group.eyebrow}</p>
            <h3>{group.title}</h3>
          </div>
          <div className="portfolio-timeline">
            {group.items.map((experience) => (
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
      ))}
    </section>
  );
}

export default PortfolioExperienceSection;
