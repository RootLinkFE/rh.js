import {
  DesktopOutlined,
  PieChartOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Layout } from 'antd';
import React from 'react';
import { useState } from 'react';
import RhSidebar from '.';
import type { RhMenuData } from './type';

const { Content, Header, Sider } = Layout;

const MENUS = {
  menuHeaderTitle: 'RhSidebar',
  menuHeaderTitleIcon: 'rh-icon-icon_yingyongguanli',
  menuItems: [
    {
      key: 'chart',
      name: 'Option1',
      icon: <PieChartOutlined />,
      url: '/components/rh-sidebar',
    },
    {
      key: 'desktop',
      name: 'Option2',
      icon: <DesktopOutlined />,
      url: '/components/rh-sidebar',
    },
    {
      key: 'user',
      name: 'User',
      icon: <UserOutlined />,
      url: '/components/rh-sidebar',
      children: [
        {
          key: 'tom',
          name: 'Tom',
          url: '/components/rh-sidebar',
        },
        {
          key: 'Alex',
          name: 'Alex',
          url: '/components/rh-sidebar',
          isExternal: true,
        },
      ],
    },
    {
      key: 'changjingguanli',
      icon: 'rh-icon-changjingguanli',
      name: '场景管理',
      url: '/components/rh-sidebar',
      isExternal: true,
      externalIcon: 'rh-icon-iconShare',
    },
  ],
};
function RhSidebarDemo() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout
      className="main"
      style={{ minHeight: '60vh', border: '1px solid rgba(0,0,0,0.1)' }}
    >
      <Header style={{ height: 56 }} />
      <Layout hasSider style={{ position: 'relative' }}>
        <Sider
          width={224}
          style={{
            overflow: 'auto',
            height: '100%',
            position: 'absolute', // 项目中，这里写 fixed，demo的原因这里写了绝对定位
            left: 0,
            boxShadow: '2px 0px 2px rgba(0,0,0,0.1)',
            background: '#fff',
          }}
        >
          <RhSidebar
            menuOptions={{
              mode: 'inline',
              defaultOpenKeys: [],
              style: { borderRight: 0 },
            }}
            menuData={MENUS as RhMenuData}
            collapsible={collapsed}
            pathName={'/'}
          />
        </Sider>
        <Content />
      </Layout>
    </Layout>
  );
}

export default RhSidebarDemo;
