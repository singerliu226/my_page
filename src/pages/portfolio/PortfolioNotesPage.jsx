import React from 'react';
import PortfolioFooterLinks from '../../components/portfolio/PortfolioFooterLinks';
import PortfolioMethodSection from '../../components/portfolio/PortfolioMethodSection';
import PortfolioPageFrame from '../../components/portfolio/PortfolioPageFrame';
import PortfolioProductNotesSection from '../../components/portfolio/PortfolioProductNotesSection';
import { portfolioContent, portfolioNavItems } from '../../data/portfolio/content';
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
      <PortfolioMethodSection methods={portfolioContent.methods} />
      <PortfolioFooterLinks contact={portfolioContent.contact} />
    </PortfolioPageFrame>
  );
}

export default PortfolioNotesPage;
