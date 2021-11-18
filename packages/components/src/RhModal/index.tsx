import type { ModalFormProps } from '@ant-design/pro-form';
import { ModalForm } from '@ant-design/pro-form';
import type { FormInstance } from 'antd';
import { Button } from 'antd';
import type { ReactNode } from 'react';
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';

type RhModalRef = React.Ref<{
  formRef: React.MutableRefObject<FormInstance<any> | undefined>;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
}>;

export type ModalPropType = {
  /**
   * Modal的标题
   */
  text?: ReactNode;
  /**
   * 取消按钮Label
   */
  cancelText?: string;
  /**
   * 确认按钮Label
   * 如果 传 false，则隐藏
   */
  confirmText?: string | boolean;
  /**
   * 根据最新的 asyncInitialValues 实时更新 form 的数据
   */
  asyncInitialValues?: Record<string, any>;
  /**
   * 关闭回调
   */
  onClose?: () => any;
  /**
   * 提交数据时触发，内部校验了数据。
   */
  onFinish?: (e: any) => Promise<boolean>;
};

export type RhModalProps = Omit<ModalFormProps, 'onFinish'> & ModalPropType;

function RhModal(
  {
    text,
    children = '',
    layout = 'vertical',
    width = 480,
    initialValues,
    asyncInitialValues,
    cancelText = '取消',
    confirmText = '确认',
    onFinish = () => Promise.resolve(false),
    onClose = () => {},
    ...restProps
  }: RhModalProps,
  ref: RhModalRef,
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
    if (asyncInitialValues) {
      formRef.current?.setFieldsValue(asyncInitialValues);
    }
  }, [asyncInitialValues]);

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
      <div style={{ display: 'inline-block', cursor: 'pointer' }} onClick={open}>
        {text}
      </div>
    );

  // eslint-disable-next-line no-param-reassign
  restProps.modalProps = {
    ...restProps.modalProps,
    destroyOnClose: !asyncInitialValues,
    maskClosable: false,
    onCancel: () => {
      setVisible(false);
      formRef.current?.resetFields();
      onClose();
    },
    afterClose: () => {
      setVisible(false);
      formRef.current?.resetFields();
      onClose();
    },
  };
  const modalFormProps: ModalFormProps = {
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
            onClose();
            formRef.current?.resetFields();
          }}
        >
          {cancelText}
        </Button>,
        confirmText ? (
          <Button
            key="save"
            type="primary"
            onClick={async () => {
              formRef.current?.submit();
            }}
            loading={loading}
          >
            {confirmText}
          </Button>
        ) : (
          ''
        ),
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
      <ModalForm
        {...modalFormProps}
        initialValues={!asyncInitialValues ? initialValues : {}}
        preserve={!!asyncInitialValues}
        onVisibleChange={(v) => {
          if (!v) {
            formRef.current?.resetFields();
            onClose();
          }
        }}
      >
        {children}
      </ModalForm>
    </div>
  );
}

export default forwardRef(RhModal);
