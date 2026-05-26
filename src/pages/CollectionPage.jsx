/**
 * @fileoverview 采集管理页面
 * 展示所有已采集的数据集，支持查看详情（带排序筛选）、删除和跳转导出。
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  Typography,
  message,
  Drawer,
  Table,
  Tag,
  Space,
  Input,
  Select,
  InputNumber,
  Button,
  Tooltip,
  Divider,
} from 'antd';
import {
  ReloadOutlined,
  LikeOutlined,
  MessageOutlined,
  StarOutlined,
} from '@ant-design/icons';
import CollectionTable from '../components/CollectionTable';
import StatsBar from '../components/StatsBar';
import ExportDialog from '../components/ExportDialog';
import NoteDetailDrawer from '../components/NoteDetailDrawer';
import AiAnalysisPanel from '../components/AiAnalysisPanel';
import api from '../hooks/useApi';

const { Title, Text, Paragraph } = Typography;

function CollectionPage() {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [detailData, setDetailData] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [exportTarget, setExportTarget] = useState(null);

  /* 排序和筛选状态 */
  const [sortField, setSortField] = useState('likes');
  const [sortOrder, setSortOrder] = useState('desc');
  const [filterKeyword, setFilterKeyword] = useState('');
  const [minLikes, setMinLikes] = useState(undefined);
  /** 笔记详情抽屉 */
  const [noteDetailOpen, setNoteDetailOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);

  /** 加载数据集列表 */
  const loadCollections = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.listCollections();
      setCollections(data || []);
    } catch (err) {
      message.error('加载数据集列表失败');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCollections();
  }, [loadCollections]);

  /** 查看数据集详情 */
  const handleView = useCallback(async (record) => {
    setDrawerOpen(true);
    setDetailLoading(true);
    try {
      const params = { sortField, sortOrder };
      if (filterKeyword) params.keyword = filterKeyword;
      if (minLikes !== undefined) params.minLikes = minLikes;

      const data = await api.getCollection(record.collectionId, params);
      setDetailData(data);
    } catch (err) {
      message.error('加载详情失败');
    } finally {
      setDetailLoading(false);
    }
  }, [sortField, sortOrder, filterKeyword, minLikes]);

  /** 删除数据集 */
  const handleDelete = useCallback(async (collectionId) => {
    try {
      await api.deleteCollection(collectionId);
      message.success('删除成功');
      loadCollections();
    } catch (err) {
      message.error('删除失败');
    }
  }, [loadCollections]);

  /** 打开导出弹窗 */
  const handleExport = useCallback((record) => {
    setExportTarget(record);
    setExportOpen(true);
  }, []);

  /** 详情表格列定义 */
  const detailColumns = [
    {
      title: '序号',
      key: 'index',
      width: 60,
      render: (_, __, idx) => idx + 1,
    },
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      width: 200,
      ellipsis: true,
      render: (text, record) => (
        <Text
          strong
          style={{ cursor: 'pointer', color: '#ff2442' }}
          onClick={() => { setSelectedNote(record); setNoteDetailOpen(true); }}
        >
          {text || '无标题'}
        </Text>
      ),
    },
    {
      title: '作者',
      key: 'author',
      width: 120,
      render: (_, record) => record.author?.nickname || '未知',
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 80,
      render: (type) => (
        <Tag color={type === 'video' ? 'purple' : 'green'}>
          {type === 'video' ? '视频' : '图文'}
        </Tag>
      ),
    },
    {
      title: '点赞',
      key: 'likes',
      width: 80,
      sorter: (a, b) => (a.interactions?.likes || 0) - (b.interactions?.likes || 0),
      render: (_, r) => (
        <Space size={2}>
          <LikeOutlined style={{ color: '#ff2442' }} />
          {r.interactions?.likes || 0}
        </Space>
      ),
    },
    {
      title: '评论',
      key: 'comments',
      width: 80,
      sorter: (a, b) => (a.interactions?.comments || 0) - (b.interactions?.comments || 0),
      render: (_, r) => (
        <Space size={2}>
          <MessageOutlined style={{ color: '#faad14' }} />
          {r.interactions?.comments || 0}
        </Space>
      ),
    },
    {
      title: '收藏',
      key: 'collects',
      width: 80,
      sorter: (a, b) => (a.interactions?.collects || 0) - (b.interactions?.collects || 0),
      render: (_, r) => (
        <Space size={2}>
          <StarOutlined style={{ color: '#1890ff' }} />
          {r.interactions?.collects || 0}
        </Space>
      ),
    },
    {
      title: '摘要',
      dataIndex: 'desc',
      key: 'desc',
      ellipsis: true,
      render: (text) => <Text type="secondary">{text || '-'}</Text>,
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Title level={4} style={{ margin: 0 }}>数据管理</Title>
        <Button icon={<ReloadOutlined />} onClick={loadCollections} loading={loading}>
          刷新
        </Button>
      </div>

      <CollectionTable
        collections={collections}
        loading={loading}
        onView={handleView}
        onDelete={handleDelete}
        onExport={handleExport}
      />

      {/* 详情抽屉 */}
      <Drawer
        title={detailData ? `数据集详情：${detailData.topic}` : '加载中...'}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        width={960}
        extra={
          <Space>
            <Select
              value={sortField}
              onChange={setSortField}
              style={{ width: 100 }}
              options={[
                { value: 'likes', label: '按点赞' },
                { value: 'comments', label: '按评论' },
                { value: 'collects', label: '按收藏' },
              ]}
              size="small"
            />
            <Select
              value={sortOrder}
              onChange={setSortOrder}
              style={{ width: 80 }}
              options={[
                { value: 'desc', label: '降序' },
                { value: 'asc', label: '升序' },
              ]}
              size="small"
            />
            <Input
              placeholder="关键词"
              value={filterKeyword}
              onChange={e => setFilterKeyword(e.target.value)}
              style={{ width: 120 }}
              size="small"
              allowClear
            />
            <InputNumber
              placeholder="最少点赞"
              value={minLikes}
              onChange={setMinLikes}
              style={{ width: 100 }}
              size="small"
              min={0}
            />
            <Button
              size="small"
              type="primary"
              onClick={() => detailData && handleView({ collectionId: detailData.collectionId })}
            >
              应用
            </Button>
          </Space>
        }
      >
        {detailData && (
          <>
            <StatsBar stats={detailData.stats} />
            <Table
              dataSource={detailData.notes}
              columns={detailColumns}
              loading={detailLoading}
              rowKey={(r) => r.noteId || r.title}
              size="small"
              pagination={{ pageSize: 20 }}
              scroll={{ x: 800 }}
            />

            {/* AI 智能分析 */}
            <Divider />
            <AiAnalysisPanel
              collectionId={detailData.collectionId}
              noteCount={detailData.notes?.length}
              title="AI 智能分析"
            />
          </>
        )}
      </Drawer>

      {/* 导出弹窗 */}
      <ExportDialog
        open={exportOpen}
        collection={exportTarget}
        onClose={() => setExportOpen(false)}
      />

      {/* 笔记详情抽屉 */}
      <NoteDetailDrawer
        open={noteDetailOpen}
        note={selectedNote}
        onClose={() => { setNoteDetailOpen(false); setSelectedNote(null); }}
      />
    </div>
  );
}

export default CollectionPage;
