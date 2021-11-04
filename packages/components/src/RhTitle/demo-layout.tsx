import ProForm, {
  ProFormSelect,
  ProFormText,
  ProFormUploadButton,
} from '@ant-design/pro-form';
import React from 'react';
import RhTitle from '.';

function Demo() {
  return (
    <ProForm layout="vertical" submitter={false}>
      <RhTitle title="基础信息" layout={'column'}>
        <>
          <ProFormSelect
            name="dataBit"
            label="数据位"
            options={[
              {
                value: '6',
                label: '6',
              },
              {
                value: '7',
                label: '7',
              },
              {
                value: '8',
                label: '8',
              },
            ]}
            width="xl"
            rules={[{ required: true, message: '请选择数据位!' }]}
          />
          <ProFormSelect
            name="stopBit"
            label="停止位"
            options={[
              {
                value: '1',
                label: '1',
              },
              {
                value: '2',
                label: '2',
              },
            ]}
            width="xl"
            rules={[{ required: true, message: '请选择停止位!' }]}
          />
          <ProFormSelect
            name="verifyType"
            label="校验方式"
            options={[
              {
                value: 'EVEN',
                label: '偶校验',
              },
              {
                value: 'ODD',
                label: '奇校验',
              },
              {
                value: 'NO',
                label: '无校验',
              },
            ]}
            width="xl"
            rules={[{ required: true, message: '请选择校验方式!' }]}
          />
          <ProFormText
            name="interval"
            width="xl"
            label="间隔时间"
            placeholder="请输入间隔时间"
            rules={[{ required: true, message: '请输入间隔时间!' }]}
            fieldProps={{
              suffix: 'ms',
            }}
          />
        </>
      </RhTitle>
      <RhTitle title="其他信息" layout={'column'}>
        <>
          <ProFormText
            name="channelName"
            width="xl"
            label="通道名称"
            placeholder="请输入通道名称"
            rules={[{ required: true, message: '请输入通道名称!' }]}
          />
          <ProFormUploadButton
            name="upload"
            label="上传附件"
            max={2}
            fieldProps={{
              name: 'file',
              listType: 'picture-card',
            }}
            action="/upload.do"
            extra=".jpg"
          />
        </>
      </RhTitle>
    </ProForm>
  );
}

export default Demo;
