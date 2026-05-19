import React from 'react';
import PortfolioMethodSection from '../../components/portfolio/PortfolioMethodSection';
import PortfolioFooterLinks from '../../components/portfolio/PortfolioFooterLinks';
import PortfolioPageFrame from '../../components/portfolio/PortfolioPageFrame';
import { portfolioContent, portfolioNavItems } from '../../data/portfolio/content';
import usePageMetadata from '../../hooks/usePageMetadata';
import '../../styles/portfolio.css';

/**
 * @fileoverview 工作方法详情页。
 * 承载首页目录下钻后的完整内容，让首页保持克制，详情页再展开解释。
 */

function PortfolioMethodPage() {
  usePageMetadata({
    title: '工作方法 | 刘唱',
    description: '查看刘唱如何做需求洞察、AI 产品判断与结构化落地。',
  });

  return (
    <PortfolioPageFrame navItems={portfolioNavItems} backLink={{ label: '返回首页', href: '/' }}>
      <PortfolioMethodSection methods={portfolioContent.methods} />
      <PortfolioFooterLinks contact={portfolioContent.contact} />
    </PortfolioPageFrame>
  );
}

export default PortfolioMethodPage;
