import React from 'react';
import { Link } from 'react-router-dom';

/**
 * @fileoverview 首页精选 AI 项目。
 * 首页只突出一个代表性项目，是为了把“我做过很多”收束成
 * “我最值得先看什么”，让招聘场景的信息判断更高效。
 */

/**
 * 首页精选项目卡。
 *
 * @param {Object} props - 组件属性
 * @param {Object} props.project - 项目数据
 * @param {string} [props.sectionId] - 区块锚点 id
 * @returns {JSX.Element}
 */
function PortfolioFeaturedProject({ project, sectionId }) {
  return (
    <section className="portfolio-featured-project" id={sectionId} aria-label="个人 AI 项目">
      <div className="portfolio-featured-project__intro">
        <p className="portfolio-eyebrow">{project.eyebrow}</p>
        <h2>{project.title}</h2>
        <h3>{project.subtitle}</h3>
        <p className="portfolio-featured-project__summary">{project.summary}</p>
      </div>

      <div className="portfolio-featured-project__body">
        <ul className="portfolio-bullets portfolio-bullets--compact">
          {project.highlights.map((highlight) => (
            <li key={highlight}>{highlight}</li>
          ))}
        </ul>

        <Link className="portfolio-featured-project__link" to={project.href}>
          {project.actionLabel}
        </Link>
      </div>
    </section>
  );
}

export default PortfolioFeaturedProject;
