import React from 'react';

/**
 * @fileoverview 展示候选人的工作方法。
 * 这里强调的是判断与落地方式，而不是工具名堆砌，
 * 让招聘方更快理解“为什么她做出的页面和产品有说服力”。
 */

/**
 * 工作方法区块。
 *
 * @param {Object} props - 组件属性
 * @param {Array<{title: string, badge: string, description: string}>} props.methods - 方法论卡片
 * @returns {JSX.Element}
 */
function PortfolioMethodSection({ methods }) {
  return (
    <section id="method" className="portfolio-section">
      <div className="portfolio-section__heading">
        <p>工作方法</p>
        <h2>我如何把一个模糊问题推进成可交付产品</h2>
      </div>

      <div className="portfolio-method-grid">
        {methods.map((method) => (
          <article key={method.title} className="portfolio-panel portfolio-method-card">
            <span className="portfolio-method-card__badge">{method.badge}</span>
            <h3>{method.title}</h3>
            <p>{method.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default PortfolioMethodSection;
