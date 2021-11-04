import RhDrawer from '.';
import { useRef } from 'react';
import type { RhDrawerProps } from '.';
import { message } from 'antd';
import { ProFormText } from '@ant-design/pro-form';

function Demo() {
  // const [currentRow, setCurrentRow] = useState();

  const rhDrawerRef = useRef<any>();

  const DrawerProps: RhDrawerProps = {
    text: '新建自定义参数',
    title: '创建自定义参数',
    // initialValues: currentRow,
    onFinish: async (values) => {
      console.log(values);
      await new Promise((resolve) => {
        setTimeout(() => {
          resolve({});
        }, 1000);
      });
      message.success('创建成功');
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
