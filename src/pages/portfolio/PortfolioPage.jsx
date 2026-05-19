import React from 'react';
import PortfolioFooterLinks from '../../components/portfolio/PortfolioFooterLinks';
import PortfolioHero from '../../components/portfolio/PortfolioHero';
import PortfolioPageFrame from '../../components/portfolio/PortfolioPageFrame';
import PortfolioTimelineOverview from '../../components/portfolio/PortfolioTimelineOverview';
import { portfolioContent, portfolioHomeTabs } from '../../data/portfolio/content';
import usePageMetadata from '../../hooks/usePageMetadata';
import '../../styles/portfolio.css';

/**
 * @fileoverview 个人品牌首页。
 * 使用单页叙事结构承载简历与作品，是为了让招聘方在最短时间里完成
 * “认识你是谁 -> 相信你做过事 -> 愿意联系你”的决策链。
 */

/**
 * 个人品牌首页组件。
 *
 * @returns {JSX.Element}
 */
function PortfolioPage() {
  usePageMetadata({
    title: '刘唱 | AI 产品与内容策略个人站',
    description: '刘唱的个人品牌简历站，展示 AI 产品落地、内容理解、用户研究与真实上线作品。',
  });

  return (
    <PortfolioPageFrame navItems={portfolioHomeTabs} mainClassName="portfolio-main portfolio-main--cover">
      <div className="portfolio-home portfolio-home--editorial">
        <div className="portfolio-home__top">
          <PortfolioHero hero={portfolioContent.hero} />
        </div>
        <PortfolioTimelineOverview sectionId="timeline" timeline={portfolioContent.hero.timeline} />
        <div className="portfolio-home__bottom">
          <PortfolioFooterLinks sectionId="contact" contact={portfolioContent.contact} layout="cover" />
        </div>
      </div>
    </PortfolioPageFrame>
  );
}

export default PortfolioPage;
