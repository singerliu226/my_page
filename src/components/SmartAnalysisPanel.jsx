/**
 * @fileoverview 智能搜索分析面板
 * Agent 模式：用户输入自然语言需求 → AI 自动提取关键词 → 搜索笔记 → 获取详情 → 流式生成分析报告。
 * 全程通过 SSE 展示实时进度和打字机效果的分析结果。
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Input,
  Button,
  Space,
  Tag,
  Typography,
  Spin,
  Card,
  Steps,
  message,
  Tooltip,
  Alert,
} from 'antd';
import {
  RobotOutlined,
  SendOutlined,
  CopyOutlined,
  ClearOutlined,
  BulbOutlined,
  SearchOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import ExportDropdown from './ExportDropdown';

const { TextArea } = Input;
const { Text, Title } = Typography;

/** 预设智能分析模板 */
const SMART_TEMPLATES = [
  { label: '考研院校', prompt: '帮我了解一下新传考研的热门院校和报录比信息' },
  { label: '热门趋势', prompt: '最近小红书上有什么热门话题和内容趋势' },
  { label: '产品调研', prompt: '帮我调研一下最近热门的防晒霜产品，分析用户评价和推荐' },
  { label: '探店攻略', prompt: '帮我搜集上海最近的热门探店推荐，总结值得去的店' },
  { label: '穿搭参考', prompt: '帮我看看最近流行的夏季穿搭风格和搭配技巧' },
];

/**
 * 进度步骤的配置映射
 * @type {Array<{key: string, title: string, icon: React.ReactNode}>}
 */
const STEP_CONFIG = [
  { key: 'understand', title: '生成搜索策略', icon: <RobotOutlined /> },
  { key: 'search', title: '多轮搜索', icon: <SearchOutlined /> },
  { key: 'detail', title: '获取详情', icon: <FileTextOutlined /> },
  { key: 'analyze', title: '综合分析', icon: <BulbOutlined /> },
];

