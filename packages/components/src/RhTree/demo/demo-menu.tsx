import { RhTree } from '@roothub/components';
import React, { useMemo, useCallback } from 'react';
import { Menu, message } from 'antd';

const Demo = () => {
  const dataList = [
    {
      id: 1,
      name: '挖掘机',
      parentId: null,
      type: 'CHANNEL',
      icon: 'rh-icon-node-channel',
    },
    {
      id: 2,
      name: '油缸',
      parentId: 1,
      type: 'CHANNEL',
      icon: 'rh-icon-node-channel',
    },
    {
      id: 8,
      name: '泵机',
      parentId: null,
      type: 'CHANNEL',
      icon: 'rh-icon-node-channel',
    },
    {
      id: 9,
      name: 'Node',
      parentId: 8,
      type: 'DEVICE',
      icon: 'rh-icon-node-device',
    },
    {
      id: 10,
      name: 'aaa属性',
      parentId: 8,
      type: 'DEVICE',
      icon: 'rh-icon-node-device',
    },
    {
      id: 11,
      name: 'xxx属性',
      parentId: 8,
      type: 'DEVICE',
      icon: 'rh-icon-node-device',
    },
  ];

  const channelMenu = useMemo(() => {
    const menuData = [
      <Menu.Item key="addDevice">添加设备</Menu.Item>,
      <Menu.Item key="editChannel">编辑通道</Menu.Item>,
      <Menu.Item key="deleteChannel">删除通道</Menu.Item>,
    ];

    return menuData;
  }, []);

  const deviceMenu = useMemo(() => {
    return [
      <Menu.Item key="editDevice">编辑设备</Menu.Item>,
      <Menu.Item key="deleteDevice">删除设备</Menu.Item>,
    ];
  }, []);

  const onMenuClick = useCallback((key) => {
    message.info(key);
  }, []);

  return (
    <div style={{ width: 300 }}>
      <RhTree
        search={false}
        editable={true}
        showIcon
        height={300}
        list={dataList as any}
        menuProps={{
          types: {
            default: channelMenu,
            CHANNEL: channelMenu,
            DEVICE: deviceMenu,
          },
          onClick: (item: any, e: any) => {
            onMenuClick(e.key);
          },
        }}
      />
    </div>
  );
};
export default Demo;
