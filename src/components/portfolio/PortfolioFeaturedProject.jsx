import React, { useState } from 'react';
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
  const screenshots = project.screenshots?.length > 0
    ? project.screenshots
    : [{ src: project.cover, alt: `${project.title} 产品界面`, label: '产品界面' }];
  const [activeScreenshotIndex, setActiveScreenshotIndex] = useState(0);
  const activeScreenshot = screenshots[activeScreenshotIndex] ?? screenshots[0];

  return (
    <section className="portfolio-featured-project" id={sectionId} aria-label="代表项目">
      <div className="portfolio-featured-project__section-heading">
        <p>代表项目</p>
        <h2>把能力判断做成真实的产品闭环</h2>
        <span>以新传 Mind 为例：从真实问题、AI 方案到练习结果的验证。</span>
      </div>

      <div className="portfolio-featured-project__card">
        <div className="portfolio-featured-project__cover">
          <a
            className="portfolio-featured-project__live-cover"
            href={project.liveHref}
            target="_blank"
            rel="noreferrer"
            aria-label={`在线体验 ${project.title}`}
          >
            <img src={activeScreenshot.src} alt={activeScreenshot.alt} />
            <span>在线体验 ↗</span>
          </a>
          <div className="portfolio-featured-project__carousel" role="tablist" aria-label="新传 Mind 产品截图">
            {screenshots.map((screenshot, index) => (
              <button
                key={screenshot.src}
                type="button"
                role="tab"
                aria-selected={index === activeScreenshotIndex}
                aria-label={`查看${screenshot.label}`}
                className={index === activeScreenshotIndex ? 'is-active' : ''}
                onClick={() => setActiveScreenshotIndex(index)}
              >
                {String(index + 1).padStart(2, '0')}
              </button>
            ))}
          </div>
          <div className="portfolio-featured-project__cover-caption">
            <span>真实产品界面 · {String(activeScreenshotIndex + 1).padStart(2, '0')} / {String(screenshots.length).padStart(2, '0')}</span>
            <strong>{activeScreenshot.label}</strong>
          </div>
        </div>

        <div className="portfolio-featured-project__content">
          <div className="portfolio-featured-project__intro">
            <p className="portfolio-eyebrow">{project.eyebrow}</p>
            <h2>{project.title}</h2>
            <h3>{project.subtitle}</h3>
            <p className="portfolio-featured-project__summary">{project.summary}</p>
          </div>

          <dl className="portfolio-featured-project__evidence">
            <div>
              <dt>用户问题</dt>
              <dd>{project.context}</dd>
            </div>
            <div>
              <dt>产品设计</dt>
              <dd>{project.mechanism}</dd>
            </div>
            <div>
              <dt>{project.validationLabel ?? '验证进展'}</dt>
              <dd>{project.evidence}</dd>
            </div>
          </dl>

          {project.metrics?.length > 0 && (
            <div className="portfolio-featured-project__metrics" aria-label="新传 Mind 迭代证据">
              {project.metrics.map((metric) => (
                <div key={metric.label}>
                  <span>{metric.label}</span>
                  <strong>{metric.value}</strong>
                </div>
              ))}
              {project.metricsNote && <p>{project.metricsNote}</p>}
            </div>
          )}

          <div className="portfolio-featured-project__footer">
            <Link className="portfolio-featured-project__link" to={project.href}>
              {project.actionLabel}
              <span aria-hidden="true">→</span>
            </Link>
            <a className="portfolio-featured-project__link portfolio-featured-project__link--live" href={project.liveHref} target="_blank" rel="noreferrer">
              在线体验
              <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default PortfolioFeaturedProject;