function SmartAnalysisPanel() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  /** 当前进度步骤索引 */
  const [currentStep, setCurrentStep] = useState(-1);
  /** 进度状态消息 */
  const [statusMsg, setStatusMsg] = useState('');
  /** AI 提取到的搜索关键词 */
  const [keywords, setKeywords] = useState('');
  /** 搜索到的笔记数 */
  const [noteCount, setNoteCount] = useState(0);
  const resultRef = useRef(null);

  /* 结果区域自动滚动到底部 */
  useEffect(() => {
    if (resultRef.current) {
      resultRef.current.scrollTop = resultRef.current.scrollHeight;
    }
  }, [result]);

  /** 发起智能搜索分析 */
  const handleSmartAnalyze = useCallback(async (customPrompt) => {
    const finalPrompt = customPrompt || prompt;
    if (!finalPrompt.trim()) {
      message.warning('请输入你的需求');
      return;
    }

    setLoading(true);
    setResult('');
    setCurrentStep(0);
    setStatusMsg('');
    setKeywords('');
    setNoteCount(0);

    try {
      const response = await fetch('/api/ai/smart-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: finalPrompt.trim() }),
      });

      if (response.headers.get('content-type')?.includes('application/json')) {
        const errData = await response.json();
        throw new Error(errData.error || '请求失败');
      }

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
            const evt = JSON.parse(dataStr);

            switch (evt.type) {
              case 'status':
                setStatusMsg(evt.message);
                if (evt.message.includes('理解')) setCurrentStep(0);
                else if (evt.message.includes('搜索')) setCurrentStep(1);
                else if (evt.message.includes('获取')) setCurrentStep(2);
                else if (evt.message.includes('分析')) setCurrentStep(3);
                break;
              case 'keywords':
                setKeywords(evt.keywords);
                setCurrentStep(1);
                break;
              case 'notes':
                setNoteCount(evt.noteCount);
                setCurrentStep(2);
                break;
              case 'content':
                if (currentStep < 3) setCurrentStep(3);
                setResult(prev => prev + evt.content);
                break;
              case 'done':
                setCurrentStep(4);
                break;
              case 'error':
                throw new Error(evt.message);
              default:
                break;
            }
          } catch (e) {
            if (e.message && !e.message.includes('JSON')) throw e;
          }
        }
      }
    } catch (err) {
      message.error(err.message || '智能分析失败');
      if (!result) setResult(`分析失败: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [prompt]);

  const handleCopy = useCallback(() => {
    if (!result) return;
    navigator.clipboard.writeText(result).then(() => message.success('已复制到剪贴板'));
  }, [result]);

  return (
    <div style={{
      background: '#fff',
      borderRadius: 12,
      padding: 24,
      marginBottom: 16,
      boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <RobotOutlined style={{ fontSize: 22, color: '#722ed1' }} />
        <Title level={5} style={{ margin: 0 }}>AI 智能搜索分析</Title>
        <Tag color="purple">Agent</Tag>
        <Text type="secondary" style={{ fontSize: 12 }}>输入你的需求，AI 自动搜索并分析小红书笔记</Text>
      </div>

      {/* 快捷模板 */}
      <div style={{ marginBottom: 12 }}>
        <Space size={[0, 8]} wrap>
          <BulbOutlined style={{ color: '#faad14', marginRight: 4 }} />
          <Text type="secondary" style={{ fontSize: 13, marginRight: 4 }}>试试：</Text>
          {SMART_TEMPLATES.map((tpl, idx) => (
            <Tag
              key={idx}
              color="purple"
              style={{ cursor: loading ? 'not-allowed' : 'pointer' }}
              onClick={() => {
                if (loading) return;
                setPrompt(tpl.prompt);
                handleSmartAnalyze(tpl.prompt);
              }}
            >
              {tpl.label}
            </Tag>
          ))}
        </Space>
      </div>

      {/* 输入框 */}
      <Space.Compact style={{ width: '100%', marginBottom: 16 }}>
        <TextArea
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          placeholder="输入你想了解的内容，例如：帮我了解新传考研的热门院校信息..."
          autoSize={{ minRows: 2, maxRows: 4 }}
          disabled={loading}
          onPressEnter={(e) => {
            if (!e.shiftKey) {
              e.preventDefault();
              handleSmartAnalyze();
            }
          }}
          style={{ borderRadius: '8px 0 0 8px' }}
        />
        <Button
          type="primary"
          icon={<SendOutlined />}
          loading={loading}
          onClick={() => handleSmartAnalyze()}
          style={{
            height: 'auto',
            minHeight: 54,
            borderRadius: '0 8px 8px 0',
            background: '#722ed1',
            borderColor: '#722ed1',
          }}
        >
          {loading ? '分析中' : '开始'}
        </Button>
      </Space.Compact>

      {/* 进度步骤条 */}
      {currentStep >= 0 && (
        <div style={{ marginBottom: 16, padding: '12px 16px', background: '#faf5ff', borderRadius: 8 }}>
          <Steps
            size="small"
            current={currentStep}
            items={STEP_CONFIG.map((step, idx) => {
              let description = '';
              if (idx === 0 && keywords) {
                const kwArr = keywords.split(' | ');
                description = `${kwArr.length} 组关键词`;
              } else if (idx === 1 && noteCount) {
                description = `去重后共 ${noteCount} 条`;
              } else if (idx === currentStep) {
                description = statusMsg;
              }

              return {
                title: step.title,
                icon: idx < currentStep ? <CheckCircleOutlined style={{ color: '#52c41a' }} />
                  : idx === currentStep && loading ? <LoadingOutlined style={{ color: '#722ed1' }} />
                  : step.icon,
                description: description || undefined,
              };
            })}
          />
        </div>
      )}

      {/* 分析结果 */}
      {(result || (loading && currentStep >= 3)) && (
        <Card
          size="small"
          style={{ borderRadius: 12, border: '1px solid #f0e6ff' }}
          title={
            <Space>
              <RobotOutlined style={{ color: '#722ed1' }} />
              <Text strong>分析结果</Text>
              {loading && <Spin size="small" />}
              {keywords && <Tag color="blue">关键词：{keywords}</Tag>}
              {noteCount > 0 && <Tag color="purple">{noteCount} 条笔记</Tag>}
            </Space>
          }
          extra={
            result && !loading && (
              <Space>
                <ExportDropdown
                  content={result}
                  prompt={prompt}
                  keywords={keywords}
                  noteCount={noteCount}
                />
                <Tooltip title="复制">
                  <Button size="small" icon={<CopyOutlined />} onClick={handleCopy} />
                </Tooltip>
                <Tooltip title="清除">
                  <Button size="small" icon={<ClearOutlined />} onClick={() => {
                    setResult('');
                    setCurrentStep(-1);
                    setKeywords('');
                    setNoteCount(0);
                  }} />
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
            {result || (loading ? '正在生成分析报告...' : '')}
          </div>
        </Card>
      )}
    </div>
  );
}

export default SmartAnalysisPanel;
