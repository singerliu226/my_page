import React from 'react';
import PortfolioContactSection from '../../components/portfolio/PortfolioContactSection';
import PortfolioFooterLinks from '../../components/portfolio/PortfolioFooterLinks';
import PortfolioPageFrame from '../../components/portfolio/PortfolioPageFrame';
import { portfolioContent, portfolioNavItems } from '../../data/portfolio/content';
import usePageMetadata from '../../hooks/usePageMetadata';
import '../../styles/portfolio.css';
import '../../styles/newsroom.css';

/** 联系页将招聘者的下一步操作集中呈现，避免散落在首页底部。 */
function PortfolioContactPage() {
  usePageMetadata({
    title: '联系刘唱 | AI 产品经理',
    description: '联系刘唱，查看简历、GitHub 与 AI 产品项目材料。',
  });

  return (
    <PortfolioPageFrame
      navItems={portfolioNavItems}
      backLink={{ label: '返回首页', href: '/' }}
      pageClassName="portfolio-page--newsroom"
    >
      <PortfolioContactSection contact={portfolioContent.contact} />
      <PortfolioFooterLinks contact={portfolioContent.contact} />
    </PortfolioPageFrame>
  );
}

export default PortfolioContactPage;
