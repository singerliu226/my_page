/**
 * @fileoverview AI 分析面板组件
 * 提供 AI 智能分析入口：用户输入分析需求，调用通义千问生成分析报告。
 * 支持流式输出（打字机效果）和预设分析模板。
 * 可独立使用，也可嵌入到抽屉/弹窗中。
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Input,
  Button,
  Space,
  Tag,
  Typography,
  Spin,
  Alert,
  Card,
  message,
  Tooltip,
} from 'antd';
import {
  RobotOutlined,
  SendOutlined,
  CopyOutlined,
  ClearOutlined,
  BulbOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';
import ExportDropdown from './ExportDropdown';

const { TextArea } = Input;
const { Text, Title } = Typography;

/** 预设分析模板 */
const PROMPT_TEMPLATES = [
  { label: '内容总结', prompt: '请帮我总结这些笔记的核心内容和关键信息' },
  { label: '趋势分析', prompt: '分析这些笔记反映的内容趋势和用户偏好，找出流量密码' },
  { label: '爆款拆解', prompt: '分析互动量最高的笔记，拆解其爆款要素（标题、封面、内容结构、话题选择）' },
  { label: '竞品调研', prompt: '从竞品分析的角度，总结这些笔记的内容策略、差异化特点和值得借鉴的做法' },
  { label: '选题建议', prompt: '基于这些笔记的数据，给我推荐 5 个可能获得高互动量的选题方向和写作建议' },
  { label: '用户画像', prompt: '根据笔记内容和评论，分析目标受众的用户画像（年龄、兴趣、痛点、消费偏好）' },
];

/**
 * @param {Object} props
 * @param {Array<Object>} [props.notes] - 直接传入笔记列表
 * @param {string} [props.collectionId] - 数据集 ID（与 notes 二选一）
 * @param {number} [props.noteCount] - 笔记数（用于显示）
 * @param {string} [props.title] - 面板标题
 */
