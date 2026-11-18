import React from 'react';
import PortfolioFooterLinks from '../../components/portfolio/PortfolioFooterLinks';
import PortfolioGardenSection from '../../components/portfolio/PortfolioGardenSection';
import PortfolioPageFrame from '../../components/portfolio/PortfolioPageFrame';
import { portfolioContent, portfolioNavItems } from '../../data/portfolio/content';
import { gardenContent } from '../../data/portfolio/garden';
import usePageMetadata from '../../hooks/usePageMetadata';
import '../../styles/portfolio.css';
import '../../styles/newsroom.css';
import '../../styles/garden.css';

/** 后花园：正经项目之外的小游戏和短片，点开就能玩、能看。 */
function PortfolioGardenPage() {
  usePageMetadata({
    title: '后花园 | 刘唱',
    description: '刘唱和 AI 一起做的四个网页小游戏和两部 AI 短片，点开就能玩、能看。',
  });

  return (
    <PortfolioPageFrame
      navItems={portfolioNavItems}
      backLink={{ label: '返回首页', href: '/' }}
      pageClassName="portfolio-page--newsroom"
    >
      <PortfolioGardenSection garden={gardenContent} />
      <PortfolioFooterLinks contact={portfolioContent.contact} />
    </PortfolioPageFrame>
  );
}

export default PortfolioGardenPage;
