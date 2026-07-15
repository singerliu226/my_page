import React from 'react';
import { describe, expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import PortfolioPage from './PortfolioPage';

function renderPortfolioPage() {
  return render(
    <MemoryRouter initialEntries={['/']}>
      <PortfolioPage />
    </MemoryRouter>,
  );
}

describe('Portfolio 首页招聘入口', () => {
  test('首页只呈现身份、岗位判断与下一步入口', () => {
    renderPortfolioPage();

    expect(screen.getByRole('heading', { level: 1, name: '刘唱' })).toBeInTheDocument();
    expect(screen.getByRole('heading', {
      name: '我喜欢在生活/工作中发现真实用户问题，在调研后快速搭建，推动实现可验证的 AI 产品闭环。',
    })).toBeInTheDocument();
    expect(screen.getByText('AI 产品经理｜复旦大学新闻与传播硕士（2027 届）')).toBeInTheDocument();
    expect(screen.getByText('上海及长三角')).toBeInTheDocument();
    expect(screen.queryByLabelText('AI 产品能力链路')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('代表项目')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('产品心得')).not.toBeInTheDocument();
  });

  test('首页将所有栏目导向独立页面，而非页内锚点', () => {
    renderPortfolioPage();

    expect(screen.getByRole('link', { name: '首页' })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: '关键经历' })).toHaveAttribute('href', '/experience');
    expect(screen.getByRole('link', { name: '项目 / vibe coding' })).toHaveAttribute('href', '/works');
    expect(screen.getByRole('link', { name: '产品心得与方法' })).toHaveAttribute('href', '/notes');
    expect(screen.getByRole('link', { name: '联系' })).toHaveAttribute('href', '/contact');
    expect(screen.getByRole('link', { name: '查看项目 / vibe coding' })).toHaveAttribute('href', '/works');
  });

  test('首页保留简历下载与当前实践事实', () => {
    renderPortfolioPage();

    expect(screen.getByRole('link', { name: '下载完整简历' })).toHaveAttribute('href', '/resume/liuchang-resume.pdf');
    expect(screen.getByText('在 Lyncia 团队制作面向妈妈的 AI 情感陪伴 demo，并调试数字人回答的真人感、关系边界与安全标准。')).toBeInTheDocument();
  });
});