function AiAnalysisPanel({ notes, collectionId, noteCount, title }) {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [aiConfigured, setAiConfigured] = useState(null);
  const resultRef = useRef(null);

  /* 检查 AI 服务状态 */
  useEffect(() => {
    fetch('/api/ai/status')
      .then(r => r.json())
      .then(d => {
        if (d.success) setAiConfigured(d.data.configured);
      })
      .catch(() => setAiConfigured(false));
  }, []);

  /* 结果区域自动滚动到底部 */
  useEffect(() => {
    if (resultRef.current) {
      resultRef.current.scrollTop = resultRef.current.scrollHeight;
    }
  }, [result]);

  /** 发起流式分析 */
  const handleAnalyze = useCallback(async (customPrompt) => {
    const finalPrompt = customPrompt || prompt;
    if (!finalPrompt.trim()) {
      message.warning('请输入分析需求');
      return;
    }

    setLoading(true);
    setResult('');

    try {
      const body = { prompt: finalPrompt.trim() };
      if (notes?.length) {
        body.notes = notes;
      } else if (collectionId) {
        body.collectionId = collectionId;
      }

      const response = await fetch('/api/ai/analyze/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      /* 非 SSE 响应（错误场景） */
      if (response.headers.get('content-type')?.includes('application/json')) {
        const errData = await response.json();
        throw new Error(errData.error || '分析失败');
      }

      /* 流式读取 SSE */
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith('data:')) continue;

          const dataStr = trimmed.slice(5).trim();
          if (dataStr === '[DONE]') continue;

          try {
            const parsed = JSON.parse(dataStr);
            if (parsed.content) {
              setResult(prev => prev + parsed.content);
            }
          } catch {
            /* 跳过 */
          }
        }
      }
    } catch (err) {
      message.error(err.message || '分析请求失败');
      setResult(`❌ 分析失败: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [prompt, notes, collectionId]);

  /** 复制结果 */
  const handleCopy = useCallback(() => {
    if (!result) return;
    navigator.clipboard.writeText(result).then(() => {
      message.success('已复制到剪贴板');
    });
  }, [result]);

  const displayCount = noteCount || notes?.length || 0;

  return (
    <div>
      {title && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <RobotOutlined style={{ fontSize: 18, color: '#722ed1' }} />
          <Title level={5} style={{ margin: 0 }}>{title}</Title>
          {displayCount > 0 && (
            <Tag color="purple">{displayCount} 条笔记</Tag>
          )}
        </div>
      )}

      {/* AI 未配置提示（非阻塞） */}
      {aiConfigured === false && (
        <Alert
          type="warning"
          showIcon
          message="AI 服务未配置"
          description="请在项目根目录 .env 文件中填写 DASHSCOPE_API_KEY 后重启服务"
          style={{ marginBottom: 12, borderRadius: 8 }}
          closable
        />
      )}

      {/* 预设模板 */}
      <div style={{ marginBottom: 12 }}>
        <Space size={[0, 8]} wrap>
          <BulbOutlined style={{ color: '#faad14', marginRight: 4 }} />
          <Text type="secondary" style={{ fontSize: 13, marginRight: 4 }}>快捷分析：</Text>
          {PROMPT_TEMPLATES.map((tpl, idx) => (
            <Tag
              key={idx}
              color="purple"
              style={{ cursor: loading ? 'not-allowed' : 'pointer' }}
              onClick={() => {
                if (loading) return;
                setPrompt(tpl.prompt);
                handleAnalyze(tpl.prompt);
              }}
            >
              <ThunderboltOutlined /> {tpl.label}
            </Tag>
          ))}
        </Space>
      </div>

      {/* 自定义输入 */}
      <Space.Compact style={{ width: '100%', marginBottom: 16 }}>
        <TextArea
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          placeholder="输入你的分析需求，例如：帮我总结这些笔记的核心观点和共同趋势..."
          autoSize={{ minRows: 2, maxRows: 4 }}
          disabled={loading}
          onPressEnter={(e) => {
            if (!e.shiftKey) {
              e.preventDefault();
              handleAnalyze();
            }
          }}
          style={{ borderRadius: '8px 0 0 8px' }}
        />
        <Button
          type="primary"
          icon={<SendOutlined />}
          loading={loading}
          onClick={() => handleAnalyze()}
          style={{
            height: 'auto',
            minHeight: 54,
            borderRadius: '0 8px 8px 0',
            background: '#722ed1',
            borderColor: '#722ed1',
          }}
        >
          {loading ? '分析中' : '发送'}
        </Button>
      </Space.Compact>

      {/* 分析结果 */}
      {(result || loading) && (
        <Card
          size="small"
          style={{ borderRadius: 12, border: '1px solid #f0e6ff' }}
          title={
            <Space>
              <RobotOutlined style={{ color: '#722ed1' }} />
              <Text strong>AI 分析结果</Text>
              {loading && <Spin size="small" />}
            </Space>
          }
          extra={
            result && !loading && (
              <Space>
                <ExportDropdown
                  content={result}
                  prompt={prompt}
                  noteCount={displayCount}
                />
                <Tooltip title="复制结果">
                  <Button size="small" icon={<CopyOutlined />} onClick={handleCopy} />
                </Tooltip>
                <Tooltip title="清除">
                  <Button size="small" icon={<ClearOutlined />} onClick={() => setResult('')} />
                </Tooltip>
              </Space>
            )
          }
        >
          <div
            ref={resultRef}
            style={{
              maxHeight: 500,
              overflowY: 'auto',
              whiteSpace: 'pre-wrap',
              lineHeight: 1.8,
              fontSize: 14,
              color: '#333',
            }}
          >
            {result || (loading ? '正在分析中，请稍候...' : '')}
          </div>
        </Card>
      )}
    </div>
  );
}

export default AiAnalysisPanel;
