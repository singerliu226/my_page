/**
 * @fileoverview 多格式导出下拉按钮
 * 调用后端 /api/ai/export 接口，支持 docx、xlsx、md 三种格式下载。
 * 可复用于 SmartAnalysisPanel 和 AiAnalysisPanel。
 */

import React, { useState } from 'react';
import { Dropdown, Button, message } from 'antd';
import {
  DownloadOutlined,
  FileWordOutlined,
  FileExcelOutlined,
  FileMarkdownOutlined,
} from '@ant-design/icons';

const FORMAT_ITEMS = [
  { key: 'docx', label: 'Word 文档 (.docx)', icon: <FileWordOutlined style={{ color: '#2b579a' }} /> },
  { key: 'xlsx', label: 'Excel 表格 (.xlsx)', icon: <FileExcelOutlined style={{ color: '#217346' }} /> },
  { key: 'md',   label: 'Markdown (.md)',     icon: <FileMarkdownOutlined style={{ color: '#333' }} /> },
];

/**
 * @param {Object} props
 * @param {string} props.content - AI 分析结果文本
 * @param {string} [props.prompt] - 用户分析需求
 * @param {string} [props.keywords] - 搜索关键词
 * @param {number} [props.noteCount] - 笔记数量
 * @param {boolean} [props.disabled] - 是否禁用
 */
function ExportDropdown({ content, prompt, keywords, noteCount, disabled }) {
  const [exporting, setExporting] = useState(false);

  const handleExport = async (format) => {
    if (!content) {
      message.warning('没有可导出的内容');
      return;
    }

    setExporting(true);
    try {
      const res = await fetch('/api/ai/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, format, prompt, keywords, noteCount }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `导出失败 (${res.status})`);
      }

      const blob = await res.blob();
      const disposition = res.headers.get('Content-Disposition') || '';
      const filenameMatch = disposition.match(/filename\*?=(?:UTF-8'')?([^;\n]+)/i);
      const filename = filenameMatch
        ? decodeURIComponent(filenameMatch[1])
        : `AI分析报告.${format}`;

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      message.success(`${format.toUpperCase()} 文档已下载`);
    } catch (err) {
      message.error(err.message || '导出失败');
    } finally {
      setExporting(false);
    }
  };

  const menuItems = FORMAT_ITEMS.map(item => ({
    key: item.key,
    label: item.label,
    icon: item.icon,
    onClick: () => handleExport(item.key),
  }));

  return (
    <Dropdown menu={{ items: menuItems }} trigger={['click']} disabled={disabled || !content}>
      <Button size="small" icon={<DownloadOutlined />} loading={exporting}>
        导出
      </Button>
    </Dropdown>
  );
}

export default ExportDropdown;
