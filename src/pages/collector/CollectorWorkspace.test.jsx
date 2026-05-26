import React from 'react';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import CollectorWorkspace from './CollectorWorkspace';

vi.mock('../SearchPage', () => ({
  default: function SearchPageMock() {
    return <div>搜索采集页面占位</div>;
  },
}));

vi.mock('../CollectionPage', () => ({
  default: function CollectionPageMock() {
    return <div>数据管理页面占位</div>;
  },
}));

vi.mock('../ExportPage', () => ({
  default: function ExportPageMock() {
    return <div>导出中心页面占位</div>;
  },
}));

vi.mock('../../components/SettingsModal', () => ({
  default: function SettingsModalMock() {
    return null;
  },
}));

/**
 * 按给定路径渲染工具工作区。
 *
 * @param {string} pathname - 当前测试路径
 * @returns {import('@testing-library/react').RenderResult}
 */
function renderCollectorAt(pathname) {
  return render(
    <MemoryRouter initialEntries={[pathname]}>
      <Routes>
        <Route path="/projects/rednote/*" element={<CollectorWorkspace />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('CollectorWorkspace 元信息与子路由', () => {
  beforeEach(() => {
    document.title = '刘唱 | AI 产品与内容策略个人站';

    let metaDescription = document.querySelector('meta[name="description"]');

    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }

    metaDescription.setAttribute('content', '刘唱的个人品牌简历站');
  });

  test('直达导出中心时应渲染对应页面并覆盖页面元信息', async () => {
    renderCollectorAt('/projects/rednote/export');

    expect(await screen.findByText('导出中心页面占位')).toBeInTheDocument();
    expect(document.title).toBe('RedNote Collector | 小红书内容采集工具');
    expect(document.querySelector('meta[name="description"]')?.getAttribute('content')).toMatch(
      /RedNote Collector/,
    );
  });

  test('未知的工具子路径应回退到搜索采集页', async () => {
    renderCollectorAt('/projects/rednote/unknown');

    expect(await screen.findByText('搜索采集页面占位')).toBeInTheDocument();
  });
});
