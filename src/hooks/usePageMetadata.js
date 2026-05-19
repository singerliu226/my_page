import { useEffect } from 'react';

/**
 * @fileoverview 页面元信息管理 Hook。
 * 统一封装 title 与 description 的更新和恢复逻辑，
 * 避免个人站、工具页等不同路由之间相互污染浏览器标签与分享描述。
 */

/**
 * 设置当前页面的标题与描述，并在卸载时恢复上一状态。
 *
 * @param {Object} options - 页面元信息
 * @param {string} options.title - 页面标题
 * @param {string} options.description - 页面描述
 */
function usePageMetadata({ title, description }) {
  useEffect(() => {
    const previousTitle = document.title;
    let metaDescription = document.querySelector('meta[name="description"]');
    const previousDescription = metaDescription?.getAttribute('content') ?? '';

    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }

    document.title = title;
    metaDescription.setAttribute('content', description);

    return () => {
      document.title = previousTitle;
      metaDescription?.setAttribute('content', previousDescription);
    };
  }, [description, title]);
}

export default usePageMetadata;
