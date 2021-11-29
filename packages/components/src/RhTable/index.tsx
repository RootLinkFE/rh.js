/**
 * @author giscafer
 * @email giscafer@outlook.com
 * @create date 2021-09-23 19:18:36
 * @modify date 2021-11-29 10:38:05
 * @desc 通用封装，目的是为了精简写法和改造UI规范，唯一不变原则： ProTable 原 Api 一致性不变
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
import React, { useCallback, useMemo, useRef, useState } from 'react';
import './index.less';

export type RhTableProps<DataType, Params, ValueType> = ProTableProps<
  DataType,
  Params,
  ValueType
> & {
  /**
   * 是否重置查询分页
   */
  resetPageIndex?: boolean;
  /**
   * request 请求额外传入参数，试用在查询表单以外的查询条件
   */
  extraParams?: Record<string, any>;
};

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
    debounceTime = 500,
    toolBarRender, // 特殊用途，用于查询条件比较小的情况下
    resetPageIndex = true,
    extraParams = {},
    request,
    ...restProps
  } = props;
  const queryFilterFormRef = useRef<ProFormInstance>();
  const lightFilterFormRef = useRef<ProFormInstance>();
  const defaultActionRef = useRef<RhActionType>();
  const [loading, setLoading] = useState(false);

  const actionRef = (props.actionRef ||
    defaultActionRef) as React.MutableRefObject<RhActionType>;
  const onConfirmRef = useRef<() => void>();
  const { run } = useDebounceFn(
    () => {
      // 搜索时重置到第一页
      actionRef.current.pageInfo.current = 1;
      return actionRef.current?.reload(resetPageIndex);
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
    async (pageInfo, sort) => {
      setLoading(true);
      const queryFormData = queryFilterFormRef.current?.getFieldsValue() || {};
      const lightFormData = lightFilterFormRef.current?.getFieldsValue() || {};
      const queryParams = { ...queryFormData, ...lightFormData };

      if (actionRef?.current) {
        actionRef.current.pageInfo.params = queryParams;
      }
      const { current, pageSize } = pageInfo;

      // current 是兼容老写法
      const params = {
        page: current,
        current,
        pageSize,
        ...queryParams,
        ...extraParams,
      };
      const res: any = await request?.(params, sort, queryParams);
      setLoading(false);
      return {
        ...res,
        success: true,
        total: Number(res.totalSize) || 0,
        totalPages: Number(res.totalPages) || 0,
      };
    },
    [actionRef, extraParams, request],
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
        rowKey="id"
        options={false}
        loading={request ? loading : restProps.loading}
        scroll={{ x: 1300 }}
        form={{
          ignoreRules: false,
        }}
        pagination={{
          pageSize: 10,
        }}
        dateFormatter="string"
        {...restProps}
        actionRef={actionRef}
        columns={columns}
        search={false}
        toolBarRender={false}
        request={request && onRequest}
      />
    </div>
  );
};

export default RhTable;
