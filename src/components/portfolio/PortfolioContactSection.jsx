import React from 'react';

/**
 * @fileoverview 联系方式区块。
 * 页面最终目标不是“展示完毕”，而是把招聘方顺畅地引导到下一步沟通。
 */

/**
 * 联系方式区块。
 *
 * @param {Object} props - 组件属性
 * @param {{intro: string, channels: Array<{label: string, value: string, href: string}>, note: string}} props.contact - 联系方式数据
 * @returns {JSX.Element}
 */
function PortfolioContactSection({ contact }) {
  return (
    <section id="contact" className="portfolio-section portfolio-section--contact">
      <div className="portfolio-panel portfolio-contact-card">
        <div className="portfolio-section__heading portfolio-section__heading--compact">
          <p>Contact</p>
          <h2>如果你觉得我适合你们正在做的产品，欢迎直接联系我</h2>
        </div>

        <p className="portfolio-contact-card__intro">{contact.intro}</p>

        <div className="portfolio-contact-grid">
          {contact.channels.map((channel) => (
            <a
              key={channel.label}
              className="portfolio-contact-item"
              href={channel.href}
              {...(channel.href.startsWith('http') || channel.href.endsWith('.pdf')
                ? { target: '_blank', rel: 'noreferrer' }
                : {})}
            >
              <span>{channel.label}</span>
              <strong>{channel.value}</strong>
            </a>
          ))}
        </div>

        <p className="portfolio-contact-card__note">{contact.note}</p>
      </div>
    </section>
  );
}

export default PortfolioContactSection;
