import RhTree from '../index';
import { RhSearchInput } from '@roothub/components';
import { CaretDownOutlined } from '@ant-design/icons';
import React, { useMemo, useState } from 'react';
import { searchByNodeName } from '../utils';

const dataList = [
  {
    id: 1,
    name: '挖掘机',
    parentId: null,
    type: 'model',
  },
  {
    id: 2,
    name: '油缸',
    parentId: 1,
    type: 'model',
  },
  {
    id: 8,
    name: '泵机',
    parentId: null,
    type: 'model',
  },
  {
    id: 9,
    name: 'Node',
    parentId: 8,
    type: 'node',
  },
  {
    id: 10,
    name: 'aaa属性',
    parentId: 8,
    type: 'attribute',
  },
  {
    id: 11,
    name: 'xxx属性',
    parentId: 8,
    type: 'attribute',
  },
];

const Demo = () => {
  const [treeSearchKey, setTreeSearchKey] = useState<string>('');

  // 含前端搜索过滤
  const treeData = useMemo(() => {
    return searchByNodeName(dataList, treeSearchKey);
  }, [treeSearchKey]);

  return (
    <div style={{ width: '300px' }}>
      <div style={{ margin: '10px 8px' }}>
        <RhSearchInput
          bordered={false}
          placeholder="请输入关键字"
          size="large"
          onSearch={(v: string) => {
            setTreeSearchKey(v);
          }}
          onChange={(v: string) => {
            setTreeSearchKey(v);
          }}
        />
      </div>
      <RhTree
        showIcon
        search={false}
        editable={false}
        highlightText={treeSearchKey}
        showLine={{ showLeafIcon: false }}
        switcherIcon={<CaretDownOutlined />}
        height={300}
        list={treeData as any}
      />
    </div>
  );
};
export default Demo;
