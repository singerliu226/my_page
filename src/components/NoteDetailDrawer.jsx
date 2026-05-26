/**
 * @fileoverview 笔记详情抽屉组件
 * 打开时自动从后端拉取笔记完整内容（正文、全部图片、评论），
 * 确保搜索结果和采集数据都能展示完整信息。
 * 底部集成 AI 分析面板，支持自然语言引导分析。
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  Drawer,
  Typography,
  Space,
  Tag,
  Divider,
  Avatar,
  Image,
  List,
  Button,
  Spin,
  Alert,
  message,
} from 'antd';
import {
  LikeOutlined,
  MessageOutlined,
  StarOutlined,
  ShareAltOutlined,
  UserOutlined,
  CalendarOutlined,
  PlayCircleOutlined,
  RobotOutlined,
  LinkOutlined,
  LoadingOutlined,
  PictureOutlined,
} from '@ant-design/icons';
import AiAnalysisPanel from './AiAnalysisPanel';

const { Title, Text, Paragraph } = Typography;

/**
 * @param {Object} props
 * @param {boolean} props.open - 是否显示
 * @param {Object|null} props.note - 笔记基础数据（搜索结果级别）
 * @param {Function} props.onClose - 关闭回调
 */
function NoteDetailDrawer({ open, note, onClose }) {
  /** 完整笔记数据（基础 + 拉取到的详情合并后） */
  const [fullNote, setFullNote] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState('');

  /**
   * 打开抽屉时自动拉取笔记详情
   * 如果 note 已包含 detail 数据（已采集过的笔记），直接使用
   * 否则调用 /api/search/note-detail 实时获取
   */
  useEffect(() => {
    if (!open || !note) {
      setFullNote(null);
      setDetailError('');
      return;
    }

    /* 已有详情数据（采集过的笔记） */
    if (note.detail && Object.keys(note.detail).length > 0) {
      setFullNote(note);
      return;
    }

    /* 需要从后端拉取 */
    const feedId = note.feedId || note.noteId;
    if (!feedId) {
      setFullNote(note);
      return;
    }

    setDetailLoading(true);
    setDetailError('');
    setFullNote(note);

    const params = new URLSearchParams({ feedId, xsecToken: note.xsecToken || '' });
    fetch(`/api/search/note-detail?${params}`)
      .then(async (res) => {
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error || `HTTP ${res.status}`);
        }
        return res.json();
      })
      .then((json) => {
        if (json.success && json.data) {
          /**
           * MCP 返回结构：json.data = { success, feedId, detail: { note: {...}, comments: {...} } }
           * 需要解包到 detail 层级以匹配渲染逻辑
           */
          const rawDetail = json.data.detail || json.data;
          setFullNote(prev => ({
            ...prev,
            detail: rawDetail,
            comments: extractComments(rawDetail),
          }));
        }
      })
      .catch((err) => {
        setDetailError(err.message);
      })
      .finally(() => {
        setDetailLoading(false);
      });
  }, [open, note]);

  if (!note) return null;

  const displayNote = fullNote || note;
  const detail = displayNote.detail || {};
  /** MCP 返回的笔记核心数据在 detail.note 下 */
  const noteData = detail.note || {};

  const author = displayNote.author || noteData.user || detail.user || {};
  const rawInteract = noteData.interactInfo || displayNote.interactions || {};
  const interactions = {
    likes: rawInteract.likedCount || rawInteract.likes || 0,
    comments: rawInteract.commentCount || rawInteract.comments || 0,
    collects: rawInteract.collectedCount || rawInteract.collects || 0,
    shares: rawInteract.shareCount || rawInteract.shares || 0,
  };

  /* 正文内容：优先从 detail.note.desc 取，再逐层降级 */
  const content = noteData.desc || noteData.content
    || detail.desc || detail.content || detail.noteContent
    || displayNote.desc || '';

  /* 图片列表：优先从 detail.note 提取 */
  const images = extractImages(noteData) || extractImages(detail);

  /* 评论列表 */
  const comments = displayNote.comments || [];

  /* 标签 */
  const tags = noteData.tagList?.map(t => t.name || t)
    || displayNote.tags || detail.tagList?.map(t => t.name || t) || [];

  /* 笔记链接 */
  const noteUrl = displayNote.noteUrl || noteData.noteUrl || detail.noteUrl || '';

  return (
    <Drawer
      title={
        <Space>
          <Text strong style={{ fontSize: 16 }}>笔记详情</Text>
          {detailLoading && <Spin indicator={<LoadingOutlined />} size="small" />}
        </Space>
      }
      open={open}
      onClose={onClose}
      width={720}
      styles={{ body: { padding: 0, overflowX: 'hidden' } }}
    >
      {/* 封面大图 */}
      {displayNote.cover && (
        <div style={{ width: '100%', background: '#f5f5f5', position: 'relative' }}>
          <img
            src={displayNote.cover}
            alt={displayNote.title}
            style={{ width: '100%', maxHeight: 400, objectFit: 'contain', display: 'block', margin: '0 auto' }}
            onError={(e) => { e.target.style.display = 'none'; }}
          />
          {displayNote.type === 'video' && (
            <Tag
              color="#000000aa"
              style={{ position: 'absolute', top: 12, right: 12, border: 0 }}
            >
              <PlayCircleOutlined /> 视频
            </Tag>
          )}
        </div>
      )}

      <div style={{ padding: '20px 24px 32px' }}>
        {/* 标题 */}
        <Title level={4} style={{ marginBottom: 12, lineHeight: 1.4 }}>
          {displayNote.title || '无标题'}
        </Title>

        {/* 作者 + 时间 */}
        <Space style={{ marginBottom: 16 }}>
          <Avatar
            size={36}
            src={author.avatar}
            icon={<UserOutlined />}
            style={{ background: '#ff2442' }}
          />
          <div>
            <Text strong>{author.nickname || author.nickName || '匿名用户'}</Text>
            {displayNote.publishTime && (
              <div>
                <CalendarOutlined style={{ fontSize: 11, color: '#999', marginRight: 4 }} />
                <Text type="secondary" style={{ fontSize: 12 }}>{displayNote.publishTime}</Text>
              </div>
            )}
          </div>
        </Space>

        {/* 互动数据 */}
        <div style={{
          display: 'flex', gap: 20, padding: '10px 16px',
          background: '#fafafa', borderRadius: 8, marginBottom: 20, flexWrap: 'wrap',
        }}>
          {[
            { icon: <LikeOutlined />, color: '#ff2442', label: '赞', val: interactions.likes },
            { icon: <MessageOutlined />, color: '#faad14', label: '评论', val: interactions.comments },
            { icon: <StarOutlined />, color: '#1890ff', label: '收藏', val: interactions.collects },
            { icon: <ShareAltOutlined />, color: '#52c41a', label: '分享', val: interactions.shares },
          ].map((item, i) => (
            <Space key={i} size={4}>
              <span style={{ color: item.color }}>{item.icon}</span>
              <Text>{item.val || 0} {item.label}</Text>
            </Space>
          ))}
        </div>

        {/* ===== 正文内容 ===== */}
        <Divider orientation="left" style={{ fontWeight: 600 }}>正文内容</Divider>

        {detailLoading && !content && (
          <div style={{ textAlign: 'center', padding: 32 }}>
            <Spin tip="正在加载笔记全文..." />
          </div>
        )}

        {detailError && !content && (
          <Alert
            type="warning"
            showIcon
            message="无法加载笔记全文"
            description={`${detailError}。显示的是搜索摘要信息。`}
            style={{ marginBottom: 12 }}
          />
        )}

        {content ? (
          <Paragraph
            style={{
              whiteSpace: 'pre-wrap',
              lineHeight: 1.9,
              fontSize: 15,
              color: '#333',
              background: '#fafafa',
              padding: 16,
              borderRadius: 8,
            }}
          >
            {content}
          </Paragraph>
        ) : (
          !detailLoading && !detailError && (
            <Text type="secondary">此笔记暂无文字正文内容</Text>
          )
        )}

        {/* ===== 图片 ===== */}
        {images.length > 0 && (
          <>
            <Divider orientation="left">
              <Space><PictureOutlined /> 图片 ({images.length})</Space>
            </Divider>
            <Image.PreviewGroup>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {images.map((url, idx) => (
                  <Image
                    key={idx}
                    src={url}
                    width={160}
                    height={160}
                    style={{ objectFit: 'cover', borderRadius: 8 }}
                    fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN88P/BfwAJhAPk2K3yxwAAAABJRU5ErkJggg=="
                  />
                ))}
              </div>
            </Image.PreviewGroup>
          </>
        )}

        {/* ===== 标签 ===== */}
        {tags.length > 0 && (
          <>
            <Divider orientation="left">标签</Divider>
            <Space wrap>
              {tags.map((tag, i) => (
                <Tag key={i} color="processing">
                  {typeof tag === 'string' ? tag : tag.name}
                </Tag>
              ))}
            </Space>
          </>
        )}

        {/* ===== 评论 ===== */}
        <Divider orientation="left">评论 ({comments.length})</Divider>
        {comments.length > 0 ? (
          <List
            dataSource={comments.slice(0, 50)}
            renderItem={(comment, idx) => {
              const cUser = comment.userInfo || comment.user || {};
              const cContent = comment.content || comment.text || comment.comment || '';
              const cNickname = cUser.nickname || cUser.nickName || cUser.nick_name || '匿名';
              const cLikes = comment.likeCount || comment.like_count || 0;
              const isSub = comment.isSubComment;
              const replyTo = comment.targetComment?.userInfo?.nickname;
              return (
                <List.Item key={idx} style={isSub ? { paddingLeft: 36, background: '#fafafa' } : {}}>
                  <List.Item.Meta
                    avatar={<Avatar size="small" icon={<UserOutlined />} src={cUser.avatar || cUser.image} />}
                    title={
                      <Space size={4}>
                        <Text style={{ fontSize: 13 }}>{cNickname}</Text>
                        {isSub && replyTo && (
                          <Text type="secondary" style={{ fontSize: 12 }}>回复 {replyTo}</Text>
                        )}
                        {comment.ipLocation && (
                          <Tag style={{ fontSize: 11 }}>{comment.ipLocation}</Tag>
                        )}
                        {Number(cLikes) > 0 && (
                          <Text type="secondary" style={{ fontSize: 11 }}>
                            <LikeOutlined /> {cLikes}
                          </Text>
                        )}
                      </Space>
                    }
                    description={
                      <Text style={{ fontSize: 13, lineHeight: 1.6 }}>{cContent}</Text>
                    }
                  />
                </List.Item>
              );
            }}
          />
        ) : (
          <Text type="secondary">
            {detailLoading ? '评论加载中...' : '暂无评论数据'}
          </Text>
        )}

        {/* ===== AI 智能分析 ===== */}
        <Divider orientation="left" style={{ fontWeight: 600 }}>
          <Space><RobotOutlined style={{ color: '#722ed1' }} /> AI 智能分析</Space>
        </Divider>
        <AiAnalysisPanel notes={fullNote ? [fullNote] : [note]} />

        {/* 原文链接 */}
        {noteUrl && (
          <>
            <Divider />
            <Button type="link" icon={<LinkOutlined />} href={noteUrl} target="_blank" style={{ padding: 0 }}>
              在小红书中打开此笔记
            </Button>
          </>
        )}
      </div>
    </Drawer>
  );
}

