import RhDrawer from '.';
import React, { useRef } from 'react';
import type { RhDrawerProps } from '.';
import { message } from 'antd';
import { ProFormText } from '@ant-design/pro-form';

function Demo() {
  const rhDrawerRef = useRef<any>();

  const DrawerProps: RhDrawerProps = {
    text: '新建自定义参数',
    title: '创建自定义参数',
    onFinish: async (values) => {
      console.log(values);
      return await new Promise((resolve) => {
        setTimeout(() => {
          message.success('创建成功');
          resolve(true);
        }, 1000);
      });
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
