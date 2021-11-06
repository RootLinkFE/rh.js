import type { DrawerFormProps } from '@ant-design/pro-form';
import { DrawerForm } from '@ant-design/pro-form';
import type { FormInstance } from 'antd';
import { Button } from 'antd';
import type { ReactNode } from 'react';
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';

type RhDrawRef = React.Ref<{
  formRef: React.MutableRefObject<FormInstance<any> | undefined>;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
}>;

export type DrawerPropType = {
  /**
   * 抽屉的标题
   */
  text?: ReactNode;
  /**
   * 关闭回调
   */
  onCloseCallback?: (e: any) => any;
  /**
   * 提交数据时触发，内部校验了数据。
   */
  onFinish?: (e: any) => Promise<boolean>;
};

export type RhDrawerProps = Omit<DrawerFormProps, 'onFinish'> & DrawerPropType;

function RhDrawer(
  {
    text,
    children = '',
    layout = 'vertical',
    width = 480,
    initialValues,
    onFinish = () => Promise.resolve(false),
    onCloseCallback = () => {},
    ...restProps
  }: RhDrawerProps,
  ref: RhDrawRef,
) {
  const [visible, setVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const formRef = useRef<FormInstance>();

  useImperativeHandle(ref, () => {
    return {
      formRef,
      setVisible,
    };
  });

  useEffect(() => {
    if (initialValues) {
      formRef.current?.setFieldsValue(initialValues);
    }
  }, [initialValues]);

  const open = () => {
    formRef.current?.resetFields(); // 保证每次都能清空
    setVisible(true);
  };

  const trigger: JSX.Element =
    text && typeof text === 'string' ? (
      <Button type="primary" ghost onClick={open}>
        {text}
      </Button>
    ) : (
      <div
        style={{ display: 'inline-block', cursor: 'pointer' }}
        onClick={open}
      >
        {text}
      </div>
    );

  // eslint-disable-next-line no-param-reassign
  restProps.drawerProps = {
    ...restProps.drawerProps,
    maskClosable: false,
    onClose: (e) => {
      setVisible(false);
      formRef.current?.resetFields();
      onCloseCallback(e);
    },
  };
  const drawerFormProps: DrawerFormProps = {
    formRef,
    visible,
    layout,
    width,
    labelCol: { span: 6 },
    trigger,
    submitter: {
      render: () => [
        <Button
          key="close"
          onClick={() => {
            setVisible(false);
            onCloseCallback(false);
            formRef.current?.resetFields();
          }}
        >
          取消
        </Button>,
        <Button
          key="save"
          type="primary"
          onClick={async () => {
            formRef.current?.submit();
          }}
          loading={loading}
        >
          确定
        </Button>,
      ],
    },
    onFinish: async () => {
      const values = await formRef.current?.validateFields();
      setLoading(true);
      try {
        const canClose = await onFinish(values);
        // 操作成功才会清除
        if (canClose) {
          formRef.current?.resetFields();
          setVisible(false);
        }
        setLoading(false);
      } catch {
        // formRef.current?.resetFields();
        setLoading(false);
      }
    },
    ...restProps,
  };

  return (
    <div>
      <DrawerForm
        {...drawerFormProps}
        onVisibleChange={(v) => {
          if (!v) {
            formRef.current?.resetFields();
            onCloseCallback(v);
          }
        }}
      >
        {children}
      </DrawerForm>
    </div>
  );
}

export default forwardRef(RhDrawer);
