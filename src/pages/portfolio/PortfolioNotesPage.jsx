import React from 'react';
import { Link } from 'react-router-dom';
import PortfolioFooterLinks from '../../components/portfolio/PortfolioFooterLinks';
import PortfolioMethodSection from '../../components/portfolio/PortfolioMethodSection';
import PortfolioPageFrame from '../../components/portfolio/PortfolioPageFrame';
import PortfolioProductNotesSection from '../../components/portfolio/PortfolioProductNotesSection';
import { portfolioContent, portfolioNavItems } from '../../data/portfolio/content';
import { essays } from '../../data/portfolio/essays';
import usePageMetadata from '../../hooks/usePageMetadata';
import '../../styles/portfolio.css';
import '../../styles/newsroom.css';

/** 产品判断与评测方法的独立阅读页。 */
function PortfolioNotesPage() {
  usePageMetadata({
    title: '产品心得 | 刘唱',
    description: '查看刘唱如何将 AI 产品的真人感、质量与安全边界写成可验证标准。',
  });

  return (
    <PortfolioPageFrame
      navItems={portfolioNavItems}
      backLink={{ label: '返回首页', href: '/' }}
      pageClassName="portfolio-page--newsroom"
    >
      <PortfolioProductNotesSection notes={portfolioContent.productNotes} />
      <section aria-labelledby="essay-list-title">
        <h2 id="essay-list-title" className="portfolio-essay-list__heading">长文 · 可以单独打开读</h2>
        <ul className="portfolio-essay-list">
          {essays.map((essay) => (
            <li key={essay.slug} className="portfolio-essay-index">
              <p>{essay.eyebrow}</p>
              <h3>{essay.title}</h3>
              <p>{essay.dek}</p>
              <Link to={`/notes/${essay.slug}`} aria-label={`阅读全文：${essay.title}`}>阅读全文</Link>
            </li>
          ))}
        </ul>
      </section>
      <PortfolioMethodSection methods={portfolioContent.methods} />
      <PortfolioFooterLinks contact={portfolioContent.contact} />
    </PortfolioPageFrame>
  );
}

export default PortfolioNotesPage;
