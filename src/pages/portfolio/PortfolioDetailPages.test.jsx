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

  test('关键经历页把训练营单列一组，并写明是参营不是实习', () => {
    renderDetailPage(<PortfolioExperiencePage />);

    expect(screen.getByRole('region', { name: '训练营' })).toBeInTheDocument();
    expect(screen.getByText('腾讯 MPR 第四期「鹅创营」')).toBeInTheDocument();
    expect(screen.getByText(/是参营项目，不是实习/)).toBeInTheDocument();
  });

  test('产品心得页和联系页应提供返回首页按钮', () => {
    const { unmount } = renderDetailPage(<PortfolioNotesPage />);
    expect(screen.getByRole('link', { name: /返回首页/i })).toHaveAttribute('href', '/');
    expect(screen.getByText('从角色设定里派生探针，而不是写形容词')).toBeInTheDocument();
    expect(screen.getByText('先把问题问准')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '阅读全文：和 AI 一起做东西，我现在必说的 5 句话' }))
      .toHaveAttribute('href', '/notes/five-sentences');
    expect(screen.getByRole('link', { name: '阅读全文：长板效应：团队怎样用上彼此的 AI 经验' }))
      .toHaveAttribute('href', '/notes/long-board');
    expect(screen.getByRole('link', { name: '阅读全文：当 AI 开始参与研发，产品经理要守住什么？' }))
      .toHaveAttribute('href', '/notes/spec-is-a-contract');
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

  test('每个项目都先交代角色、取舍和要说明的限制', () => {
    renderDetailPage(<PortfolioWorksPage />);

    expect(screen.getAllByText('我的角色')).toHaveLength(9);
    expect(screen.getAllByText('我的取舍')).toHaveLength(9);
    expect(screen.getAllByText('要说明的')).toHaveLength(9);
    expect(screen.getByText('团队实践')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '查看 灵溪大院：高玫对话' }))
      .toHaveAttribute('href', 'http://47.103.122.202:8799/?invite=lingxi2026');
  });

  test('鹅创营的两个课题进了项目页，各自写明没验证的部分', () => {
    renderDetailPage(<PortfolioWorksPage />);

    expect(screen.getByText('长板效应')).toBeInTheDocument();
    expect(screen.getByText(/前两轮积分持平/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '查看 长板效应' })).toHaveAttribute('href', '/notes/long-board');

    expect(screen.getByText('B 站学习助手')).toBeInTheDocument();
    expect(screen.getByText(/页面没有接模型，示例依据摘要拟写/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '查看 B 站学习助手' })).toHaveAttribute('href', '/play/bili/index.html');
    expect(screen.getByRole('link', { name: '查看 B 站学习助手：选课表' })).toHaveAttribute('href', '/play/bili/course.html');
  });
});
