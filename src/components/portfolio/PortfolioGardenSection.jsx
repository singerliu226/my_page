import React, { useEffect, useRef, useState } from 'react';

/**
 * @fileoverview “后花园”页：能直接玩的小游戏和能直接看的短片。
 * 游戏文件很大（最大的约 28 MB），所以只有点了“开始玩”才加载：
 * 电脑上在页内弹出试玩窗，手机上直接整页打开（这几个游戏都是按手机做的）。
 */

/** 试玩窗用的是原生 dialog；测试环境（jsdom）里它可能没有这两个方法，所以调用前先判断 */
function showDialog(dialog) {
  if (typeof dialog.showModal === 'function') dialog.showModal();
  else dialog.setAttribute('open', '');
}

function closeDialog(dialog) {
  if (typeof dialog.close === 'function') dialog.close();
  else dialog.removeAttribute('open');
}

/** 窄屏或触屏设备：不弹窗，让链接照常整页打开 */
function prefersFullPage() {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false;
  return window.matchMedia('(max-width: 760px), (pointer: coarse)').matches;
}

function GardenPlayDialog({ game, onClose }) {
  const ref = useRef(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog || !game) return undefined;
    showDialog(dialog);
    return () => closeDialog(dialog);
  }, [game]);

  if (!game) return null;

  return (
    <dialog
      ref={ref}
      className="portfolio-garden-dialog"
      aria-label={`${game.title} 试玩`}
      onClose={onClose}
      onClick={(event) => { if (event.target === ref.current) onClose(); }}
    >
      <header className="portfolio-garden-dialog__bar">
        <strong>{game.title}</strong>
        <span>{game.play.note}</span>
        <a href={game.play.href} target="_blank" rel="noreferrer">新窗口打开 ↗</a>
        <button type="button" onClick={onClose}>关闭</button>
      </header>
      <iframe
        className="portfolio-garden-dialog__frame"
        src={game.play.href}
        title={`${game.title} 试玩`}
        allow="autoplay; fullscreen; clipboard-write; web-share; accelerometer; gyroscope"
      />
    </dialog>
  );
}

/** “开始玩”按钮：电脑上弹试玩窗；手机上、或者按住修饰键点击时，交给浏览器照常打开链接 */
function GardenPlayLink({ game, onPlay, className = 'portfolio-garden__play' }) {
  return (
    <a
      className={className}
      href={game.play.href}
      onClick={(event) => {
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || prefersFullPage()) return;
        event.preventDefault();
        onPlay(game);
      }}
    >
      {game.play.label}
      <span aria-hidden="true"> ▸</span>
    </a>
  );
}

function GardenFilm({ film }) {
  return (
    <article className="portfolio-garden-film">
      <video
        className="portfolio-garden-film__video"
        controls
        playsInline
        preload="none"
        poster={film.poster}
        aria-label={`${film.title}：${film.posterAlt}`}
      >
        <source src={film.video} type="video/mp4" />
      </video>
      <div className="portfolio-garden-film__text">
        <p className="portfolio-garden__meta">{film.meta}</p>
        <h3>{film.title}</h3>
        <p>{film.summary}</p>
      </div>
    </article>
  );
}

function PortfolioGardenSection({ garden }) {
  const [playing, setPlaying] = useState(null);
  const { masthead, headline, games, films, neighbor, credits } = garden;

  return (
    <section id="garden" className="portfolio-section portfolio-garden" aria-label="后花园">
      <div className="portfolio-section__heading portfolio-section__heading--page">
        <p>{masthead.eyebrow}</p>
        <h1>{masthead.title}</h1>
        <small>{masthead.lead}</small>
      </div>

      <article className="portfolio-garden-lead" aria-labelledby="garden-lead-title">
        <figure className="portfolio-garden-lead__shot">
          <img src={headline.image.src} alt={headline.image.alt} loading="lazy" />
        </figure>

        <div className="portfolio-garden-lead__text">
          <p className="portfolio-garden__kicker">{headline.kicker}</p>
          <h2 id="garden-lead-title">{headline.title}</h2>
          <p className="portfolio-garden-lead__tagline">{headline.tagline}</p>
          <p className="portfolio-garden-lead__summary">{headline.summary}</p>

          <h3>{headline.howTitle}</h3>
          <dl className="portfolio-garden-lead__how">
            {headline.how.map((item) => (
              <div key={item.label}>
                <dt>{item.label}</dt>
                <dd>{item.text}</dd>
              </div>
            ))}
          </dl>

          <div className="portfolio-garden-lead__cta">
            <GardenPlayLink game={headline} onPlay={setPlaying} className="portfolio-garden__play portfolio-garden__play--big" />
            <span>{headline.play.note}</span>
          </div>
        </div>
      </article>

      <h2 className="portfolio-garden__section-title">{garden.gamesTitle}</h2>
      <div className="portfolio-garden-games">
        {games.map((game) => (
          <article key={game.id} className="portfolio-garden-game">
            <div className="portfolio-garden-game__shots">
              <figure className="portfolio-garden-game__device">
                <img src={game.image.src} alt={game.image.alt} loading="lazy" />
              </figure>
              {game.extra && (
                <figure className="portfolio-garden-game__extra">
                  <img src={game.extra.src} alt={game.extra.alt} loading="lazy" />
                  <figcaption>{game.extra.caption}</figcaption>
                </figure>
              )}
            </div>
            <h3>{game.title}</h3>
            <p className="portfolio-garden-game__tagline">{game.tagline}</p>
            <p className="portfolio-garden__how"><b>怎么玩</b>{game.how}</p>
            <div className="portfolio-garden-game__cta">
              <GardenPlayLink game={game} onPlay={setPlaying} />
              <span>{game.play.note}</span>
            </div>
          </article>
        ))}
      </div>

      <h2 className="portfolio-garden__section-title">{garden.filmsTitle}</h2>
      <p className="portfolio-garden__section-lead">{garden.filmsLead}</p>
      <div className="portfolio-garden-films">
        {films.map((film) => <GardenFilm key={film.id} film={film} />)}
      </div>

      <aside className="portfolio-garden-neighbor" aria-label={neighbor.kicker}>
        <p className="portfolio-garden__kicker">{neighbor.kicker}</p>
        <h3>{neighbor.title}</h3>
        <p>{neighbor.summary}</p>
        <a href={neighbor.href} target="_blank" rel="noreferrer noopener">{neighbor.label} ↗</a>
      </aside>

      <footer className="portfolio-garden-credits">
        <h2>{garden.creditsTitle}</h2>
        <ul>
          {credits.map((credit) => (
            <li key={credit.text}>
              {credit.text}
              {credit.links?.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  {...(link.href.startsWith('http') ? { target: '_blank', rel: 'noreferrer noopener' } : {})}
                >
                  {link.label}
                </a>
              ))}
            </li>
          ))}
        </ul>
      </footer>

      <GardenPlayDialog game={playing} onClose={() => setPlaying(null)} />
    </section>
  );
}

export default PortfolioGardenSection;
