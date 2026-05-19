import React from 'react';

/**
 * @fileoverview 首页右上人物主视觉。
 * 把正式照片作为首页主视觉的一部分，是为了减少无效留白，
 * 同时建立更直接的个人品牌识别。
 */

/**
 * 人物主视觉面板。
 *
 * @param {Object} props - 组件属性
 * @param {{src: string, alt: string, note: string}} props.portrait - 照片信息
 * @returns {JSX.Element}
 */
function PortfolioPortraitPanel({ portrait }) {
  return (
    <section className="portfolio-portrait-panel">
      <div className="portfolio-portrait-panel__frame">
        <img className="portfolio-portrait-panel__image" src={portrait.src} alt={portrait.alt} />
      </div>
      <p className="portfolio-portrait-panel__note">{portrait.note}</p>
    </section>
  );
}

export default PortfolioPortraitPanel;
