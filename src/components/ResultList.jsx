/**
 * @fileoverview 搜索结果列表组件
 * 以网格布局展示搜索结果卡片，提供全选/反选和批量采集操作栏。
 */

import React from 'react';
import { Row, Col, Empty, Typography, Space, Button, Checkbox, Statistic, Alert } from 'antd';
import { DownloadOutlined, SearchOutlined, LoginOutlined } from '@ant-design/icons';
import ResultCard from './ResultCard';

const { Text, Paragraph } = Typography;

/**
 * 搜索结果列表
 * 
 * @param {Object} props
 * @param {Array} props.notes - 笔记列表
 * @param {Set} props.selectedIds - 已选中的笔记ID集合
 * @param {Function} props.onToggleSelect - 切换选中 (noteId, checked)
 * @param {Function} props.onSelectAll - 全选/取消
 * @param {Function} props.onCollect - 发起采集
 * @param {boolean} props.collectLoading - 采集加载状态
 * @param {string} props.keywords - 当前搜索关键词
 * @param {boolean} props.hasSearched - 是否已执行过搜索
 * @param {boolean} props.isLoggedIn - 是否已登录
 * @param {string} props.searchError - 搜索错误信息
 * @param {Function} [props.onNoteClick] - 点击笔记查看详情 (note) => void
 */
function ResultList({
  notes = [],
  selectedIds,
  onToggleSelect,
  onSelectAll,
  onCollect,
  collectLoading,
  keywords,
  hasSearched = false,
  isLoggedIn = true,
  searchError = '',
  onNoteClick,
}) {
  if (!notes || notes.length === 0) {
    /* 区分不同的空状态场景，给出针对性的提示 */
    let emptyContent;

    if (!hasSearched) {
      /* 初始状态：尚未搜索 */
      emptyContent = (
        <Empty
          image={<SearchOutlined style={{ fontSize: 48, color: '#ccc' }} />}
          description={
            <div>
              <Paragraph style={{ fontSize: 16, color: '#666', marginBottom: 4 }}>
                输入关键词开始搜索小红书笔记
              </Paragraph>
              <Text type="secondary">支持搜索主题、标签、用户等</Text>
            </div>
          }
        />
      );
    } else if (searchError && !isLoggedIn) {
      /* 搜索失败且未登录 */
      emptyContent = (
        <Alert
          message="需要登录"
          description="请先在「设置」中打开浏览器登录小红书，登录后即可搜索。"
          type="warning"
          showIcon
          icon={<LoginOutlined />}
        />
      );
    } else if (searchError) {
      /* 搜索出错 */
      emptyContent = (
        <Alert
          message="搜索出错"
          description={searchError}
          type="error"
          showIcon
        />
      );
    } else {
      /* 搜索成功但无结果 */
      emptyContent = (
        <Empty description={`未找到与「${keywords}」相关的笔记，试试其他关键词？`} />
      );
    }

    return (
      <div style={{ background: '#fff', borderRadius: 12, padding: 60 }}>
        {emptyContent}
      </div>
    );
  }

  const allSelected = notes.length > 0 && selectedIds.size === notes.length;
  const someSelected = selectedIds.size > 0 && selectedIds.size < notes.length;

  return (
    <div>
      {/* 操作栏 */}
      <div
        style={{
          background: '#fff',
          borderRadius: 12,
          padding: '12px 20px',
          marginBottom: 16,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        }}
      >
        <Space>
          <Checkbox
            indeterminate={someSelected}
            checked={allSelected}
            onChange={(e) => onSelectAll(e.target.checked)}
          >
            全选
          </Checkbox>
          <Text type="secondary">
            搜索「{keywords}」找到 {notes.length} 条结果，已选 {selectedIds.size} 条
          </Text>
        </Space>
        <Button
          type="primary"
          icon={<DownloadOutlined />}
          disabled={selectedIds.size === 0}
          loading={collectLoading}
          onClick={onCollect}
        >
          采集选中 ({selectedIds.size})
        </Button>
      </div>

      {/* 卡片网格 */}
      <Row gutter={[16, 16]}>
        {notes.map((note, index) => {
          /* 用 noteId 作为稳定 key，fallback 用 index（避免 Math.random 导致重复渲染） */
          const stableKey = note.noteId || `note-${index}`;
          return (
            <Col key={stableKey} xs={24} sm={12} md={8} lg={6} xl={4}>
              <ResultCard
                note={note}
                selected={selectedIds.has(stableKey)}
                onSelect={(checked) => onToggleSelect(stableKey, checked, note)}
                onClick={onNoteClick}
              />
            </Col>
          );
        })}
      </Row>
    </div>
  );
}

export default ResultList;
