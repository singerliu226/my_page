/**
 * @fileoverview 设置弹窗组件
 * 提供浏览器登录、状态检查等功能。
 * algovate/xhs-mcp 使用 Puppeteer 真实浏览器，需通过浏览器窗口登录。
 */

import React, { useState, useEffect } from 'react';
import { Modal, Button, Space, Alert, Typography, Divider, message, Spin, Steps } from 'antd';
import {
  CheckCircleOutlined,
  WarningOutlined,
  ChromeOutlined,
  LoginOutlined,
  SyncOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import api from '../hooks/useApi';

const { Text, Paragraph } = Typography;

/**
 * 设置弹窗
 * 
 * @param {Object} props
 * @param {boolean} props.open - 是否显示
 * @param {Function} props.onClose - 关闭回调
 */
function SettingsModal({ open, onClose }) {
  const [loginLoading, setLoginLoading] = useState(false);
  const [checkLoading, setCheckLoading] = useState(false);
  const [configInfo, setConfigInfo] = useState(null);
  const [configLoading, setConfigLoading] = useState(false);

  /** 打开时加载当前配置和登录状态 */
  useEffect(() => {
    if (open) {
      loadConfig();
    }
  }, [open]);

  /**
   * 加载配置（带超时保护）
   * 后端 checkStatus 可能需要较长时间（启动 Puppeteer），设置 15 秒超时
   */
  const loadConfig = async () => {
    setConfigLoading(true);
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const res = await fetch('/api/config', {
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          setConfigInfo(json.data);
        }
      }
    } catch (err) {
      if (err.name === 'AbortError') {
        message.warning('加载配置超时，请手动检查状态');
      }
      /* 其他错误静默处理 */
    } finally {
      setConfigLoading(false);
    }
  };

  /** 启动浏览器登录 */
  const handleLogin = async () => {
    setLoginLoading(true);
    message.info('正在打开 Chrome 浏览器，请在弹出的窗口中登录小红书...');
    try {
      await api.login();
      message.success('登录成功！');
      await loadConfig();
    } catch (err) {
      message.error('登录失败：' + (err.message || '请重试'));
    } finally {
      setLoginLoading(false);
    }
  };

  /** 检测登录状态 */
  const handleCheck = async () => {
    setCheckLoading(true);
    try {
      const result = await api.checkStatus();
      if (result && (result.logged_in || result.loggedIn)) {
        message.success('已登录，状态正常！');
      } else {
        message.warning('未登录或登录已过期，请重新登录');
      }
      await loadConfig();
    } catch (err) {
      message.error('状态检查失败：' + (err.message || '请检查服务'));
    } finally {
      setCheckLoading(false);
    }
  };

  const isLoggedIn = configInfo?.loggedIn;

  return (
    <Modal
      title="设置"
      open={open}
      onCancel={onClose}
      footer={null}
      width={560}
    >
      {configLoading ? (
        <div style={{ textAlign: 'center', padding: 40 }}>
          <Spin tip="加载配置中..." />
        </div>
      ) : (
        <>
          <Divider orientation="left">登录状态</Divider>

          {isLoggedIn ? (
            <Alert
              message="已登录小红书"
              description="登录状态正常，可以正常搜索和采集"
              type="success"
              icon={<CheckCircleOutlined />}
              showIcon
              style={{ marginBottom: 16 }}
            />
          ) : (
            <Alert
              message="未登录"
              description="请点击下方按钮，在弹出的 Chrome 窗口中登录小红书"
              type="warning"
              icon={<WarningOutlined />}
              showIcon
              style={{ marginBottom: 16 }}
            />
          )}

          <Divider orientation="left">登录操作</Divider>

          <Steps
            direction="vertical"
            size="small"
            current={isLoggedIn ? 2 : 0}
            items={[
              {
                title: '点击「打开浏览器登录」',
                description: '系统会自动打开 Chrome 浏览器',
              },
              {
                title: '在 Chrome 中完成登录',
                description: '使用手机扫码或验证码登录小红书',
              },
              {
                title: '登录完成',
                description: '浏览器自动关闭，即可开始搜索',
              },
            ]}
            style={{ marginBottom: 20 }}
          />

          <Space>
            <Button
              type="primary"
              size="large"
              icon={loginLoading ? <LoadingOutlined /> : <LoginOutlined />}
              loading={loginLoading}
              onClick={handleLogin}
            >
              {loginLoading ? '等待登录中（请在Chrome中操作）...' : '打开浏览器登录'}
            </Button>
            <Button
              icon={<SyncOutlined />}
              loading={checkLoading}
              onClick={handleCheck}
            >
              检查状态
            </Button>
          </Space>

          {isLoggedIn && (
            <Alert
              message="提示"
              description="如果搜索时出现错误或无结果，可能是登录状态已过期，请重新登录。"
              type="info"
              showIcon
              style={{ marginTop: 16, marginBottom: 16 }}
            />
          )}

          <Divider orientation="left" style={{ marginTop: 24 }}>关于</Divider>
          <Paragraph type="secondary" style={{ fontSize: 13, marginBottom: 0 }}>
            RedNote Collector v1.0.0 — 小红书内容采集与整理工具
            <br />
            使用 Puppeteer 真实浏览器操作，安全可靠，不会触发反爬机制。
          </Paragraph>
        </>
      )}
    </Modal>
  );
}

export default SettingsModal;
