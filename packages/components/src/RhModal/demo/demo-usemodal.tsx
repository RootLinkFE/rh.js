import { ProFormText } from '@ant-design/pro-form';
import { Button, message } from 'antd';
import { useModal } from '@roothub/components';
import React from 'react';

function Demo() {
  const { RhModal, modal } = useModal();

  return (
    <div>
      <Button
        type="primary"
        onClick={() => {
          modal.show();
        }}
      >
        modal.show()
      </Button>
      <RhModal
        title="useModal"
        trigger={undefined}
        onFinish={async (values: any) => {
          console.log(values);
          return await new Promise((resolve) => {
            setTimeout(() => {
              message.success('创建成功');
              resolve(true);
            }, 1000);
          });
        }}
      >
        <ProFormText name="name" label="名称" />
        <ProFormText name="age" label="年龄" />
      </RhModal>
    </div>
  );
}

export default Demo;
