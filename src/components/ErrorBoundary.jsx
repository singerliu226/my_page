/**
 * @fileoverview 全局错误边界组件
 * 捕获子组件树中的 JavaScript 错误，防止整个页面白屏崩溃，
 * 并展示友好的错误提示和重试按钮。
 */

import React from 'react';
import { Result, Button, Typography } from 'antd';

const { Paragraph, Text } = Typography;

/**
 * 错误边界
 * React Error Boundary 必须使用 class 组件实现。
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    /* eslint-disable-next-line no-console */
    console.error('[ErrorBoundary] 捕获到错误:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 48, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Result
            status="error"
            title="页面出现了问题"
            subTitle="抱歉，发生了意外错误。请尝试刷新页面或点击重试。"
            extra={[
              <Button key="retry" type="primary" onClick={this.handleReset}>
                重试
              </Button>,
              <Button key="reload" onClick={this.handleReload}>
                刷新页面
              </Button>,
            ]}
          >
            {this.state.error && (
              <Paragraph>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  错误详情：{this.state.error.toString()}
                </Text>
              </Paragraph>
            )}
          </Result>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
