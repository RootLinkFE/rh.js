import { SearchOutlined } from '@ant-design/icons';
import { useDebounceFn } from 'ahooks';
import { Input } from 'antd';
import React, { useState } from 'react';
import './index.less';

export type RhSearchInputProps = {
  /**
   * 是否显示border
   */
  bordered?: boolean;
  /**
   * 输入提示
   */
  placeholder?: string;
  /**
   * 防抖延迟时间（ms)
   * @default 200
   */
  delayTime?: number;

  /**
   * 搜索回调，仅回车和图标点击时触发
   */
  onSearch?: (v: string) => void;
  /**
   * change回调，文字变化即触发
   */
  onChange?: (v: string) => void;
  [key: string]: any;
};

function RhSearchInput({
  placeholder = '请输入',
  bordered = true,
  delayTime = 200,
  onSearch = () => {},
  onChange = () => {},
  ...restProps
}: RhSearchInputProps) {
  const [value, setValue] = useState<string>('');

  const { run: onSearchRun } = useDebounceFn(
    async () => {
      onSearch(value);
    },
    { wait: delayTime },
  );

  const { run: onChangeRun } = useDebounceFn(
    async () => {
      onChange(value);
    },
    { wait: delayTime },
  );

  return (
    <Input
      allowClear
      value={value}
      placeholder={placeholder}
      bordered={bordered}
      className="rh-search-input"
      onChange={(e) => {
        const v = e.target?.value;
        setValue(v);
        onChangeRun();
      }}
      onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
          onSearchRun();
        }
      }}
      {...restProps}
      suffix={
        restProps?.suffix || restProps?.suffix === null ? (
          restProps?.suffix
        ) : (
          <SearchOutlined
            onClick={() => {
              onSearchRun();
            }}
            style={{ cursor: 'pointer', fontSize: 22, color: '#9EA5B2' }}
          />
        )
      }
    />
  );
}

export default RhSearchInput;
