import React from 'react';
import { Navigate, useParams } from 'react-router-dom';
import PortfolioEssay from '../../components/portfolio/PortfolioEssay';
import PortfolioPageFrame from '../../components/portfolio/PortfolioPageFrame';
import { portfolioNavItems } from '../../data/portfolio/content';
import { essayBySlug } from '../../data/portfolio/essays';
import usePageMetadata from '../../hooks/usePageMetadata';
import '../../styles/portfolio.css';
import '../../styles/newsroom.css';

function EssayReader({ essay }) {
  usePageMetadata({ title: `${essay.title} | 刘唱`, description: essay.dek });

  return (
    <PortfolioPageFrame
      navItems={portfolioNavItems}
      backLink={{ label: '返回产品心得与方法', href: '/notes' }}
      pageClassName="portfolio-page--newsroom"
    >
      <PortfolioEssay essay={essay} />
    </PortfolioPageFrame>
  );
}

/** /notes/:slug：按地址里的名字找文章，找不到就回心得页。 */
function PortfolioEssayPage() {
  const { slug } = useParams();
  const essay = essayBySlug[slug];

  if (!essay) return <Navigate to="/notes" replace />;
  return <EssayReader essay={essay} />;
}

export default PortfolioEssayPage;
