# Portfolio Timeline Hover Stability Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Keep the homepage timeline preview stable on hover, update the two requested timeline labels, and make the personal AI project node click through to the project page.

**Architecture:** Keep the existing homepage structure and interactive timeline model, but remove hover-driven horizontal repositioning of the preview card. The detail card should stay anchored at a fixed center position while timeline node data drives the displayed content. Add a per-node link field so the personal project node can navigate directly to `/works`.

**Tech Stack:** React, React Router, Vitest, Testing Library, CSS

---

### Task 1: Lock the requested timeline behavior with tests

**Files:**
- Modify: `client/src/pages/portfolio/PortfolioPage.test.jsx`
- Test: `client/src/pages/portfolio/PortfolioPage.test.jsx`

**Step 1: Write the failing test**

Add assertions that:
- the detail anchor remains fixed instead of moving per hovered node
- the timeline shows `2024-2026` for `复旦大学新闻与传播硕士`
- the timeline shows `2025-2026` for `个人 AI 项目`
- clicking `个人 AI 项目` navigates to `/works`

**Step 2: Run test to verify it fails**

Run: `npm run test:client -- client/src/pages/portfolio/PortfolioPage.test.jsx`
Expected: FAIL because the current implementation still moves the detail anchor, still renders old time labels, and does not navigate on personal project click.

### Task 2: Update timeline data and click-through behavior

**Files:**
- Modify: `client/src/data/portfolio/content.js`
- Modify: `client/src/components/portfolio/PortfolioTimelineOverview.jsx`
- Test: `client/src/pages/portfolio/PortfolioPage.test.jsx`

**Step 1: Write minimal implementation**

Update timeline data so:
- `复旦大学新闻与传播硕士` uses `2024-2026`
- `个人 AI 项目` uses `2025-2026`
- `个人 AI 项目` carries `href: '/works'`

Refactor the timeline component so clicking a node with `href` navigates instead of toggling lock state.

**Step 2: Run targeted test**

Run: `npm run test:client -- client/src/pages/portfolio/PortfolioPage.test.jsx`
Expected: Still FAIL until the hover anchor movement is removed.

### Task 3: Remove hover movement from the detail card

**Files:**
- Modify: `client/src/components/portfolio/PortfolioTimelineOverview.jsx`
- Modify: `client/src/styles/portfolio.css`
- Test: `client/src/pages/portfolio/PortfolioPage.test.jsx`

**Step 1: Write minimal implementation**

Make the detail card anchor fixed at the center of the timeline detail stage, and remove left-position animation/mutation caused by hovered node changes.

**Step 2: Run targeted test**

Run: `npm run test:client -- client/src/pages/portfolio/PortfolioPage.test.jsx`
Expected: PASS.

### Task 4: Verify the portfolio still works

**Files:**
- Verify: `client/src/components/portfolio/PortfolioTimelineOverview.jsx`
- Verify: `client/src/data/portfolio/content.js`
- Verify: `client/src/styles/portfolio.css`
- Test: `client/src/pages/portfolio/PortfolioPage.test.jsx`

**Step 1: Run full frontend tests**

Run: `npm run test:client`
Expected: PASS.

**Step 2: Run build verification**

Run: `npm run build`
Expected: PASS.
