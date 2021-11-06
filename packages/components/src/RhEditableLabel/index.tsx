import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { Input, message } from 'antd';
import React from 'react';
import { useCallback, useState } from 'react';
import RhIcon from '../RhIcon';
import './styles.less';

export type IEditableLabel = {
  /**
   * 值
   */
  value: string;
  /**
   * 最大字符长度
   * @default 64
   */
  maxLength?: number;
  /**
   * 是否可编辑
   * @default true
   * @type boolean
   */
  editable?: boolean;
  /**
   * 位置
   * @default 'bottom'
   * @type string
   */
  placement?: 'top' | 'bottom';
  /**
   * 修改前判断回调
   * @type  () => Promise<boolean>;
   */
  beforeUpdate?: (v: string) => Promise<boolean>;
  /**
   * 值改变回调
   * @type  (v: string) => void
   */
  onChange?: (v: string) => void;
};

function RhEditableLabel(props: IEditableLabel) {
  const [editValue, setEditValue] = useState('');
  const [editing, setEditing] = useState(false); // 是否在编辑中
  const [confirming, setConfirming] = useState(false); // 是否确定中
  const {
    value = '',
    maxLength = 64,
    editable = true,
    placement = 'bottom',
    beforeUpdate = () => {},
    onChange = () => {},
  } = props;

  const onConfirm = useCallback(async () => {
    if (confirming) {
      return;
    }

    if (editValue.length > maxLength) {
      message.error(`最大长度${maxLength}`);
      return;
    }

    setConfirming(true);

    try {
      const shouldUpdate = await beforeUpdate(editValue);

      if (shouldUpdate) {
        setEditing(false);
        onChange(editValue);
      }

      setConfirming(false);
    } catch (error) {
      setConfirming(false);
    }
  }, [confirming, editValue, maxLength, beforeUpdate, onChange]);

  const onEdit = useCallback(() => {
    setEditing(true);
    setEditValue(value);
  }, [value]);

  const onCancel = useCallback(() => {
    setEditing(false);
    setEditValue(value);
  }, [value]);

  return (
    <div className="rh-editable-label">
      {editing && (
        <>
          <Input
            maxLength={maxLength}
            value={editValue}
            onInput={(e: any) => {
              setEditValue(e.target.value);
            }}
          />
          <div
            className={`popover-panel ${
              placement === 'top' ? 'top' : 'bottom'
            }`}
          >
            <div className="icon-box icon-check-box" onClick={onConfirm}>
              {confirming ? (
                <RhIcon src="loading" />
              ) : (
                <RhIcon src={<CheckOutlined />} />
              )}
            </div>
            <div className="icon-box icon-close-box" onClick={onCancel}>
              <RhIcon src={<CloseOutlined />} />
            </div>
          </div>
        </>
      )}
      {!editing && (
        <>
          <div className="label-text">{value}</div>
          {editable && (
            <RhIcon
              src="rh-icon-editpan"
              onClick={onEdit}
              className="icon-edit pointer"
            />
          )}
        </>
      )}
    </div>
  );
}

export default RhEditableLabel;
