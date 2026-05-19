import React from 'react';
import { describe, expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import PortfolioExperiencePage from './PortfolioExperiencePage';
import PortfolioMethodPage from './PortfolioMethodPage';
import PortfolioWorksPage from './PortfolioWorksPage';

/**
 * 渲染详情页并注入路由上下文。
 * 详情页包含站内导航与回退入口，因此测试需要真实的 Router 环境。
 *
 * @param {JSX.Element} page - 需要渲染的页面
 * @returns {import('@testing-library/react').RenderResult}
 */
function renderDetailPage(page) {
  return render(<MemoryRouter initialEntries={['/works']}>{page}</MemoryRouter>);
}

describe('Portfolio 详情页回退入口', () => {
  test('项目页应提供返回首页按钮', () => {
    renderDetailPage(<PortfolioWorksPage />);

    expect(screen.getByRole('link', { name: /返回首页/i })).toHaveAttribute('href', '/');
  });

  test('工作方法页应提供返回首页按钮', () => {
    renderDetailPage(<PortfolioMethodPage />);

    expect(screen.getByRole('link', { name: /返回首页/i })).toHaveAttribute('href', '/');
  });

  test('关键经历页应提供返回首页按钮', () => {
    renderDetailPage(<PortfolioExperiencePage />);

    expect(screen.getByRole('link', { name: /返回首页/i })).toHaveAttribute('href', '/');
  });
});
