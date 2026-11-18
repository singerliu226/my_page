import React from 'react';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import PortfolioGardenPage from './PortfolioGardenPage';
import { gardenContent } from '../../data/portfolio/garden';

function renderGarden() {
  return render(
    <MemoryRouter initialEntries={['/garden']}>
      <PortfolioGardenPage />
    </MemoryRouter>,
  );
}

/** 模拟手机：窄屏或触屏时 matchMedia 命中 */
function pretendPhone(isPhone) {
  window.matchMedia = vi.fn().mockReturnValue({ matches: isPhone });
}

afterEach(() => {
  delete window.matchMedia;
});

describe('后花园', () => {
  test('四个小游戏都有试玩入口，指向站内的游戏文件', () => {
    renderGarden();

    expect(screen.getByRole('heading', { level: 1, name: '后花园' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /进店坐坐/ })).toHaveAttribute('href', '/play/eyuzu/index.html');
    expect(screen.getByRole('link', { name: /做一碗/ })).toHaveAttribute('href', '/play/tongsui/index.html');
    expect(screen.getByRole('link', { name: /做一单/ })).toHaveAttribute('href', '/play/kitchen/index.html');
    expect(screen.getByRole('link', { name: /切一板/ })).toHaveAttribute('href', '/play/luck/index.html');
  });

  test('页面引用的游戏、短片和配图文件都在 public 目录里', () => {
    const files = [
      gardenContent.headline.play.href,
      gardenContent.headline.image.src,
      ...gardenContent.games.flatMap((game) => [game.play.href, game.image.src, game.extra?.src]),
      ...gardenContent.films.flatMap((film) => [film.video, film.poster]),
      ...gardenContent.credits.flatMap((credit) => (credit.links ?? []).map((link) => link.href)),
    ].filter((file) => file && file.startsWith('/'));

    expect(files.length).toBeGreaterThan(12);
    const missing = files.filter((file) => !existsSync(path.join(process.cwd(), 'public', decodeURI(file))));
    expect(missing).toEqual([]);
  });

  test('每个游戏只讲这是什么、怎么玩；鹅羽鮨写明是单机版', () => {
    renderGarden();

    expect(screen.getAllByText('怎么玩')).toHaveLength(4);
    expect(screen.getByText(/这里是单机版/)).toBeInTheDocument();
    expect(screen.getByText(/走到空凳子旁按 E 坐下/)).toBeInTheDocument();
    expect(screen.getByText(/按住屏幕拖动走路/)).toBeInTheDocument();
  });

  test('电脑上点“开始玩”才加载游戏，在页内的试玩窗里打开，可以关掉', () => {
    pretendPhone(false);
    renderGarden();

    expect(document.querySelector('iframe')).toBeNull();
    fireEvent.click(screen.getByRole('link', { name: /做一碗/ }));

    const dialog = screen.getByRole('dialog', { name: '糖水小铺 试玩' });
    expect(within(dialog).getByTitle('糖水小铺 试玩')).toHaveAttribute('src', '/play/tongsui/index.html');
    expect(within(dialog).getByRole('link', { name: /新窗口打开/ })).toHaveAttribute('href', '/play/tongsui/index.html');

    fireEvent.click(within(dialog).getByRole('button', { name: '关闭' }));
    expect(document.querySelector('iframe')).toBeNull();
  });

  test('手机上不弹窗，交给浏览器整页打开游戏', () => {
    pretendPhone(true);
    renderGarden();

    // 页面自己不拦这次点击；测试环境不会真的跳转，所以在最外层记下结果后再拦住
    let pageHandledIt = null;
    document.addEventListener('click', (event) => {
      pageHandledIt = event.defaultPrevented;
      event.preventDefault();
    }, { once: true });
    fireEvent.click(screen.getByRole('link', { name: /切一板/ }));

    expect(pageHandledIt).toBe(false);
    expect(document.querySelector('iframe')).toBeNull();
  });

  test('两部短片可以直接播放，不自动加载', () => {
    renderGarden();

    const films = [...document.querySelectorAll('video')];
    expect(films).toHaveLength(2);
    films.forEach((film) => {
      expect(film).toHaveAttribute('controls');
      expect(film).toHaveAttribute('preload', 'none');
      expect(film).toHaveAttribute('poster');
    });
    expect(document.querySelector('video source[src="/media/hey-marvis.mp4"]')).not.toBeNull();
    expect(document.querySelector('video source[src="/media/guo-shengri.mp4"]')).not.toBeNull();
  });

  test('页尾列出素材署名', () => {
    renderGarden();

    expect(screen.getByRole('heading', { name: '素材的来路' })).toBeInTheDocument();
    expect(screen.getByText(/Kevin MacLeod/)).toBeInTheDocument();
    expect(screen.getByText(/Scott Buckley/)).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: 'CC BY 4.0' })).toHaveLength(2);
  });
});
