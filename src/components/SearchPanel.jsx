/**
 * @fileoverview 搜索面板组件
 * 包含搜索输入框和搜索历史快捷标签，是搜索功能的入口。
 */

import React, { useState, useEffect } from 'react';
import { Input, Space, Tag, Typography } from 'antd';
import { SearchOutlined, HistoryOutlined } from '@ant-design/icons';
import api from '../hooks/useApi';

const { Search } = Input;
const { Text } = Typography;

/**
 * 搜索面板
 * 
 * @param {Object} props
 * @param {Function} props.onSearch - 搜索回调 (keywords) => void
 * @param {boolean} props.loading - 搜索加载状态
 */
function SearchPanel({ onSearch, loading }) {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    api.getSearchHistory(10)
      .then(setHistory)
      .catch(() => {});
  }, []);

  const handleSearch = (value) => {
    if (!value?.trim()) return;
    onSearch(value.trim());
    /* 搜索后刷新历史 */
    setTimeout(() => {
      api.getSearchHistory(10).then(setHistory).catch(() => {});
    }, 500);
  };

  return (
    <div
      style={{
        background: '#fff',
        borderRadius: 12,
        padding: 24,
        marginBottom: 16,
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
      }}
    >
      <Search
        placeholder="输入关键词搜索小红书笔记，例如：旅行攻略、穿搭分享、美食推荐..."
        allowClear
        enterButton={
          <Space>
            <SearchOutlined />
            搜索
          </Space>
        }
        size="large"
        onSearch={handleSearch}
        loading={loading}
        style={{ maxWidth: 700 }}
      />

      {history.length > 0 && (
        <div style={{ marginTop: 12 }}>
          <Space size={[0, 8]} wrap>
            <HistoryOutlined style={{ color: '#999', marginRight: 4 }} />
            <Text type="secondary" style={{ fontSize: 13 }}>最近搜索：</Text>
            {history.map((item, idx) => (
              <Tag
                key={idx}
                style={{ cursor: 'pointer' }}
                onClick={() => handleSearch(item.keywords)}
              >
                {item.keywords}
              </Tag>
            ))}
          </Space>
        </div>
      )}
    </div>
  );
}

export default SearchPanel;
