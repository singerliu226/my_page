import React from 'react';
import PortfolioFooterLinks from '../../components/portfolio/PortfolioFooterLinks';
import PortfolioPageFrame from '../../components/portfolio/PortfolioPageFrame';
import PortfolioWorksSection from '../../components/portfolio/PortfolioWorksSection';
import { portfolioContent, portfolioNavItems } from '../../data/portfolio/content';
import usePageMetadata from '../../hooks/usePageMetadata';
import '../../styles/portfolio.css';
import '../../styles/newsroom.css';

/**
 * @fileoverview 项目与作品详情页。
 * 首页只展示目录入口，这里再完整展开作品与案例内容。
 */

function PortfolioWorksPage() {
  usePageMetadata({
    title: '项目 / vibe coding | 刘唱',
    description: '查看刘唱基于真实需求做出的项目、页面与案例拆解。',
  });

  return (
    <PortfolioPageFrame
      navItems={portfolioNavItems}
      backLink={{ label: '返回首页', href: '/' }}
      pageClassName="portfolio-page--newsroom"
    >
      <PortfolioWorksSection works={portfolioContent.works} />
      <PortfolioFooterLinks contact={portfolioContent.contact} />
    </PortfolioPageFrame>
  );
}

export default PortfolioWorksPage;
