import React from 'react';
import PortfolioHero from '../../components/portfolio/PortfolioHero';
import PortfolioPageFrame from '../../components/portfolio/PortfolioPageFrame';
import { portfolioContent, portfolioHomeTabs } from '../../data/portfolio/content';
import usePageMetadata from '../../hooks/usePageMetadata';
import '../../styles/portfolio.css';
import '../../styles/newsroom.css';

/**
 * @fileoverview 个人品牌首页。
 * 首页只承担“这是谁、在找什么岗位、凭什么值得继续看”三件事。
 * 其余材料下沉至独立页面，避免招聘方在第一屏就被信息淹没。
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
    <PortfolioPageFrame
      navItems={portfolioHomeTabs}
      mainClassName="portfolio-main portfolio-main--cover"
      pageClassName="portfolio-page--newsroom"
    >
      <div className="portfolio-home portfolio-home--editorial">
        <div className="portfolio-home__top">
          <PortfolioHero hero={portfolioContent.hero} />
        </div>
      </div>
    </PortfolioPageFrame>
  );
}

export default PortfolioPage;
