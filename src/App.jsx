import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

const PortfolioPage = lazy(() => import('./pages/portfolio/PortfolioPage'));
const PortfolioExperiencePage = lazy(() => import('./pages/portfolio/PortfolioExperiencePage'));
const PortfolioWorksPage = lazy(() => import('./pages/portfolio/PortfolioWorksPage'));
const PortfolioNotesPage = lazy(() => import('./pages/portfolio/PortfolioNotesPage'));
const PortfolioContactPage = lazy(() => import('./pages/portfolio/PortfolioContactPage'));
const PortfolioStyleReferencePage = lazy(() => import('./pages/portfolio/PortfolioStyleReferencePage'));
const CollectorWorkspace = lazy(() => import('./pages/collector/CollectorWorkspace'));

export function AppRoutes() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: '#f3eee7' }} />}>
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
