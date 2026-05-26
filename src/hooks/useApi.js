/**
 * @fileoverview API 请求封装 Hook
 * 提供统一的接口调用方法，处理 loading 状态、错误提示和数据转换。
 * 
 * 所有 API 调用通过此模块发出，便于统一管理请求行为。
 */

import { useState, useCallback } from 'react';
import { message } from 'antd';

const BASE_URL = '';

/**
 * 通用请求函数
 * 
 * @param {string} url - 请求地址
 * @param {Object} [options] - fetch 选项
 * @returns {Promise<Object>} 解析后的 JSON 数据
 */
async function request(url, options = {}) {
  let res;
  try {
    res = await fetch(`${BASE_URL}${url}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
  } catch (networkErr) {
    throw new Error('网络连接失败，请检查后端服务是否启动');
  }

  /* 处理 HTTP 错误状态码 */
  if (!res.ok) {
    let errMsg = `请求失败 (${res.status})`;
    try {
      const errData = await res.json();
      errMsg = errData.error || errMsg;
    } catch {
      /* 非 JSON 响应（如 HTML 错误页），使用默认错误消息 */
    }
    throw new Error(errMsg);
  }

  let data;
  try {
    data = await res.json();
  } catch {
    throw new Error('服务器返回了非 JSON 数据');
  }

  if (!data.success) {
    throw new Error(data.error || '请求失败');
  }

  return data.data;
}

/** API 方法集合 */
export const api = {
  /** 搜索笔记 */
  search: (keywords, options) =>
    request('/api/search', {
      method: 'POST',
      body: JSON.stringify({ keywords, options }),
    }),

  /** 获取推荐 */
  getRecommend: () => request('/api/search/recommend'),

  /** 获取搜索历史 */
  getSearchHistory: (limit) => request(`/api/search/history?limit=${limit || 20}`),

  /** 发起采集 */
  collect: (topic, notes, includeComments) =>
    request('/api/collections/collect', {
      method: 'POST',
      body: JSON.stringify({ topic, notes, includeComments }),
    }),

  /** 获取数据集列表 */
  listCollections: () => request('/api/collections'),

  /** 获取数据集详情 */
  getCollection: (id, params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/api/collections/${id}${query ? '?' + query : ''}`);
  },

  /** 删除数据集 */
  deleteCollection: (id) =>
    request(`/api/collections/${id}`, { method: 'DELETE' }),

  /** 导出数据集 */
  exportCollection: (collectionId, format, organizeOptions) =>
    request('/api/export', {
      method: 'POST',
      body: JSON.stringify({ collectionId, format, organizeOptions }),
    }),

  /** 获取导出文件列表 */
  listExports: () => request('/api/export/list'),

  /** 获取配置 */
  getConfig: () => request('/api/config'),

  /** 启动浏览器登录 */
  login: () =>
    request('/api/config/login', { method: 'POST' }),

  /** 检查登录状态 */
  checkStatus: () => request('/api/config/check'),

  /** AI 服务状态 */
  getAiStatus: () => request('/api/ai/status'),

  /** 配置 AI API Key */
  configureAi: (apiKey, model) =>
    request('/api/ai/config', {
      method: 'POST',
      body: JSON.stringify({ apiKey, model }),
    }),

  /** AI 分析（非流式） */
  aiAnalyze: (params) =>
    request('/api/ai/analyze', {
      method: 'POST',
      body: JSON.stringify(params),
    }),
};

/**
 * 通用异步操作 Hook
 * 管理 loading 状态和错误处理
 * 
 * @param {Function} asyncFn - 异步函数
 * @param {Object} [options] - 选项
 * @param {boolean} [options.showError=true] - 是否自动显示错误提示
 * @returns {{ loading, execute, data, error }}
 */
export function useAsync(asyncFn, options = {}) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const execute = useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    try {
      const result = await asyncFn(...args);
      setData(result);
      return result;
    } catch (err) {
      setError(err);
      if (options.showError !== false) {
        message.error(err.message || '操作失败');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  }, [asyncFn, options.showError]);

  return { loading, execute, data, error };
}

export default api;
