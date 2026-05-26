/**
 * @fileoverview 数据统计栏组件
 * 以卡片形式展示数据集的关键统计指标。
 */

import React from 'react';
import { Row, Col, Card, Statistic } from 'antd';
import {
  FileTextOutlined,
  LikeOutlined,
  MessageOutlined,
  StarOutlined,
} from '@ant-design/icons';

/**
 * 数据统计栏
 * 
 * @param {Object} props
 * @param {Object} props.stats - 统计数据
 */
function StatsBar({ stats }) {
  if (!stats) return null;

  const items = [
    { title: '笔记总数', value: stats.noteCount, icon: <FileTextOutlined />, color: '#ff2442' },
    { title: '总点赞', value: stats.totalLikes, icon: <LikeOutlined />, color: '#ff2442' },
    { title: '总评论', value: stats.totalComments, icon: <MessageOutlined />, color: '#faad14' },
    { title: '总收藏', value: stats.totalCollects, icon: <StarOutlined />, color: '#1890ff' },
  ];

  return (
    <Row gutter={16} style={{ marginBottom: 16 }}>
      {items.map((item, i) => (
        <Col key={i} xs={12} sm={6}>
          <Card size="small" style={{ borderRadius: 10 }}>
            <Statistic
              title={item.title}
              value={item.value || 0}
              prefix={React.cloneElement(item.icon, { style: { color: item.color } })}
              valueStyle={{ fontSize: 20 }}
            />
          </Card>
        </Col>
      ))}
    </Row>
  );
}

export default StatsBar;
