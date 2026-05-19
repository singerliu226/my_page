import React from 'react';
import PortfolioExperienceSection from '../../components/portfolio/PortfolioExperienceSection';
import PortfolioFooterLinks from '../../components/portfolio/PortfolioFooterLinks';
import PortfolioPageFrame from '../../components/portfolio/PortfolioPageFrame';
import { portfolioContent, portfolioNavItems } from '../../data/portfolio/content';
import usePageMetadata from '../../hooks/usePageMetadata';
import '../../styles/portfolio.css';

/**
 * @fileoverview 关键经历详情页。
 * 将完整经历内容下沉到独立页面，避免首页在第一屏就堆满细节信息。
 */

function PortfolioExperiencePage() {
  usePageMetadata({
    title: '关键经历 | 刘唱',
    description: '查看刘唱从内容、媒体到 AI 产品落地的关键经历主线。',
  });

  return (
    <PortfolioPageFrame navItems={portfolioNavItems} backLink={{ label: '返回首页', href: '/' }}>
      <PortfolioExperienceSection experiences={portfolioContent.experiences} />
      <PortfolioFooterLinks contact={portfolioContent.contact} />
    </PortfolioPageFrame>
  );
}

export default PortfolioExperiencePage;
