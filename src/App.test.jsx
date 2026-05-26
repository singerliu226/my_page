import React from 'react';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

vi.mock('./pages/portfolio/PortfolioPage', () => ({
  default: function PortfolioPageMock() {
    return (
      <main>
        <h1>刘唱</h1>
        <p>首页封面</p>
      </main>
    );
  },
}));

vi.mock('./pages/portfolio/PortfolioMethodPage', () => ({
  default: function PortfolioMethodPageMock() {
    return <main>工作方法详情页</main>;
  },
}));

vi.mock('./pages/portfolio/PortfolioExperiencePage', () => ({
  default: function PortfolioExperiencePageMock() {
    return <main>关键经历详情页</main>;
  },
}));

vi.mock('./pages/portfolio/PortfolioWorksPage', () => ({
  default: function PortfolioWorksPageMock() {
    return <main>项目作品详情页</main>;
  },
}));

vi.mock('./pages/collector/CollectorWorkspace', () => ({
  default: function CollectorWorkspaceMock() {
    return <main>RedNote Collector 真实工具工作区</main>;
  },
}));

function renderAt(pathname) {
  window.history.pushState({}, '', pathname);
  return render(<App />);
}

describe('个人主页路由', () => {
  beforeEach(() => {
    window.history.pushState({}, '', '/');
  });

  test('根路由渲染个人品牌首页', async () => {
    renderAt('/');

    expect(await screen.findByRole('heading', { name: /刘唱/i })).toBeInTheDocument();
    expect(screen.getByText(/首页封面/i)).toBeInTheDocument();
  });

  test('未知路径回退到个人品牌首页', async () => {
    renderAt('/unknown-route');

    expect(await screen.findByRole('heading', { name: /刘唱/i })).toBeInTheDocument();
  });

  test('工作方法使用独立详情页路由', async () => {
    renderAt('/method');

    expect(await screen.findByText('工作方法详情页')).toBeInTheDocument();
  });

  test('关键经历使用独立详情页路由', async () => {
    renderAt('/experience');

    expect(await screen.findByText('关键经历详情页')).toBeInTheDocument();
  });

  test('项目作品使用独立详情页路由', async () => {
    renderAt('/works');

    expect(await screen.findByText('项目作品详情页')).toBeInTheDocument();
  });

  test('RedNote 项目路由渲染真实工具工作区', async () => {
    renderAt('/projects/rednote');

    expect(await screen.findByText(/RedNote Collector 真实工具工作区/i)).toBeInTheDocument();
  });

  test('RedNote 深链继续停留在真实工具工作区', async () => {
    renderAt('/projects/rednote/collections');

    expect(await screen.findByText(/RedNote Collector 真实工具工作区/i)).toBeInTheDocument();
  });
});
