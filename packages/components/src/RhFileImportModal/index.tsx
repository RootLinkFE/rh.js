/*
 * @Author: mingxing.zhong
 * @Date: 2021-10-02 14:23:33
 * @Description: 文件导入弹窗
 */

import { ModalForm, ProFormUploadButton } from '@ant-design/pro-form';
import { Form } from 'antd';
import React from 'react';

export type ImportModalProps = {
  /**
   * 是否显示弹窗
   * @type boolean
   */
  visible?: boolean;
  /**
   * 弹窗title
   * @type string
   */
  title?: string;
  /**
   * 弹窗宽度
   * @type number
   * @default 600
   */
  width?: number;
  /**
   * 模板下载地址
   * @type string
   */
  downloadUrl?: string;
  /**
   * 取消关闭弹窗回调
   * @type  () => void;
   */
  onCancel?: () => void;
  /**
   * 确认弹窗按钮回调
   * @type  () => void;
   */
  onOk?: () => void;
  /**
   * 完成表单校验，回调方法
   * @type  (formData: any) => Promise<boolean | void>;
   */
  onFinish?: (formData: any) => Promise<boolean | void>;
};

const RhFileImportModal: React.FC<ImportModalProps> = ({
  visible = false,
  title = '弹窗',
  width = 600,
  downloadUrl = '',
  onCancel = () => {},
  onOk = () => {},
  onFinish = () => Promise.resolve(),
}) => {
  return (
    <ModalForm
      title={title}
      visible={visible}
      width={width}
      modalProps={{
        maskClosable: false,
        onCancel,
        onOk,
      }}
      onFinish={onFinish}
    >
      <Form.Item>
        <a href={downloadUrl} target="_blank" rel="noopener noreferrer">
          点击下载模板
        </a>
      </Form.Item>
      <ProFormUploadButton
        accept=".xlsx,.xls"
        label=""
        name="file"
        title="上传文件"
        max={1}
        rules={[{ required: true, message: '请选择文件' }]}
        fieldProps={{
          beforeUpload: () => false,
        }}
      />
      <p className="ant-form-item-extra">
        请按照模板格式进行录入，支持xlsx格式
      </p>
    </ModalForm>
  );
};

export default RhFileImportModal;
