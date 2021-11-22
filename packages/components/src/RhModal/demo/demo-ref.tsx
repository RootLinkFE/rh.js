import { RhModal } from '@roothub/components';
import { useRef } from 'react';
import { message } from 'antd';
import { ProFormText } from '@ant-design/pro-form';
import React from 'react';

function Demo() {
  const rhModalRef = useRef<any>();

  const ModalProps: any = {
    text: '新建',
    // asyncInitialValues: currentRow,
    onFinish: async (values: any) => {
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
