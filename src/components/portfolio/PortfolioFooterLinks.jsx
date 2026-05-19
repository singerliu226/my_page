import React from 'react';

/**
 * @fileoverview 页脚联系入口。
 * 首页 cover 布局将简历作为主 CTA，其它渠道下沉为次级链接，
 * 让招聘方第一眼就清楚"下一步该做什么"。
 */

function isExternalLike(href = '') {
  return href.startsWith('http') || href.endsWith('.pdf');
}

function PortfolioFooterLinks({ contact, layout = 'default', sectionId }) {
  const { primary, channels = [] } = contact;

  if (layout === 'cover') {
    return (
      <section className="portfolio-contact-brief" id={sectionId} aria-label="联系方式">
        <p className="portfolio-eyebrow">{contact.coverTitle}</p>
        {contact.intro && (
          <p className="portfolio-contact-brief__intro">{contact.intro}</p>
        )}
        {primary && (
          <a
            className="portfolio-contact-brief__primary"
            href={primary.href}
            {...(isExternalLike(primary.href) ? { target: '_blank', rel: 'noreferrer' } : {})}
          >
            <span>{primary.label}</span>
            <strong>{primary.value} ↗</strong>
          </a>
        )}
        <div className="portfolio-contact-brief__list">
          {channels.map((channel) => (
            <a
              key={channel.label}
              className="portfolio-contact-brief__item"
              href={channel.href}
              {...(isExternalLike(channel.href) ? { target: '_blank', rel: 'noreferrer' } : {})}
            >
              <span>{channel.label}</span>
              <strong>{channel.value}</strong>
            </a>
          ))}
        </div>
      </section>
    );
  }

  const allChannels = primary ? [primary, ...channels] : channels;

  return (
    <footer className="portfolio-footer-links">
      {allChannels.map((channel, idx) => (
        <a
          key={channel.label}
          className={`portfolio-footer-links__item${idx === 0 && primary ? ' portfolio-footer-links__item--primary' : ''}`}
          href={channel.href}
          {...(isExternalLike(channel.href) ? { target: '_blank', rel: 'noreferrer' } : {})}
        >
          <span>{channel.label}</span>
          <strong>{channel.value}</strong>
        </a>
      ))}
    </footer>
  );
}

export default PortfolioFooterLinks;
