import React, { useState } from 'react';
import { Layout, Menu, Typography, Space, Tag } from 'antd';
import { Link, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import {
  SearchOutlined,
  DatabaseOutlined,
  ExportOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import SearchPage from '../SearchPage';
import CollectionPage from '../CollectionPage';
import ExportPage from '../ExportPage';
import SettingsModal from '../../components/SettingsModal';
import usePageMetadata from '../../hooks/usePageMetadata';

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

/**
 * @fileoverview 旧版工具工作区。
 * 将原有 RedNote Collector 独立为作品子路由，既保留已有功能，
 * 也让对外访问时优先展示个人品牌页。
 */

/** 工具区菜单项 */
const collectorMenuItems = [
  { key: '/projects/rednote', icon: <SearchOutlined />, label: '搜索采集' },
  { key: '/projects/rednote/collections', icon: <DatabaseOutlined />, label: '数据管理' },
  { key: '/projects/rednote/export', icon: <ExportOutlined />, label: '导出中心' },
];

/**
 * Collector 工作区。
 *
 * @returns {JSX.Element}
 */
function CollectorWorkspace() {
  const navigate = useNavigate();
  const location = useLocation();
  const [settingsOpen, setSettingsOpen] = useState(false);

  usePageMetadata({
    title: 'RedNote Collector | 小红书内容采集工具',
    description: 'RedNote Collector：一个用于搜索、采集、整理和导出小红书笔记数据的全栈作品项目。',
  });

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header
        style={{
          background: '#ff2442',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        }}
      >
        <Space size={12}>
          <span style={{ fontSize: 24 }}>📕</span>
          <div>
            <Title level={4} style={{ color: '#fff', margin: 0, lineHeight: 1.2 }}>
              RedNote Collector
            </Title>
            <Text style={{ color: 'rgba(255,255,255,0.86)' }}>
              当前仓库中的作品项目，已迁移为个人站的子路由展示
            </Text>
          </div>
          <Tag color="white" style={{ color: '#ff2442', marginLeft: 8 }}>
            小红书采集工具
          </Tag>
        </Space>

        <Space size={16}>
          <Link style={{ color: '#fff', fontSize: 14 }} to="/">
            返回个人站
          </Link>
          <SettingOutlined
            style={{ color: '#fff', fontSize: 20, cursor: 'pointer' }}
            onClick={() => setSettingsOpen(true)}
          />
        </Space>
      </Header>

      <Layout>
        <Sider
          width={200}
          style={{ background: '#fff' }}
          breakpoint="lg"
          collapsedWidth={80}
        >
          <Menu
            mode="inline"
            selectedKeys={[location.pathname]}
            items={collectorMenuItems}
            style={{ height: '100%', borderRight: 0, paddingTop: 16 }}
            onClick={({ key }) => navigate(key)}
          />
        </Sider>

        <Content style={{ padding: 24, minHeight: 280 }}>
          <Routes>
            <Route index element={<SearchPage />} />
            <Route path="collections" element={<CollectionPage />} />
            <Route path="export" element={<ExportPage />} />
            <Route path="*" element={<Navigate to="/projects/rednote" replace />} />
          </Routes>
        </Content>
      </Layout>

      <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </Layout>
  );
}

export default CollectorWorkspace;
