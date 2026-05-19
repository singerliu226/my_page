import React from 'react';
import { Link } from 'react-router-dom';

/**
 * @fileoverview 首页目录分栏。
 * 这组卡片承担首页的主要导航职责，帮助用户先理解信息结构，
 * 再进入对应详情页查看完整内容。
 */

/**
 * 首页目录区块。
 *
 * @param {Object} props - 组件属性
 * @param {Array<{title: string, href: string, eyebrow: string, description: string}>} props.sections - 导航分栏
 * @returns {JSX.Element}
 */
function PortfolioDirectorySection({ sections }) {
  return (
    <section className="portfolio-directory">
      <div className="portfolio-directory-grid">
        {sections.map((section) => (
          <Link key={section.title} className="portfolio-panel portfolio-directory-card" to={section.href}>
            <span className="portfolio-directory-card__eyebrow">{section.eyebrow}</span>
            <h3>{section.title}</h3>
            <p>{section.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default PortfolioDirectorySection;
