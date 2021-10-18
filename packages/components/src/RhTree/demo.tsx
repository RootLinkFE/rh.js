/* eslint-disable  */
import React, { useState, Key } from 'react';
import RhTree from './index';
import { message, Input } from 'antd';
import { DownOutlined } from '@ant-design/icons';

/* import IconNode from '../../assets/images/tree/node.svg';
import IconModel from '../../assets/images/tree/model.svg';
import IconLeaf from '../../assets/images/tree/property.svg'; */

const Demo = () => {
  const [dataList, setDataList] = useState([
    {
      id: 1,
      name: '挖掘机',
      parentId: 0,
      type: 'model',
      icon: null,
    },
    {
      id: 2,
      name: '主臂',
      parentId: 1,
      type: 'node',
    },
    {
      id: 3,
      name: '变幅机构',
      parentId: 1,
      type: 'node',
    },
    {
      id: 4,
      name: '油缸',
      parentId: 2,
      type: 'node',
    },
    {
      id: 41,
      name: '角度',
      parentId: 2,
      type: 'attribute',
    },
    {
      id: 5,
      name: '变幅',
      parentId: 3,
      type: 'node',
    },
    {
      id: 8,
      name: '泵机',
      parentId: 0,
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
  ]);

  const handleEdit = (value: string, id: Key) => {
    const list = dataList.map((item) => ({
      ...item,
      name: id === item.id ? value : item.name,
    }));
    setDataList(list);
  };

  const handleCreate = (value: string, parentId: Key) => {
    const list = [
      ...dataList,
      {
        id: Math.floor(Math.random() * 6000000) + 1,
        name: value,
        parentId: Number(parentId),
      },
    ];
    setDataList(list as any);
  };

  const handleDelete = (id: Key) => {
    const list = deletedList(id);
    setDataList(list);
  };

  const deletedList = (parentId: Key) => {
    const list = JSON.parse(JSON.stringify(dataList));
    const arr = [parentId];
    for (let i = 0; i < list.length; i += 1) {
      const isLeafOrChild =
        arr.includes(list[i].id) || arr.includes(list[i].parentId);

      if (isLeafOrChild) {
        arr.push(list[i].id);
        list.splice(i, 1);
        i -= 1;
      }
    }
    return list;
  };
  return (
    <div style={{ display: 'flex' }}>
      <RhTree
        blockNode
        height={400}
        list={dataList as any}
        switcherIcon={<DownOutlined />}
        /*  iconRender={(nodeType?: string) => {
          if (nodeType === 'model') {
            return IconModel;
          } else if (nodeType === 'node') {
            return IconNode;
          } else {
            return IconLeaf;
          }
        }} */
        onEdit={(value, id) => {
          console.log('value, id: ', value, id);
          value && handleEdit(value, id);
          value
            ? message.success(`value:${value}, id:${id}`)
            : message.warn(`value为空`);
        }}
        onCreate={(value, parentId) => {
          console.log('value,parentId: ', value, parentId);
          value
            ? message.success(`value:${value}, parentId:${parentId}`)
            : message.warn(`value为空`);
          value && handleCreate(value, parentId);
        }}
        onDelete={(id) => {
          message.success(`成功删除节点${id}`);
          handleDelete(id);
        }}
      />
      <Input.TextArea
        rows={17}
        value={JSON.stringify(dataList, null, 4)}
        onChange={({ currentTarget }) => {
          try {
            setDataList(JSON.parse(currentTarget.value));
          } catch (error) {}
        }}
      />
    </div>
  );
};
export default Demo;
