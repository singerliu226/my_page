import React from 'react';
import { Link, NavLink } from 'react-router-dom';

/**
 * @fileoverview 个人品牌站顶部导航。
 * 首页改为目录封面后，导航职责从“页内滚动”变成“页面切换”，
 * 让用户先理解信息架构，再决定深入查看哪一部分内容。
 */

/**
 * 品牌站头部。
 *
 * @param {Object} props - 组件属性
 * @param {Array<{key: string, label: string, href: string}>} [props.navItems=[]] - 导航项
 * @returns {JSX.Element}
 */
function PortfolioHeader({ navItems = [] }) {
  return (
    <header className="portfolio-header">
      <p className="portfolio-header__edition">个人作品集 · 2026</p>
      <Link className="portfolio-brand" to="/">
        <span className="portfolio-brand__text">
          <strong>刘唱 <em>LIU CHANG</em></strong>
          <small>AI PRODUCT PORTFOLIO · 2026</small>
        </span>
      </Link>

      <p className="portfolio-header__date">上海 · 2026</p>

      {navItems.length > 0 && (
        <nav className="portfolio-nav" aria-label="个人品牌站导航">
          {navItems.map((item) => (
            item.href.startsWith('#') ? (
              <a key={item.key} className="portfolio-nav__item" href={item.href}>
                {item.label}
              </a>
            ) : (
              <NavLink
                key={item.key}
                className={({ isActive }) => `portfolio-nav__item${isActive ? ' portfolio-nav__item--active' : ''}`}
                to={item.href}
              >
                {item.label}
              </NavLink>
            )
          ))}
        </nav>
      )}
    </header>
  );
}

export default PortfolioHeader;
