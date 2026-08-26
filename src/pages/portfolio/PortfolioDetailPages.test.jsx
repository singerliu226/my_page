import React from 'react';
import { describe, expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import PortfolioExperiencePage from './PortfolioExperiencePage';
import PortfolioNotesPage from './PortfolioNotesPage';
import PortfolioContactPage from './PortfolioContactPage';
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

  test('关键经历页应提供返回首页按钮', () => {
    renderDetailPage(<PortfolioExperiencePage />);

    expect(screen.getByRole('link', { name: /返回首页/i })).toHaveAttribute('href', '/');
  });

  test('产品心得页和联系页应提供返回首页按钮', () => {
    const { unmount } = renderDetailPage(<PortfolioNotesPage />);
    expect(screen.getByRole('link', { name: /返回首页/i })).toHaveAttribute('href', '/');
    expect(screen.getByText('从角色设定里派生探针，而不是写形容词')).toBeInTheDocument();
    expect(screen.getByText('先把问题问准')).toBeInTheDocument();
    unmount();

    renderDetailPage(<PortfolioContactPage />);
    expect(screen.getByRole('link', { name: /返回首页/i })).toHaveAttribute('href', '/');
  });

  test('项目页保留代表项目与其他项目入口', () => {
    renderDetailPage(<PortfolioWorksPage />);

    expect(screen.getByText('说明：部分作品为 demo 级，仅用于呈现问题判断与产品想法；后续仍将持续完善。')).toBeInTheDocument();
    expect(screen.getAllByText('新传 Mind').length).toBeGreaterThan(0);
    expect(screen.getByText('灵溪大院')).toBeInTheDocument();
    expect(screen.getByText('设计伴侣')).toBeInTheDocument();
    expect(screen.getByText('火炬智库 · 董事长数字分身')).toBeInTheDocument();
    expect(screen.getByText('小财神 Pro')).toBeInTheDocument();
    expect(screen.getByText('泊乐歌词工具')).toBeInTheDocument();
    expect(screen.getByText('论文盾')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '查看 灵溪大院' }))
      .toHaveAttribute('href', 'http://47.103.122.202:8799/?invite=lingxi2026');
    expect(screen.getByRole('link', { name: '查看 论文盾' }))
      .toHaveAttribute('href', 'https://aigctest.zeabur.app/');
    expect(screen.getByRole('link', { name: '查看 设计伴侣' }))
      .toHaveAttribute('href', 'http://47.103.122.202/');
    expect(screen.getByRole('link', { name: '查看 泊乐歌词工具' }))
      .toHaveAttribute('href', 'https://boyuewyy.zeabur.app/');
  });
});
