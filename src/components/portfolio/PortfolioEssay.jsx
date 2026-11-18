import React, { useMemo } from 'react';
import { marked } from 'marked';

/**
 * @fileoverview 一篇可以单独打开读的长文。
 * 正文是仓库里自己的 Markdown 文件（不是访客输入），所以直接转成 HTML 放进页面。
 */
function PortfolioEssay({ essay }) {
  const html = useMemo(() => marked.parse(essay.body, { gfm: true }), [essay.body]);
  const isoDate = essay.date.replace(/\./g, '-');

  return (
    <article className="portfolio-essay" aria-labelledby="essay-title">
      <header className="portfolio-essay__mast">
        <p>{essay.eyebrow}</p>
        <h1 id="essay-title">{essay.title}</h1>
        <p className="portfolio-essay__dek">{essay.dek}</p>
        <div className="portfolio-essay__meta">
          <time dateTime={isoDate}>{essay.date}</time>
          <span>{essay.readingTime}</span>
        </div>
      </header>

      <div className="portfolio-essay__body">
        {essay.source && <p className="portfolio-essay__source">{essay.source}</p>}
        <div className="portfolio-essay__prose" dangerouslySetInnerHTML={{ __html: html }} />

        {essay.loop && (
          <aside className="portfolio-essay__loop" aria-label={essay.loop.title}>
            <p>{essay.loop.title}</p>
            <ol>
              {essay.loop.steps.map((step, index) => (
                <li key={step}><span>{String(index + 1).padStart(2, '0')}</span>{step}</li>
              ))}
            </ol>
          </aside>
        )}
      </div>
    </article>
  );
}

export default PortfolioEssay;
