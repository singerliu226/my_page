# Portfolio Home Visual Refine Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Rebuild the portfolio homepage into a single-screen editorial cover where visitors immediately see a two-line introduction, a top-right portrait with English tabs, a true horizontal line-and-dot timeline, a featured personal AI project, and contact information at the bottom.

**Architecture:** Keep the existing portfolio routing intact and only refactor the homepage composition. Replace the current homepage with a portrait-led editorial layout: top band for intro and portrait, center band for a true horizontal timeline, bottom band for featured project and contact. Use `portfolioContent` to drive the missing master's milestone, English tab labels, photo metadata, and homepage-only section content.

**Tech Stack:** React, React Router, Vitest, Testing Library, CSS

---

### Task 1: Lock the corrected homepage behavior with tests

**Files:**
- Modify: `client/src/pages/portfolio/PortfolioPage.test.jsx`
- Test: `client/src/pages/portfolio/PortfolioPage.test.jsx`

**Step 1: Write the failing test**

Add assertions that the homepage:
- renders English tabs for `ABOUT` / `TIMELINE` / `PROJECT` / `CONTACT`
- renders a visible portrait image in the top-right region
- renders a timeline milestone for `复旦大学新闻与传播硕士`
- renders the contact region after the project region
- keeps the featured personal AI project block with `新传 Mind`

**Step 2: Run test to verify it fails**

Run: `npm run test:client -- client/src/pages/portfolio/PortfolioPage.test.jsx`
Expected: FAIL because the current homepage does not render the portrait, English tabs, or the master's milestone.

**Step 3: Write minimal implementation**

Do not implement here. Only use the failure to confirm the target behavior is not already present.

**Step 4: Run test to verify it fails for the expected reason**

Run: `npm run test:client -- client/src/pages/portfolio/PortfolioPage.test.jsx`
Expected: FAIL with missing `ABOUT` / portrait / `复旦大学新闻与传播硕士`.

### Task 2: Reshape homepage data for the portrait-led editorial layout

**Files:**
- Modify: `client/src/data/portfolio/content.js`
- Test: `client/src/pages/portfolio/PortfolioPage.test.jsx`

**Step 1: Write the failing test**

Use the existing test from Task 1 as the red state.

**Step 2: Run test to verify it fails**

Run: `npm run test:client -- client/src/pages/portfolio/PortfolioPage.test.jsx`
Expected: FAIL.

**Step 3: Write minimal implementation**

Update homepage data so it exposes:
- a shorter two-line summary
- English homepage tab labels and section anchors
- the portrait asset metadata
- the missing `复旦大学新闻与传播硕士` milestone
- homepage-only featured AI project and contact content

**Step 4: Run test to verify progress**

Run: `npm run test:client -- client/src/pages/portfolio/PortfolioPage.test.jsx`
Expected: Still FAIL until components consume the new data.

### Task 3: Replace the homepage composition

**Files:**
- Modify: `client/src/pages/portfolio/PortfolioPage.jsx`
- Modify: `client/src/components/portfolio/PortfolioHero.jsx`
- Modify: `client/src/components/portfolio/PortfolioFooterLinks.jsx`
- Modify: `client/src/components/portfolio/PortfolioTimelineOverview.jsx`
- Modify: `client/src/components/portfolio/PortfolioHeader.jsx`
- Create: `client/src/components/portfolio/PortfolioFeaturedProject.jsx`
- Create: `client/src/components/portfolio/PortfolioPortraitPanel.jsx`
- Test: `client/src/pages/portfolio/PortfolioPage.test.jsx`

**Step 1: Write the failing test**

Use the existing failing homepage test.

**Step 2: Run test to verify it fails**

Run: `npm run test:client -- client/src/pages/portfolio/PortfolioPage.test.jsx`
Expected: FAIL.

**Step 3: Write minimal implementation**

Refactor homepage structure into:
- top editorial band with intro on the left and portrait on the right
- English tabs in the upper-right area
- central true horizontal timeline
- lower split section with featured AI project on the left and contact on the right

**Step 4: Run test to verify it passes**

Run: `npm run test:client -- client/src/pages/portfolio/PortfolioPage.test.jsx`
Expected: PASS.

### Task 4: Push the visual system toward editorial quality

**Files:**
- Modify: `client/src/styles/portfolio.css`
- Test: `client/src/pages/portfolio/PortfolioPage.test.jsx`

**Step 1: Write the failing test**

No new behavioral test required; use the existing homepage test as regression protection.

**Step 2: Run test to verify baseline passes before styling**

Run: `npm run test:client -- client/src/pages/portfolio/PortfolioPage.test.jsx`
Expected: PASS.

**Step 3: Write minimal implementation**

Update CSS to:
- reduce dashboard-like card feeling
- strengthen typography hierarchy
- position the portrait as a real hero visual
- build a true horizontal line-and-dot timeline with one continuous line
- place the contact block at the bottom
- ensure the homepage fits within the target laptop viewport without requiring scroll

**Step 4: Run test to verify it still passes**

Run: `npm run test:client -- client/src/pages/portfolio/PortfolioPage.test.jsx`
Expected: PASS.

### Task 5: Verify the full application still works

**Files:**
- Verify: `client/src/pages/portfolio/PortfolioPage.jsx`
- Verify: `client/src/components/portfolio/PortfolioPortraitPanel.jsx`
- Verify: `client/src/components/portfolio/PortfolioFeaturedProject.jsx`
- Verify: `client/src/components/portfolio/PortfolioTimelineOverview.jsx`
- Verify: `client/src/styles/portfolio.css`
- Test: `client/src/App.test.jsx`
- Test: `client/src/pages/portfolio/PortfolioPage.test.jsx`

**Step 1: Write the failing test**

No new test. Use the existing suite.

**Step 2: Run test to verify all app tests pass**

Run: `npm run test:client`
Expected: PASS with all frontend tests green.

**Step 3: Run production verification**

Run: `npm run build`
Expected: PASS with production build emitted successfully.

**Step 4: Check edited files for diagnostics**

Run IDE diagnostics on edited files.
Expected: No new lint errors introduced by the homepage refactor.
