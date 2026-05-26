/**
 * @fileoverview 数据集表格组件
 * 展示已采集的数据集列表，支持查看详情、删除和导出操作。
 */

import React from 'react';
import { Table, Button, Space, Tag, Popconfirm, Typography, Tooltip } from 'antd';
import {
  EyeOutlined,
  DeleteOutlined,
  ExportOutlined,
  FileTextOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Text } = Typography;

/**
 * 数据集表格
 * 
 * @param {Object} props
 * @param {Array} props.collections - 数据集列表
 * @param {boolean} props.loading - 加载状态
 * @param {Function} props.onView - 查看详情回调
 * @param {Function} props.onDelete - 删除回调
 * @param {Function} props.onExport - 导出回调
 */
function CollectionTable({ collections, loading, onView, onDelete, onExport }) {
  const columns = [
    {
      title: '主题',
      dataIndex: 'topic',
      key: 'topic',
      width: 200,
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: '笔记数',
      dataIndex: 'noteCount',
      key: 'noteCount',
      width: 100,
      sorter: (a, b) => (a.noteCount || 0) - (b.noteCount || 0),
      render: (count) => <Tag color="blue">{count} 条</Tag>,
    },
    {
      title: '采集状态',
      dataIndex: 'stats',
      key: 'stats',
      width: 160,
      render: (stats) => (
        <Space size={4}>
          <Tag color="green">成功 {stats?.success || 0}</Tag>
          {stats?.fail > 0 && <Tag color="red">失败 {stats.fail}</Tag>}
        </Space>
      ),
    },
    {
      title: '采集时间',
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
      width: 240,
      render: (_, record) => (
        <Space>
          <Button
            size="small"
            icon={<EyeOutlined />}
            onClick={() => onView(record)}
          >
            查看
          </Button>
          <Button
            size="small"
            type="primary"
            icon={<ExportOutlined />}
            onClick={() => onExport(record)}
          >
            导出
          </Button>
          <Popconfirm
            title="确认删除？"
            description="删除后数据将无法恢复"
            onConfirm={() => onDelete(record.collectionId)}
            okText="删除"
            cancelText="取消"
            okButtonProps={{ danger: true }}
          >
            <Button size="small" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Table
      dataSource={collections}
      columns={columns}
      loading={loading}
      rowKey="collectionId"
      pagination={{ pageSize: 10, showSizeChanger: true }}
      style={{
        background: '#fff',
        borderRadius: 12,
        overflow: 'hidden',
      }}
    />
  );
}

export default CollectionTable;
