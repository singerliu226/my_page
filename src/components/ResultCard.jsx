/**
 * @fileoverview 笔记结果卡片组件
 * 展示单条搜索结果，包含封面图、标题、作者、互动数据。
 * 支持勾选以加入采集队列。
 */

import React from 'react';
import { Card, Typography, Space, Tag, Checkbox, Tooltip } from 'antd';
import {
  LikeOutlined,
  MessageOutlined,
  StarOutlined,
  PlayCircleOutlined,
  UserOutlined,
} from '@ant-design/icons';

const { Text, Paragraph } = Typography;

/**
 * 格式化数字
 * @param {number} num
 * @returns {string}
 */
function formatNum(num) {
  if (!num) return '0';
  if (num >= 10000) return `${(num / 10000).toFixed(1)}w`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
  return String(num);
}

/**
 * 笔记结果卡片
 * 
 * @param {Object} props
 * @param {Object} props.note - 笔记数据
 * @param {boolean} props.selected - 是否被选中
 * @param {Function} props.onSelect - 选中/取消回调
 * @param {Function} [props.onClick] - 点击卡片查看详情回调
 */
function ResultCard({ note, selected, onSelect, onClick }) {
  return (
    <Card
      hoverable
      size="small"
      onClick={() => onClick && onClick(note)}
      style={{
        borderRadius: 10,
        overflow: 'hidden',
        border: selected ? '2px solid #ff2442' : '1px solid #f0f0f0',
        transition: 'all 0.2s',
        cursor: 'pointer',
      }}
      cover={
        note.cover ? (
          <div style={{ position: 'relative', paddingTop: '75%', background: '#f5f5f5' }}>
            <img
              src={note.cover}
              alt={note.title}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
            {note.type === 'video' && (
              <PlayCircleOutlined
                style={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  fontSize: 22,
                  color: '#fff',
                  background: 'rgba(0,0,0,0.4)',
                  borderRadius: '50%',
                  padding: 2,
                }}
              />
            )}
            <Checkbox
              checked={selected}
              onChange={(e) => onSelect(e.target.checked)}
              onClick={(e) => e.stopPropagation()}
              style={{ position: 'absolute', top: 8, left: 8 }}
            />
          </div>
        ) : (
          <div
            style={{
              height: 120,
              background: 'linear-gradient(135deg, #ff244220, #ff244210)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
            }}
          >
            <Text type="secondary">暂无封面</Text>
            <Checkbox
              checked={selected}
              onChange={(e) => onSelect(e.target.checked)}
              onClick={(e) => e.stopPropagation()}
              style={{ position: 'absolute', top: 8, left: 8 }}
            />
          </div>
        )
      }
    >
      <Paragraph
        ellipsis={{ rows: 2 }}
        style={{ fontWeight: 600, fontSize: 14, marginBottom: 8 }}
      >
        {note.title || '无标题'}
      </Paragraph>

      <Space size={4} style={{ marginBottom: 8 }}>
        <UserOutlined style={{ fontSize: 12, color: '#999' }} />
        <Text type="secondary" style={{ fontSize: 12 }}>
          {note.author?.nickname || '匿名'}
        </Text>
      </Space>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Space size={12}>
          <Tooltip title="点赞">
            <Space size={2}>
              <LikeOutlined style={{ fontSize: 13, color: '#ff2442' }} />
              <Text style={{ fontSize: 12 }}>{formatNum(note.interactions?.likes)}</Text>
            </Space>
          </Tooltip>
          <Tooltip title="评论">
            <Space size={2}>
              <MessageOutlined style={{ fontSize: 13, color: '#faad14' }} />
              <Text style={{ fontSize: 12 }}>{formatNum(note.interactions?.comments)}</Text>
            </Space>
          </Tooltip>
          <Tooltip title="收藏">
            <Space size={2}>
              <StarOutlined style={{ fontSize: 13, color: '#1890ff' }} />
              <Text style={{ fontSize: 12 }}>{formatNum(note.interactions?.collects)}</Text>
            </Space>
          </Tooltip>
        </Space>
      </div>

      {note.tags && note.tags.length > 0 && (
        <div style={{ marginTop: 8 }}>
          {note.tags.slice(0, 3).map((tag, i) => (
            <Tag key={i} style={{ fontSize: 11, marginBottom: 2 }}>
              {typeof tag === 'string' ? tag : tag.name}
            </Tag>
          ))}
        </div>
      )}
    </Card>
  );
}

export default ResultCard;
