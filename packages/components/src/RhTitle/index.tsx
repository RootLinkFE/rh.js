import { DownOutlined, UpOutlined } from '@ant-design/icons';
import type { ReactElement } from 'react';
import React from 'react';
import { useState } from 'react';
import styles from './index.module.less';

export type RhTitleProps = {
  /**
   * 文本信息
   * @type string
   */
  title: string;
  /**
   * 布局方式，和 showCollapse 互斥
   * @type 'column' | 'default'
   * @default 'default'
   */
  layout?: string;
  /**
   * 文本字体大小
   * @default 18
   */
  fontSize?: number;
  /**
   * flex布局 justify-content
   * @default start
   */
  justifyContent?: string;
  /**
   * 是否显示折叠
   * @default false
   */
  showCollapse?: boolean;
  /**
   * 折叠状态
   * @default false
   */
  collapse?: boolean;
  /**
   * 折叠回调
   * @default (v: boolean) => void
   */
  onCollapseChange?: (v: boolean) => void;
  /**
   * 自定义样式
   */
  style?: any;
  /**
   * 自定义title样式
   */
  titleStyle?: any;
  children?: ReactElement;
};

function RhTitle(props: RhTitleProps) {
  const {
    title,
    fontSize = 18,
    justifyContent = 'start',
    layout = 'default',
    showCollapse = false,
    collapse = false,
    onCollapseChange = () => {},
    style = {},
    titleStyle = {},
    children,
  } = props;
  const [collapseStatus, setCollapseStatus] = useState(collapse);

  return (
    <div
      className={`${styles.rhTitle} ${
        layout === 'column' ? `${styles.rhTitleFlex}` : ''
      }`}
      style={style}
    >
      <div
        className={`${
          layout === 'column'
            ? `${styles.layoutColumn}`
            : `${showCollapse ? `${styles.rhTitleCollapse}` : ''}`
        }`}
        style={titleStyle}
      >
        <div className={styles.flexDiv} style={{ justifyContent }}>
          <div
            className={styles.borderDiv}
            style={{ height: `${fontSize}px` }}
          />
          <div className={styles.content} style={{ fontSize: `${fontSize}px` }}>
            {title}
          </div>
        </div>
        {showCollapse && layout !== 'column' && (
          <div
            className={styles.collapse}
            onClick={() => {
              const v = !collapseStatus;
              setCollapseStatus(v);
              onCollapseChange(v);
            }}
          >
            {!collapseStatus ? <UpOutlined /> : <DownOutlined />}
          </div>
        )}
      </div>
      {!collapseStatus && children && <div>{children}</div>}
    </div>
  );
}

export default RhTitle;
