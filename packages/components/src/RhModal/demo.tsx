import { ProFormText } from '@ant-design/pro-form';
import { message } from 'antd';
import React, { useRef } from 'react';
import type { ModalPropType } from '.';
import RhModal from '.';

function Demo() {
  const rhModalRef = useRef<any>();

  const ModalProps: ModalPropType = {
    text: '新建',
    // asyncInitialValues: currentRow,
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
      <RhModal ref={rhModalRef} {...ModalProps} title="新建">
        <ProFormText name="name" label="名称" />
        <ProFormText name="age" label="年龄" />
      </RhModal>
    </div>
  );
}

export default Demo;
