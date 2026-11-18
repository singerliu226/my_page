import React from 'react';
import { describe, expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import PortfolioEssayPage from './PortfolioEssayPage';
import { essays } from '../../data/portfolio/essays';

function renderEssay(slug) {
  return render(
    <MemoryRouter initialEntries={[`/notes/${slug}`]}>
      <Routes>
        <Route path="/notes" element={<main>心得页</main>} />
        <Route path="/notes/:slug" element={<PortfolioEssayPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('长文阅读页', () => {
  test('每篇长文都能打开，有标题、日期和返回心得页的入口', () => {
    essays.forEach((essay) => {
      const view = renderEssay(essay.slug);

      expect(screen.getByRole('heading', { level: 1, name: essay.title })).toBeInTheDocument();
      expect(screen.getByText(essay.date)).toBeInTheDocument();
      expect(screen.getByRole('link', { name: '返回产品心得与方法' })).toHaveAttribute('href', '/notes');
      view.unmount();
    });
  });

  test('5 句话那篇保留了可以直接复制的原话', () => {
    renderEssay('five-sentences');

    expect(screen.getByRole('heading', { level: 3, name: /① 开工的时候说/ })).toBeInTheDocument();
    expect(screen.getByText(/你先做下面几件事，做完停下来等我/)).toBeInTheDocument();
    expect(document.querySelectorAll('pre')).toHaveLength(5);
  });

  test('长板效应保留三轮对照的结果表，包括没省下积分的前两轮', () => {
    renderEssay('long-board');

    expect(screen.getByRole('cell', { name: '252 / 252' })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: '267 / 267' })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: '174 / 84' })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: '第三轮同一任务的积分与制作历时对比' }))
      .toHaveAttribute('src', '/portfolio/covers/long-board-round3.png');
    expect(screen.getByText(/原文照录/)).toBeInTheDocument();
  });

  test('Spec 那篇带着文末的判断闭环', () => {
    renderEssay('spec-is-a-contract');

    expect(screen.getByRole('heading', { name: 'Spec 不是文档，而是一份协作契约' })).toBeInTheDocument();
    expect(screen.getByLabelText('我的 AI 产品判断闭环')).toHaveTextContent('回写下一轮判断');
  });

  test('地址里的文章名不存在时回到心得页', () => {
    renderEssay('no-such-essay');

    expect(screen.getByText('心得页')).toBeInTheDocument();
  });
});
