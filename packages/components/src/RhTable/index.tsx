/**
 * @author giscafer
 * @email giscafer@outlook.com
 * @create date 2021-09-23 19:18:36
 * @modify date 2021-11-25 16:49:06
 * @desc 简单包装，方便日后改动定制，使用方式和 ProTable 一致
 */

import { SearchOutlined } from '@ant-design/icons';
import type { ProFormColumnsType, ProFormInstance } from '@ant-design/pro-form';
import {
  BetaSchemaForm,
  LightFilter,
  ProFormDatePicker,
  ProFormDateRangePicker,
  ProFormDigit,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-form';
import type { ParamsType } from '@ant-design/pro-provider';
import type { ActionType, ProTableProps } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import type { PageInfo, ProColumns } from '@ant-design/pro-table/lib/typing';
import { useDebounceFn } from 'ahooks';
import React, { useCallback, useMemo, useRef } from 'react';
import './index.less';

export type RhTableProps<DataType, Params, ValueType> = ProTableProps<
  DataType,
  Params,
  ValueType
>;

export type RhColumns<T = any, ValueType = 'text'> = ProColumns<
  T,
  ValueType
> & {
  /**
   * 查询展示方式
   * @string 'query' | 'light'
   * @default 'query'
   */
  filterType?: 'query' | 'light';
  /**
   * 只用于查询字段
   * @string true | false
   * @default false
   */
  isQueryField?: true | false;
};

export type RhActionType = ActionType & {
  pageInfo: PageInfo & { params: Record<string, any> };
};

const RhTable = <
  DataType extends Record<string, any>,
  Params extends ParamsType = ParamsType,
  ValueType = 'text',
>(
  props: RhTableProps<DataType, Params, ValueType>,
) => {
  const {
    columns = [],
    search,
    request = () => Promise.resolve({}),
    debounceTime = 500,
    toolBarRender, // 特殊用途，用于查询条件比较小的情况下
    ...restProps
  } = props;
  const queryFilterFormRef = useRef<ProFormInstance>();
  const lightFilterFormRef = useRef<ProFormInstance>();
  const defaultActionRef = useRef<RhActionType>();

  const actionRef = (props.actionRef ||
    defaultActionRef) as React.MutableRefObject<RhActionType>;
  const onConfirmRef = useRef<() => void>();
  const { run } = useDebounceFn(
    () => {
      // 搜索时重置到第一页
      actionRef.current.pageInfo.current = 1;
      return actionRef.current?.reload(true);
    },
    { wait: debounceTime },
  );

  // 查询列定义
  const filterColumns: RhColumns[] = useMemo(() => {
    const defaultFilterType = search ? search.filterType : 'query';

    return columns
      .map((column: any) => {
        const {
          search: columnSearch,
          hideInSearch,
          valueType = 'text',
          valueEnum,
          title,
          filterType = defaultFilterType,
          fieldProps = {},
          formItemProps = {},
        } = column;

        if (
          columnSearch === false ||
          hideInSearch === true ||
          valueType === 'option'
        ) {
          return false;
        }

        return {
          ...column,
          filterType,
          valueType: valueEnum ? 'select' : valueType,
          fieldProps: {
            ...fieldProps,
            allowClear: true,
            size: fieldProps.size || 'large',
            suffix: (
              <SearchOutlined
                onClick={() => {
                  onConfirmRef.current?.();
                  run();
                }}
                style={{ cursor: 'pointer', fontSize: 22, color: '#9EA5B2' }}
              />
            ),
            placeholder:
              fieldProps.placeholder ||
              ([
                'date',
                'dateTime',
                'dateWeek',
                'dateMonth',
                'dateQuarter',
                'dateYear',
                'dateRange',
                'dateTimeRange',
                'time',
                'timeRange',
                'select',
                'color',
              ].includes(valueType)
                ? `请选择${title}`
                : `请输入${title}`),
            onKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => {
              if (e.key === 'Enter') {
                onConfirmRef.current?.();
                run();
              }
            },
          },
          formItemProps: {
            ...formItemProps,
            label: '',
          },
        };
      })
      .filter(Boolean);
  }, [columns, run, search]);

  // query查询列定义
  const queryFilterColumns = useMemo(() => {
    return filterColumns
      .filter((column) => column.filterType === 'query')
      .sort((a: any, b: any) => a?.order - b?.order) as ProFormColumnsType[];
  }, [filterColumns]);

  // light查询列定义
  const lightFilterColumns = useMemo(() => {
    return filterColumns
      .filter((column) => column.filterType === 'light')
      .sort((a: any, b: any) => a?.order - b?.order) as ProFormColumnsType[];
  }, [filterColumns]);

  const renderProFormItem = useCallback((column) => {
    const {
      valueType,
      dataIndex,
      title,
      valueEnum,
      fieldProps = { size: 'large' },
    } = column;

    if (valueType === 'digit') {
      return (
        <ProFormDigit
          key={dataIndex}
          name={dataIndex}
          label={title}
          fieldProps={fieldProps}
        />
      );
    }

    if (valueType === 'date') {
      return (
        <ProFormDatePicker
          key={dataIndex}
          name={dataIndex}
          label={title}
          fieldProps={fieldProps}
        />
      );
    }

    if (valueType === 'dateRange') {
      return (
        <ProFormDateRangePicker
          key={dataIndex}
          name={dataIndex}
          label={title}
          fieldProps={fieldProps}
        />
      );
    }

    if (valueType === 'select' || valueEnum) {
      return (
        <ProFormSelect
          key={dataIndex}
          name={dataIndex}
          label={title}
          valueEnum={valueEnum}
          fieldProps={fieldProps}
        />
      );
    }

    if (valueType === 'text' || !valueType) {
      return (
        <ProFormText
          key={dataIndex}
          name={dataIndex}
          label={title}
          fieldProps={{
            ...fieldProps,
          }}
          footerRender={(onConfirm) => {
            onConfirmRef.current = onConfirm;
            return false;
          }}
        />
      );
    }
    return null;
  }, []);

  const onRequest = useCallback(
    async (params, sort) => {
      const queryFormData = queryFilterFormRef.current?.getFieldsValue() || {};
      const lightFormData = lightFilterFormRef.current?.getFieldsValue() || {};
      const filter = { ...queryFormData, ...lightFormData };

      if (actionRef?.current) {
        actionRef.current.pageInfo.params = filter;
      }

      const res: any = await request({ ...params, ...filter }, sort, filter);
      return {
        ...res,
        total: Number(res.total),
      };
    },
    [actionRef, request],
  );

  return (
    <div className="rh-table">
      {/* TODO: 支持自定义宽度，而不是colSize控制太宽 */}
      {queryFilterColumns.length > 0 && (
        <BetaSchemaForm
          className="rh-table-query-filter-form"
          layoutType="QueryFilter"
          span={5}
          submitter={false}
          formRef={queryFilterFormRef}
          columns={queryFilterColumns}
          onValuesChange={run}
        />
      )}

      {toolBarRender && (
        <div className="rh-table-toolbar">
          {(toolBarRender as any)().map((item: any) => item)}
        </div>
      )}

      {lightFilterColumns.length > 0 && (
        <LightFilter
          className="rh-table-light-filter-form"
          formRef={lightFilterFormRef}
          onFinish={run}
        >
          {lightFilterColumns.map((column) => {
            return renderProFormItem(column);
          })}
        </LightFilter>
      )}

      <ProTable
        {...restProps}
        actionRef={actionRef}
        columns={columns.filter((item: any) => !item.isQueryField)}
        search={false}
        toolBarRender={false}
        request={onRequest}
      />
    </div>
  );
};

export default RhTable;
