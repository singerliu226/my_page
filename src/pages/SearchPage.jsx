/**
 * @fileoverview 搜索页面
 * 整合 SearchPanel 和 ResultList 组件，管理搜索状态和采集流程。
 * 用户可以：搜索关键词 -> 查看结果 -> 勾选笔记 -> 输入主题名 -> 发起采集。
 */

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { message, Modal, Input, Typography, Divider } from 'antd';
import { RobotOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import SearchPanel from '../components/SearchPanel';
import ResultList from '../components/ResultList';
import NoteDetailDrawer from '../components/NoteDetailDrawer';
import AiAnalysisPanel from '../components/AiAnalysisPanel';
import SmartAnalysisPanel from '../components/SmartAnalysisPanel';
import api from '../hooks/useApi';

const { Paragraph } = Typography;

function SearchPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [collectLoading, setCollectLoading] = useState(false);
  const [notes, setNotes] = useState([]);
  const [keywords, setKeywords] = useState('');
  const [selectedIds, setSelectedIds] = useState(new Set());
  /** noteId -> note 对象的映射，用于采集时获取完整数据 */
  const [selectedNotesMap, setSelectedNotesMap] = useState(new Map());
  /** 是否已执行过搜索 */
  const [hasSearched, setHasSearched] = useState(false);
  /** 是否已登录 */
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  /** 搜索错误信息 */
  const [searchError, setSearchError] = useState('');
  /** 笔记详情抽屉 */
  const [detailNote, setDetailNote] = useState(null);

  /* 初始化时检查登录状态 */
  useEffect(() => {
    api.getConfig()
      .then(data => setIsLoggedIn(data?.loggedIn || false))
      .catch(() => setIsLoggedIn(false));
  }, []);

  /** 执行搜索 */
  const handleSearch = useCallback(async (kw) => {
    setLoading(true);
    setKeywords(kw);
    setSelectedIds(new Set());
    setSelectedNotesMap(new Map());
    setHasSearched(true);
    setSearchError('');
    try {
      const result = await api.search(kw);
      setNotes(result.notes || []);
      if ((result.notes || []).length === 0) {
        message.info('未找到相关笔记');
      }
    } catch (err) {
      setSearchError(err.message);
      setNotes([]);
      message.error('搜索失败: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  /** 切换单条选中 */
  const handleToggleSelect = useCallback((noteId, checked, note) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (checked) next.add(noteId);
      else next.delete(noteId);
      return next;
    });
    setSelectedNotesMap(prev => {
      const next = new Map(prev);
      if (checked) next.set(noteId, note);
      else next.delete(noteId);
      return next;
    });
  }, []);

  /** 全选/取消 — key 生成逻辑需与 ResultList 保持一致 */
  const handleSelectAll = useCallback((checked) => {
    if (checked) {
      const ids = new Set();
      const map = new Map();
      notes.forEach((note, index) => {
        const key = note.noteId || `note-${index}`;
        ids.add(key);
        map.set(key, note);
      });
      setSelectedIds(ids);
      setSelectedNotesMap(map);
    } else {
      setSelectedIds(new Set());
      setSelectedNotesMap(new Map());
    }
  }, [notes]);

  /** 发起采集 */
  const handleCollect = useCallback(() => {
    if (selectedIds.size === 0) {
      message.warning('请先选择要采集的笔记');
      return;
    }

    let topicValue = keywords;

    Modal.confirm({
      title: '开始采集',
      content: (
        <div>
          <Paragraph>
            将采集 <strong>{selectedIds.size}</strong> 条笔记的详细内容和评论。
            <br />
            请输入本次采集的主题名称：
          </Paragraph>
          <Input
            defaultValue={keywords}
            placeholder="输入采集主题名称"
            onChange={e => { topicValue = e.target.value; }}
          />
        </div>
      ),
      okText: '开始采集',
      cancelText: '取消',
      onOk: async () => {
        if (!topicValue?.trim()) {
          message.warning('请输入主题名称');
          throw new Error('cancelled');
        }
        setCollectLoading(true);
        try {
          const selectedNotes = Array.from(selectedNotesMap.values());
          const result = await api.collect(topicValue.trim(), selectedNotes, true);
          setSelectedIds(new Set());
          setSelectedNotesMap(new Map());

          /* 采集完成后询问是否跳转到数据管理页 */
          Modal.success({
            title: '采集完成',
            content: `成功 ${result.stats.success} 条，失败 ${result.stats.fail} 条`,
            okText: '查看数据',
            cancelText: '继续搜索',
            onOk: () => navigate('/projects/rednote/collections'),
          });
        } catch (err) {
          message.error('采集失败: ' + err.message);
        } finally {
          setCollectLoading(false);
        }
      },
    });
  }, [selectedIds, selectedNotesMap, keywords]);

  /** 选中的笔记数组，供 AI 分析面板使用 */
  const selectedNotesArray = useMemo(
    () => Array.from(selectedNotesMap.values()),
    [selectedNotesMap],
  );

  return (
    <div>
      <SearchPanel onSearch={handleSearch} loading={loading} />

      {/* 智能搜索分析：无需手动搜索，AI 自动完成全流程 */}
      <SmartAnalysisPanel />

      <ResultList
        notes={notes}
        selectedIds={selectedIds}
        onToggleSelect={handleToggleSelect}
        onSelectAll={handleSelectAll}
        onCollect={handleCollect}
        collectLoading={collectLoading}
        keywords={keywords}
        hasSearched={hasSearched}
        isLoggedIn={isLoggedIn}
        searchError={searchError}
        onNoteClick={(note) => setDetailNote(note)}
      />

      {/* 搜索结果存在时，展示 AI 分析面板 */}
      {notes.length > 0 && (
        <div style={{
          background: '#fff',
          borderRadius: 12,
          padding: 24,
          marginTop: 16,
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        }}>
          <Divider orientation="left" style={{ marginTop: 0 }}>
            <RobotOutlined style={{ color: '#722ed1', marginRight: 6 }} />
            AI 智能分析
            {selectedIds.size > 0
              ? `（已选 ${selectedIds.size} 条笔记）`
              : `（全部 ${notes.length} 条笔记）`}
          </Divider>
          <AiAnalysisPanel
            notes={selectedIds.size > 0 ? selectedNotesArray : notes}
            noteCount={selectedIds.size > 0 ? selectedIds.size : notes.length}
          />
        </div>
      )}

      <NoteDetailDrawer
        open={!!detailNote}
        note={detailNote}
        onClose={() => setDetailNote(null)}
      />
    </div>
  );
}

export default SearchPage;
