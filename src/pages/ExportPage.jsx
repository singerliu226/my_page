/**
 * @fileoverview 导出中心页面
 * 展示所有已导出的文件列表，支持下载和查看导出历史。
 * 也提供从数据集直接发起导出的入口。
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  Typography,
  Table,
  Button,
  Space,
  Tag,
  Select,
  message,
  Card,
  Empty,
  Tooltip,
} from 'antd';
import {
  DownloadOutlined,
  ReloadOutlined,
  FileMarkdownOutlined,
  FileExcelOutlined,
  FileTextOutlined,
  ExportOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import ExportDialog from '../components/ExportDialog';
import api from '../hooks/useApi';

const { Title, Text } = Typography;

/**
 * 根据文件扩展名返回图标和标签颜色
 * @param {string} filename
 * @returns {{ icon, color, label }}
 */
function getFileTypeInfo(filename) {
  if (filename.endsWith('.md')) {
    return { icon: <FileMarkdownOutlined />, color: 'purple', label: 'Markdown' };
  }
  if (filename.endsWith('.xlsx')) {
    return { icon: <FileExcelOutlined />, color: 'green', label: 'Excel' };
  }
  if (filename.endsWith('.json')) {
    return { icon: <FileTextOutlined />, color: 'blue', label: 'JSON' };
  }
  return { icon: <FileTextOutlined />, color: 'default', label: '其他' };
}

/**
 * 格式化文件大小
 * @param {number} bytes
 * @returns {string}
 */
function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function ExportPage() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [collections, setCollections] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [exportOpen, setExportOpen] = useState(false);

  /** 加载导出文件列表 */
  const loadFiles = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.listExports();
      setFiles(data || []);
    } catch (err) {
      /* 目录为空时可能报错，忽略 */
      setFiles([]);
    } finally {
      setLoading(false);
    }
  }, []);

  /** 加载数据集列表（用于选择导出源） */
  const loadCollections = useCallback(async () => {
    try {
      const data = await api.listCollections();
      setCollections(data || []);
    } catch (err) {
      /* 忽略 */
    }
  }, []);

  useEffect(() => {
    loadFiles();
    loadCollections();
  }, [loadFiles, loadCollections]);

  /** 下载文件 */
  const handleDownload = (downloadUrl) => {
    window.open(downloadUrl, '_blank');
  };

  /** 发起新导出 */
  const handleNewExport = () => {
    if (!selectedCollection) {
      message.warning('请先选择一个数据集');
      return;
    }
    const col = collections.find(c => c.collectionId === selectedCollection);
    if (col) {
      setExportOpen(true);
    }
  };

  /** 表格列定义 */
  const columns = [
    {
      title: '文件名',
      dataIndex: 'filename',
      key: 'filename',
      render: (name) => {
        const info = getFileTypeInfo(name);
        return (
          <Space>
            {info.icon}
            <Text>{name}</Text>
          </Space>
        );
      },
    },
    {
      title: '格式',
      dataIndex: 'filename',
      key: 'format',
      width: 100,
      render: (name) => {
        const info = getFileTypeInfo(name);
        return <Tag color={info.color}>{info.label}</Tag>;
      },
    },
    {
      title: '大小',
      dataIndex: 'size',
      key: 'size',
      width: 100,
      sorter: (a, b) => a.size - b.size,
      render: (size) => formatSize(size),
    },
    {
      title: '导出时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
      defaultSortOrder: 'descend',
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      render: (time) => (
        <Tooltip title={time}>
          <Text type="secondary">{dayjs(time).format('YYYY-MM-DD HH:mm')}</Text>
        </Tooltip>
      ),
    },
    {
      title: '操作',
      key: 'actions',
      width: 100,
      render: (_, record) => (
        <Button
          type="primary"
          size="small"
          icon={<DownloadOutlined />}
          onClick={() => handleDownload(record.downloadUrl)}
        >
          下载
        </Button>
      ),
    },
  ];

  const selectedCol = collections.find(c => c.collectionId === selectedCollection);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Title level={4} style={{ margin: 0 }}>导出中心</Title>
        <Button icon={<ReloadOutlined />} onClick={loadFiles} loading={loading}>
          刷新
        </Button>
      </div>

      {/* 新建导出 */}
      <Card
        size="small"
        style={{ marginBottom: 16, borderRadius: 12 }}
        title="新建导出"
      >
        <Space>
          <Select
            placeholder="选择数据集"
            style={{ width: 300 }}
            value={selectedCollection}
            onChange={setSelectedCollection}
            options={collections.map(c => ({
              value: c.collectionId,
              label: `${c.topic} (${c.noteCount}条, ${dayjs(c.createdAt).format('MM-DD HH:mm')})`,
            }))}
            allowClear
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
          />
          <Button
            type="primary"
            icon={<ExportOutlined />}
            onClick={handleNewExport}
            disabled={!selectedCollection}
          >
            导出
          </Button>
        </Space>
      </Card>

      {/* 已导出文件列表 */}
      {files.length > 0 ? (
        <Table
          dataSource={files}
          columns={columns}
          rowKey="filename"
          loading={loading}
          pagination={{ pageSize: 15, showSizeChanger: true }}
          style={{ background: '#fff', borderRadius: 12, overflow: 'hidden' }}
        />
      ) : (
        <Card style={{ borderRadius: 12 }}>
          <Empty description="暂无导出文件，请先采集数据再进行导出" />
        </Card>
      )}

      {/* 导出弹窗 */}
      <ExportDialog
        open={exportOpen}
        collection={selectedCol}
        onClose={() => {
          setExportOpen(false);
          loadFiles();
        }}
      />
    </div>
  );
}

export default ExportPage;
