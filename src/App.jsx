import React, { Suspense, lazy, useLayoutEffect, useRef, useState } from 'react';
import { PageFlip } from 'page-flip';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';

const PortfolioPage = lazy(() => import('./pages/portfolio/PortfolioPage'));
const PortfolioExperiencePage = lazy(() => import('./pages/portfolio/PortfolioExperiencePage'));
const PortfolioWorksPage = lazy(() => import('./pages/portfolio/PortfolioWorksPage'));
const PortfolioNotesPage = lazy(() => import('./pages/portfolio/PortfolioNotesPage'));
const PortfolioContactPage = lazy(() => import('./pages/portfolio/PortfolioContactPage'));
const PortfolioStyleReferencePage = lazy(() => import('./pages/portfolio/PortfolioStyleReferencePage'));
const CollectorWorkspace = lazy(() => import('./pages/collector/CollectorWorkspace'));

const PAGE_FLIP_DURATION = 950;
const PAGE_TURN_DURATION = PAGE_FLIP_DURATION + 150;
const PAPER_ROUTES = new Set(['/', '/experience', '/works', '/notes', '/contact', '/style-reference']);

function canRenderPortfolioPaper(location) {
  return PAPER_ROUTES.has(location.pathname);
}

function renderAtLocation(children, location) {
  const page = React.Children.only(children);

  return React.isValidElement(page) && page.type === Routes
    ? React.cloneElement(page, { location })
    : children;
}

function SoftPaperTurn({ children, previous, location }) {
  const bookRef = useRef(null);
  const previousPageRef = useRef(null);
  const nextPageRef = useRef(null);

  useLayoutEffect(() => {
    if (!bookRef.current || !previousPageRef.current || !nextPageRef.current) {
      return undefined;
    }

    const width = Math.max(window.innerWidth, 320);
    const height = Math.max(window.innerHeight, 480);
    const pageFlip = new PageFlip(bookRef.current, {
      width,
      height,
      size: 'fixed',
      autoSize: true,
      usePortrait: true,
      drawShadow: true,
      maxShadowOpacity: 0.42,
      flippingTime: PAGE_FLIP_DURATION,
      showPageCorners: false,
      useMouseEvents: false,
      mobileScrollSupport: false,
      clickEventForward: false,
      startZIndex: 200,
    });

    pageFlip.loadFromHTML([previousPageRef.current, nextPageRef.current]);
    const scheduleFrame = window.requestAnimationFrame?.bind(window) ?? ((callback) => window.setTimeout(callback, 0));
    const cancelFrame = window.cancelAnimationFrame?.bind(window) ?? window.clearTimeout.bind(window);
    const animationFrame = scheduleFrame(() => pageFlip.flipNext('bottom'));

    return () => {
      cancelFrame(animationFrame);
      pageFlip.clear();
    };
  }, []);

  return (
    <div className="site-page-turn__paper" data-testid="site-page-turn-paper" aria-hidden="true">
      <div className="site-page-turn__book" ref={bookRef}>
        <div className="site-page-turn__page" data-density="soft" ref={previousPageRef}>
          {renderAtLocation(children, previous)}
        </div>
        <div className="site-page-turn__page" data-density="soft" ref={nextPageRef}>
          {renderAtLocation(children, location)}
        </div>
      </div>
    </div>
  );
}

/**
 * 为站内页面切换保留上一页的真实 DOM，作为纸张正反两面翻起。
 * 路由仍完全交由 React Router 处理，因而不会改变链接、深链或浏览器前进/后退行为。
 */
export function PageTurn({ children, canUsePaper = () => true }) {
  const location = useLocation();
  const hasRendered = useRef(false);
  const previousLocation = useRef(location);
  const turnId = useRef(0);
  const [turn, setTurn] = useState(null);

  useLayoutEffect(() => {
    if (!hasRendered.current) {
      hasRendered.current = true;
      previousLocation.current = location;
      return undefined;
    }

    const previous = previousLocation.current;
    const id = turnId.current + 1;

    turnId.current = id;
    previousLocation.current = location;

    if (!canUsePaper(previous) || !canUsePaper(location)) {
      return undefined;
    }

    setTurn({ id, previous });

    const timeout = window.setTimeout(() => {
      setTurn((activeTurn) => (activeTurn?.id === id ? null : activeTurn));
    }, PAGE_TURN_DURATION);

    return () => window.clearTimeout(timeout);
  }, [location.hash, location.key, location.pathname, location.search]);

  return (
    <div
      className={`site-page-turn${turn ? ' site-page-turn--flip' : ''}`}
      data-route={location.pathname}
      data-testid="site-page-turn"
    >
      <div className="site-page-turn__content">{renderAtLocation(children, location)}</div>
      {turn && (
        <SoftPaperTurn children={children} previous={turn.previous} location={location} />
      )}
    </div>
  );
}

export function AppRoutes() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: '#f3eee7' }} />}>
      <PageTurn canUsePaper={canRenderPortfolioPaper}>
        <Routes>
          <Route path="/" element={<PortfolioPage />} />
          <Route path="/method" element={<Navigate to="/notes" replace />} />
          <Route path="/experience" element={<PortfolioExperiencePage />} />
          <Route path="/works" element={<PortfolioWorksPage />} />
          <Route path="/notes" element={<PortfolioNotesPage />} />
          <Route path="/contact" element={<PortfolioContactPage />} />
          <Route path="/style-reference" element={<PortfolioStyleReferencePage />} />
          <Route path="/projects/rednote/*" element={<CollectorWorkspace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </PageTurn>
    </Suspense>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
