import React from 'react';
import { describe, expect, test } from 'vitest';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import PortfolioPage from './PortfolioPage';

/**
 * 渲染个人品牌首页。
 * 使用 MemoryRouter 是因为作品区包含站内 Link，测试环境需要 Router 上下文。
 *
 * @returns {import('@testing-library/react').RenderResult}
 */
function renderPortfolioPage() {
  return render(
    <MemoryRouter initialEntries={['/']}>
      <Routes>
        <Route
          path="/"
          element={(
            <>
              <PortfolioPage />
              <LocationProbe />
            </>
          )}
        />
        <Route path="/works" element={<div>Works Route</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

/**
 * 输出当前路由，便于验证交互后是否发生页面跳转。
 *
 * @returns {JSX.Element}
 */
function LocationProbe() {
  const location = useLocation();

  return <div data-testid="location-probe">{location.pathname}</div>;
}

describe('PortfolioPage 招聘转化信息', () => {
  test('应提供简历 PDF 与 GitHub 入口', () => {
    renderPortfolioPage();

    const resumeLinks = screen.getAllByRole('link', { name: /下载简历/i });
    expect(resumeLinks[0]).toHaveAttribute('href', expect.stringMatching(/pdf/i));

    const githubLinks = screen.getAllByRole('link', { name: /github/i });
    expect(githubLinks[0]).toHaveAttribute('href', 'https://github.com/singerliu226');
  });

  test('首页应将头像缩小后放在姓名旁边，并保留英文 tab、横向时间轴与底部联系方式', () => {
    renderPortfolioPage();

    expect(screen.getByRole('link', { name: 'ABOUT' })).toHaveAttribute('href', '#about');
    expect(screen.getByRole('link', { name: 'TIMELINE' })).toHaveAttribute('href', '#timeline');
    expect(screen.getByRole('link', { name: 'PROJECT' })).toHaveAttribute('href', '/works');
    expect(screen.getByRole('link', { name: 'CONTACT' })).toHaveAttribute('href', '#contact');
    const aboutSection = document.getElementById('about');
    expect(aboutSection).not.toBeNull();
    const portrait = within(aboutSection).getByRole('img', { name: /刘唱正式照片/i });
    const eyebrow = within(aboutSection).getByText(/AI Product Builder \/ Editorial Thinker/i);
    const nameHeading = within(aboutSection).getByRole('heading', { level: 1, name: /刘唱/i });
    const introBlock = within(aboutSection).getByLabelText(/个人简介/i);
    expect(portrait.compareDocumentPosition(eyebrow)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    expect(portrait.compareDocumentPosition(nameHeading)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    expect(nameHeading.compareDocumentPosition(introBlock)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    expect(
      screen.getByRole('heading', {
        name: /我把内容洞察、用户理解与 AI 能力，变成真正被人使用的产品/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(/真实需求、清晰结构和最终落地/i)).toBeInTheDocument();
    expect(screen.getByText(/FuturX/i)).toBeInTheDocument();
    expect(screen.getByText(/复旦大学新闻与传播硕士/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/个人经历时间轴总览/i)).toBeInTheDocument();
    expect(screen.getByText(/15202171290/i)).toBeInTheDocument();
    expect(screen.getByText(/singer226@163.com/i)).toBeInTheDocument();
    const contactSection = screen.getByLabelText(/联系方式/i);
    expect(contactSection).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /工作方法/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /关键经历/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /我做的项目/i })).not.toBeInTheDocument();
    expect(screen.queryByText(/把内容理解、用户研究与 AI 能力真正做成产品的人/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/实践亮点/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/春招可联系/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/新传 Mind/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/考研备考 AI 专家系统/i)).not.toBeInTheDocument();
  });

  test('时间轴默认显示经历总述，交互后切换为对应阶段详情，移开后恢复总述', () => {
    renderPortfolioPage();

    expect(screen.queryByText(/建立商业分析与结构化思考底层能力/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/进一步强化内容理解、传播判断与用户洞察能力/i)).not.toBeInTheDocument();
    expect(
      screen.getByText(/从经济学训练、新闻传播学习到媒体与 AI 产品实践，我逐步形成了从需求理解到产品落地的完整路径。/i),
    ).toBeInTheDocument();

    const timelineSection = screen.getByLabelText(/个人经历时间轴总览/i);
    const undergradNode = screen.getByRole('button', { name: /2015 - 2020 上海师范大学 · 经济学/i });
    fireEvent.mouseEnter(undergradNode);
    expect(screen.getByText(/建立商业分析与结构化思考底层能力/i)).toBeInTheDocument();
    expect(screen.getByTestId('timeline-detail-card')).toHaveAttribute('data-state', 'active');

    fireEvent.mouseOut(undergradNode, { relatedTarget: timelineSection });
    expect(screen.getByTestId('timeline-detail-card')).toHaveAttribute('data-state', 'active');

    const futurxNode = screen.getByRole('button', { name: /2025\.11 - 2026\.02 FuturX/i });
    fireEvent.click(futurxNode);
    expect(screen.getByText(/把调研、PRD、数据与上线迭代真正连成产品闭环/i)).toBeInTheDocument();
    expect(screen.getByText(/需求调研、PRD、数据准备、提示词设计与测试上线/i)).toBeInTheDocument();

    fireEvent.click(futurxNode);
    fireEvent.mouseLeave(timelineSection);
    expect(screen.getByTestId('timeline-detail-card')).toHaveAttribute('data-state', 'idle');
    expect(
      screen.getByText(/从经济学训练、新闻传播学习到媒体与 AI 产品实践，我逐步形成了从需求理解到产品落地的完整路径。/i),
    ).toBeInTheDocument();
  });

  test('时间轴详情卡保持固定位置，并按指定时间文案展示，个人 AI 项目点击后跳转到作品页', () => {
    renderPortfolioPage();

    expect(screen.getByRole('button', { name: /2024-2026 复旦大学新闻与传播硕士/i })).toBeInTheDocument();
    const personalProjectNode = screen.getByRole('button', { name: /2025-2026 个人 AI 项目/i });
    expect(personalProjectNode).toBeInTheDocument();

    const timelineDetailAnchor = screen.getByTestId('timeline-detail-anchor');
    expect(timelineDetailAnchor).not.toHaveAttribute('style');

    const masterNode = screen.getByRole('button', { name: /2024-2026 复旦大学新闻与传播硕士/i });
    fireEvent.mouseEnter(masterNode);
    expect(screen.getByText(/进一步强化内容理解、传播判断与用户洞察能力/i)).toBeInTheDocument();
    expect(timelineDetailAnchor).not.toHaveAttribute('style');

    fireEvent.click(personalProjectNode);
    expect(screen.getByText('Works Route')).toBeInTheDocument();
    expect(screen.queryByTestId('location-probe')).not.toBeInTheDocument();
  });

  test('时间轴详情区位于节点下方，hover 时仅替换文本并渐显详情', () => {
    renderPortfolioPage();

    const masterNode = screen.getByRole('button', { name: /2024-2026 复旦大学新闻与传播硕士/i });
    const undergradNode = screen.getByRole('button', { name: /2015 - 2020 上海师范大学 · 经济学/i });
    const detailCard = screen.getByTestId('timeline-detail-card');
    const detailStage = screen.getByTestId('timeline-detail-stage');

    expect(detailStage).toHaveAttribute('data-preview-layout', 'below-timeline');
    expect(undergradNode.compareDocumentPosition(detailStage)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    expect(
      screen.getByText(/从经济学训练、新闻传播学习到媒体与 AI 产品实践，我逐步形成了从需求理解到产品落地的完整路径。/i),
    ).toBeInTheDocument();
    expect(detailCard).toHaveAttribute('data-state', 'idle');

    fireEvent.mouseEnter(masterNode);

    expect(detailCard).toHaveAttribute('data-state', 'active');
    expect(detailCard).toHaveAttribute('data-motion', 'fade');
    expect(
      screen.queryByText(/从经济学训练、新闻传播学习到媒体与 AI 产品实践，我逐步形成了从需求理解到产品落地的完整路径。/i),
    ).not.toBeInTheDocument();
    expect(screen.getByText(/进一步强化内容理解、传播判断与用户洞察能力/i)).toBeInTheDocument();
    expect(masterNode).not.toHaveClass('portfolio-timeline-overview__item--active');
  });
});
