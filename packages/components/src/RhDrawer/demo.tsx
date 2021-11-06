import RhDrawer from '.';
import { useRef } from 'react';
import type { RhDrawerProps } from '.';
import { message } from 'antd';
import { ProFormText } from '@ant-design/pro-form';
import React from 'react';

function Demo() {
  const rhDrawerRef = useRef<any>();

  const DrawerProps: RhDrawerProps = {
    text: '新建自定义参数',
    title: '创建自定义参数',
    onFinish: async (values) => {
      console.log(values);
      message.success('创建成功');
      return Promise.resolve(true);
    },
  };
  return (
    <div>
      <RhDrawer ref={rhDrawerRef} {...DrawerProps}>
        <ProFormText name="name" label="名称" />
        <ProFormText name="age" label="年龄" />
      </RhDrawer>
    </div>
  );
}

export default Demo;
