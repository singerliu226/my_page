/**
 * @fileoverview 导出对话框组件
 * 选择导出格式和选项，发起导出请求，展示下载链接。
 */

import React, { useState } from 'react';
import { Modal, Radio, Button, Space, List, Typography, message, Alert, Spin, Divider } from 'antd';
import {
  FileMarkdownOutlined,
  FileExcelOutlined,
  FileTextOutlined,
  DownloadOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import api from '../hooks/useApi';

const { Text } = Typography;

/** 导出格式选项 */
const FORMAT_OPTIONS = [
  { value: 'all', label: '全部格式', desc: 'Markdown + Excel + JSON', icon: '📦' },
  { value: 'markdown', label: 'Markdown', desc: '结构化报告文档', icon: '📝' },
  { value: 'excel', label: 'Excel', desc: '多Sheet数据表格', icon: '📊' },
  { value: 'json', label: 'JSON', desc: '结构化数据', icon: '💾' },
];

/**
 * 导出对话框
 * 
 * @param {Object} props
 * @param {boolean} props.open - 是否显示
 * @param {Object} props.collection - 目标数据集
 * @param {Function} props.onClose - 关闭回调
 */
function ExportDialog({ open, collection, onClose }) {
  const [format, setFormat] = useState('all');
  const [loading, setLoading] = useState(false);
  const [exportResult, setExportResult] = useState(null);

  /** 发起导出 */
  const handleExport = async () => {
    if (!collection) return;
    setLoading(true);
    setExportResult(null);
    try {
      const result = await api.exportCollection(collection.collectionId, format);
      setExportResult(result);
      message.success('导出成功！');
    } catch (err) {
      message.error('导出失败: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  /** 下载文件 */
  const handleDownload = (downloadUrl) => {
    window.open(downloadUrl, '_blank');
  };

  /** 关闭时重置状态 */
  const handleClose = () => {
    setExportResult(null);
    setFormat('all');
    onClose();
  };

  /** 获取格式对应图标 */
  const getFormatIcon = (fmt) => {
    switch (fmt) {
      case 'markdown': return <FileMarkdownOutlined style={{ color: '#722ed1' }} />;
      case 'excel': return <FileExcelOutlined style={{ color: '#52c41a' }} />;
      case 'json': return <FileTextOutlined style={{ color: '#1890ff' }} />;
      default: return <FileTextOutlined />;
    }
  };

  return (
    <Modal
      title={`导出数据集${collection ? ': ' + collection.topic : ''}`}
      open={open}
      onCancel={handleClose}
      footer={null}
      width={520}
    >
      {!exportResult ? (
        <>
          <Alert
            message={`数据集包含 ${collection?.noteCount || collection?.stats?.total || 0} 条笔记`}
            type="info"
            showIcon
            style={{ marginBottom: 16 }}
          />

          <Text strong style={{ display: 'block', marginBottom: 8 }}>选择导出格式：</Text>

          <Radio.Group
            value={format}
            onChange={(e) => setFormat(e.target.value)}
            style={{ width: '100%' }}
          >
            <Space direction="vertical" style={{ width: '100%' }}>
              {FORMAT_OPTIONS.map((opt) => (
                <Radio.Button
                  key={opt.value}
                  value={opt.value}
                  style={{
                    width: '100%',
                    height: 'auto',
                    padding: '10px 16px',
                    borderRadius: 8,
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <span style={{ fontSize: 20, marginRight: 12 }}>{opt.icon}</span>
                  <div>
                    <Text strong>{opt.label}</Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: 12 }}>{opt.desc}</Text>
                  </div>
                </Radio.Button>
              ))}
            </Space>
          </Radio.Group>

          <div style={{ marginTop: 20, textAlign: 'right' }}>
            <Space>
              <Button onClick={handleClose}>取消</Button>
              <Button
                type="primary"
                icon={<DownloadOutlined />}
                loading={loading}
                onClick={handleExport}
              >
                开始导出
              </Button>
            </Space>
          </div>
        </>
      ) : (
        <>
          <Alert
            message="导出成功！"
            type="success"
            icon={<CheckCircleOutlined />}
            showIcon
            style={{ marginBottom: 16 }}
          />

          <Divider orientation="left">下载文件</Divider>

          <List
            dataSource={exportResult.files}
            renderItem={(file) => (
              <List.Item
                actions={[
                  <Button
                    type="link"
                    icon={<DownloadOutlined />}
                    onClick={() => handleDownload(file.downloadUrl)}
                  >
                    下载
                  </Button>
                ]}
              >
                <List.Item.Meta
                  avatar={getFormatIcon(file.format)}
                  title={file.filename}
                  description={file.format.toUpperCase()}
                />
              </List.Item>
            )}
          />

          <div style={{ marginTop: 16, textAlign: 'right' }}>
            <Button onClick={handleClose}>关闭</Button>
          </div>
        </>
      )}
    </Modal>
  );
}

export default ExportDialog;
