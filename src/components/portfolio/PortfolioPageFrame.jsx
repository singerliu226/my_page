import React from 'react';
import { Link } from 'react-router-dom';
import PortfolioHeader from './PortfolioHeader';

/**
 * @fileoverview 品牌站页面骨架。
 * 将背景、头部和主内容容器统一抽出，避免首页与详情页重复维护外层结构。
 */

/**
 * 页面骨架组件。
 *
 * @param {Object} props - 组件属性
 * @param {React.ReactNode} props.children - 页面内容
 * @param {Array<{key: string, label: string, href: string}>} [props.navItems=[]] - 头部导航项
 * @param {string} [props.mainClassName='portfolio-main'] - 主内容区类名
 * @param {{label: string, href: string}} [props.backLink] - 页面顶部回退入口
 * @returns {JSX.Element}
 */
function PortfolioPageFrame({ children, navItems = [], mainClassName = 'portfolio-main', backLink, pageClassName = '' }) {
  return (
    <div className={`portfolio-page ${pageClassName}`.trim()}>
      <div className="portfolio-page__backdrop" aria-hidden="true" />
      <PortfolioHeader navItems={navItems} />
      <main className={mainClassName}>
        {backLink && (
          <div className="portfolio-page__toolbar">
            <Link className="portfolio-back-link" to={backLink.href}>
              {backLink.label}
            </Link>
          </div>
        )}
        {children}
      </main>
    </div>
  );
}

export default PortfolioPageFrame;
