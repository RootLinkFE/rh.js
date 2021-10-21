import type { ActionType } from '@ant-design/pro-table';
import React from 'react';
import type { RhColumns } from '..';
import RhTable from '../index';

const columns: RhColumns<any>[] = [
  {
    title: '标题',
    dataIndex: 'title',
    ellipsis: true,
    filterType: 'query',
    tip: '标题过长会自动收缩',
  },
  {
    title: '状态',
    dataIndex: 'state',
    filterType: 'query',
    valueType: 'select',
    order: 99,
    valueEnum: {
      all: '全部',
      open: '未解决',
      closed: '已解决',
      processing: '解决中',
    },
  },
  {
    title: '创建时间',
    key: 'showTime',
    filterType: 'query',
    dataIndex: 'created_at',
    valueType: 'dateTime',
    hideInSearch: true,
  },
  {
    title: '操作',
    valueType: 'option',
    render: (text, record, _, action) => [
      <a
        key="editable"
        onClick={() => {
          action?.startEditable?.(record.id);
        }}
      >
        编辑
      </a>,
      <a href={record.url} target="_blank" rel="noopener noreferrer" key="view">
        查看
      </a>,
    ],
  },
];

export default () => {
  const actionRef = React.useRef<ActionType>();
  return (
    <RhTable<any>
      rowKey="id"
      columns={columns}
      actionRef={actionRef}
      pagination={{
        pageSize: 5,
      }}
      request={async (params = {}) => {
        // 这里只是举例
        const list: any = await fetch(
          'https://proapi.azurewebsites.net/github/issues',
        ).then((resp) => resp.json());

        return {
          data: list.data,
          success: true,
          // totalPages: list.page,
          // total: list.total,
        };
      }}
    />
  );
};
