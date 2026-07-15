import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * @fileoverview 首页经历总览时间轴。
 * 采用横向时间轴，是为了让用户在第一屏更直观地感受到成长路径，
 * 而不是阅读纵向长列表。
 */

/**
 * 横向经历时间轴。
 *
 * @param {Object} props - 组件属性
 * @param {Array<{labelTime: string, detailTime: string, title: string, summary: string, details: string[], href?: string}>} props.timeline - 时间轴节点
 * @param {string} [props.sectionId] - 区块锚点 id
 * @returns {JSX.Element}
 */
function PortfolioTimelineOverview({ timeline, sectionId }) {
  const navigate = useNavigate();
  const currentIndex = Math.max(0, timeline.length - 1);
  const [activeIndex, setActiveIndex] = useState(currentIndex);
  const [lockedIndex, setLockedIndex] = useState(null);
  const previewBase = useMemo(() => ({
    detailTime: 'Overview',
    title: '经济学 → 新闻传播 → AI 产品，三条路径正在收束成一条主线。',
    summary: '把鼠标放到时间点上看每一段的具体动作，了解能力如何从内容训练走向 AI 产品实践。',
    details: [],
  }), []);

  const activeItem = useMemo(() => {
    if (activeIndex === null) {
      return null;
    }

    return timeline[activeIndex] ?? null;
  }, [activeIndex, timeline]);

  const previewItem = activeItem ?? previewBase;

  /**
   * 激活悬停节点。
   * 优先用 hover 预览详情，点击可锁定，是为了兼顾扫读与停留查看两种行为。
   *
   * @param {number} index - 节点索引
   * @returns {void}
   */
  function handleMouseEnter(index) {
    if (lockedIndex === null) {
      setActiveIndex(index);
    }
  }

  /**
   * 离开节点时恢复状态。
   *
   * @returns {void}
   */
  function handleMouseLeave() {
    if (lockedIndex === null) {
      setActiveIndex(currentIndex);
    }
  }

  /**
   * 仅在鼠标真正离开整个时间轴区域时收起详情卡。
   * 这样从节点移动到浮层附近或同一区块内时，不会触发闪动。
   *
   * @param {React.MouseEvent<HTMLElement>} event - 鼠标事件
   * @returns {void}
   */
  function handleTimelineMouseLeave(event) {
    if (lockedIndex !== null) {
      return;
    }

    if (event.relatedTarget instanceof Node && event.currentTarget.contains(event.relatedTarget)) {
      return;
    }

    setActiveIndex(currentIndex);
  }

  /**
   * 点击节点后锁定或取消锁定详情卡。
   *
   * @param {number} index - 节点索引
   * @returns {void}
   */
  function handleClick(index) {
    const item = timeline[index];

    if (item?.href) {
      navigate(item.href);
      return;
    }

    if (lockedIndex === index) {
      setLockedIndex(null);
      setActiveIndex(currentIndex);
      return;
    }

    setLockedIndex(index);
    setActiveIndex(index);
  }

  return (
    <section
      className="portfolio-timeline-overview"
      id={sectionId}
      aria-label="个人经历时间轴总览"
      onMouseLeave={handleTimelineMouseLeave}
    >
      <p className="portfolio-profile-card__label">Experience Timeline</p>
      <div className="portfolio-timeline-overview__rail">
        <span className="portfolio-timeline-overview__line" aria-hidden="true" />
        <div className="portfolio-timeline-overview__list">
          {timeline.map((item, index) => (
            <button
              key={`${item.labelTime}-${item.title}`}
              type="button"
              className={`portfolio-timeline-overview__item ${
                lockedIndex === index ? 'portfolio-timeline-overview__item--active' : ''
              }`}
              aria-pressed={lockedIndex === index}
              onMouseEnter={() => handleMouseEnter(index)}
              onFocus={() => handleMouseEnter(index)}
              onBlur={handleMouseLeave}
              onClick={() => handleClick(index)}
            >
              <span className="portfolio-timeline-overview__period">{item.labelTime}</span>
              <span className="portfolio-timeline-overview__dot" aria-hidden="true" />
              <div className="portfolio-timeline-overview__content">
                <strong>{item.title}</strong>
              </div>
            </button>
          ))}
        </div>
      </div>
      <div
        className="portfolio-timeline-overview__detail-stage"
        aria-live="polite"
        data-testid="timeline-detail-stage"
        data-preview-layout="below-timeline"
      >
        <div className="portfolio-timeline-overview__detail-anchor" data-testid="timeline-detail-anchor">
          <div
            className={`portfolio-timeline-overview__detail-card ${
              activeItem ? 'portfolio-timeline-overview__detail-card--active' : 'portfolio-timeline-overview__detail-card--idle'
            }`}
            data-testid="timeline-detail-card"
            data-state={activeItem ? 'active' : 'idle'}
            data-motion="fade"
          >
            <div
              key={`${previewItem.detailTime}-${previewItem.title}`}
              className="portfolio-timeline-overview__detail-content"
            >
              <span className="portfolio-timeline-overview__detail-time">{previewItem.detailTime}</span>
              <strong>{previewItem.title}</strong>
              <p>{previewItem.summary}</p>
              {previewItem.details.length > 0 && (
                <ul className="portfolio-timeline-overview__detail-list">
                  {previewItem.details.map((detail) => (
                    <li key={detail}>{detail}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default PortfolioTimelineOverview;