/**
 * 从详情对象中提取图片 URL 列表
 * 兼容 algovate/xhs-mcp 返回的多种嵌套结构
 */
function extractImages(detail) {
  if (!detail) return [];

  const candidates = [
    detail.imageList,
    detail.image_list,
    detail.images,
    detail.note?.imageList,
    detail.note?.image_list,
  ];

  for (const list of candidates) {
    if (Array.isArray(list) && list.length > 0) {
      return list.map(img => {
        if (typeof img === 'string') return img;
        return img.urlDefault || img.url_default || img.url
          || img.infoList?.[0]?.url || img.info_list?.[0]?.url || '';
      }).filter(Boolean);
    }
  }

  return [];
}

/**
 * 从详情对象中提取评论列表
 * MCP 返回的评论结构为 { comments: { list: [...] } }，
 * 每条评论可能包含 subComments 子评论数组，需要展平到同一层级。
 */
function extractComments(detail) {
  if (!detail) return [];

  const candidates = [
    detail.comments?.list,
    detail.comments,
    detail.comment_list,
    detail.commentList,
    detail.commentData?.comments,
    detail.note?.comments?.list,
    detail.note?.comments,
  ];

  let rawList = [];
  for (const list of candidates) {
    if (Array.isArray(list) && list.length > 0) {
      rawList = list;
      break;
    }
  }

  if (rawList.length === 0) return [];

  /* 展平：主评论 + 子评论合并到同一列表，子评论标记 isSubComment */
  const flat = [];
  for (const item of rawList) {
    flat.push(item);
    if (Array.isArray(item.subComments)) {
      for (const sub of item.subComments) {
        flat.push({ ...sub, isSubComment: true });
      }
    }
  }
  return flat;
}

export default NoteDetailDrawer;
