import { RhTree } from '@roothub/components';
import { CaretDownOutlined } from '@ant-design/icons';
import React from 'react';

const Demo = () => {
  const dataList = [
    {
      id: 1,
      name: '挖掘机',
      parentId: null,
      type: 'model',
      icon: 'rh-icon-node-channel',
    },
    {
      id: 2,
      name: '油缸',
      parentId: 1,
      type: 'model',
      icon: 'rh-icon-node-channel',
    },
    {
      id: 8,
      name: '泵机',
      parentId: null,
      type: 'model',
      icon: 'rh-icon-node-channel',
    },
    {
      id: 9,
      name: 'Node',
      parentId: 8,
      type: 'node',
      icon: 'rh-icon-node-device',
    },
    {
      id: 10,
      name: 'aaa属性',
      parentId: 8,
      type: 'attribute',
      icon: 'rh-icon-node-device',
    },
    {
      id: 11,
      name: 'xxx属性',
      parentId: 8,
      type: 'attribute',
      icon: 'rh-icon-node-device',
    },
  ];

  return (
    <div className="flex">
      <RhTree
        search={false}
        editable={false}
        showIcon
        height={300}
        list={dataList as any}
      />
    </div>
  );
};
export default Demo;
