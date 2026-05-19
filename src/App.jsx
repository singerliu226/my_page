import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

const PortfolioPage = lazy(() => import('./pages/portfolio/PortfolioPage'));
const PortfolioMethodPage = lazy(() => import('./pages/portfolio/PortfolioMethodPage'));
const PortfolioExperiencePage = lazy(() => import('./pages/portfolio/PortfolioExperiencePage'));
const PortfolioWorksPage = lazy(() => import('./pages/portfolio/PortfolioWorksPage'));
const RedNoteToolPage = lazy(() => import('./pages/rednote/RedNoteToolPage'));

export function AppRoutes() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: '#f3eee7' }} />}>
      <Routes>
        <Route path="/" element={<PortfolioPage />} />
        <Route path="/method" element={<PortfolioMethodPage />} />
        <Route path="/experience" element={<PortfolioExperiencePage />} />
        <Route path="/works" element={<PortfolioWorksPage />} />
        <Route path="/projects/rednote" element={<RedNoteToolPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
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
