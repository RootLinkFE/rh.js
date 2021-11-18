import type { DataNode, EventDataNode } from 'rc-tree/lib/interface';
import type { Key, ReactNode, ReactElement } from 'react';
import React from 'react';

export type IBaseNode = {
  /**
   * 节点id
   * @requires
   * @type string | number
   */
  id: string | number;
  /**
   * 节点名称
   * @requires
   * @type string
   */
  name: string;
  /**
   * 父节点id
   * @requires
   * @type string | number
   * @default null
   */
  parentId: string | number;
};

export interface ILeafNode extends DataNode, IBaseNode {
  /**
   * 节点是否可编辑
   * @type boolean
   */
  isEdit?: boolean;
  /**
   * 节点是否可新增
   * @type boolean
   */
  isCreate?: boolean;
  /**
   * 子节点数组
   * @type ILeafNode[]
   */
  children?: ILeafNode[];
  /**
   * 节点图标
   * @type undefined | string | ReactNode
   */
  icon?: undefined | string | ReactNode;
  /**
   * 节点类型，用于业务判断区分
   * @type string
   */
  type?: undefined | string;
}

export type RhTreeMenuProps = {
  /**
   * 菜单类型对象，default 则为默认菜单
   */
  types: Record<string, ReactElement>;
  /**
   * 自定义触发菜单dom
   */
  trigger?: ReactElement | boolean;
  /**
   * 菜单点击事件委托
   */
  onClick: (node: ILeafNode, event: any) => void;
};

export interface IRhTree {
  /**
   * 日记打印
   * @type boolean
   * @default false
   */
  debug?: boolean;
  /**
   * 树形数据，带id和 parentId 字段的数组（无需树形嵌套结构，内部自动转换）
   * @type ILeafNode[]
   * @default []
   */
  list: ILeafNode[];
  /**
   * 是否可编辑
   * @type boolean
   * @default true
   */
  editable?: boolean;
  /**
   * 主题色（`gray` 或 `light`）
   * @type string
   * @default gray
   */
  theme?: string;
  /**
   * 高度
   * @type number
   * @default 600
   */
  height?: number;
  /**
   * 删除按钮提示信息
   * @type string
   * @default 子节点将一起删除，是否继续？
   */
  deleteTooltipText?: string;
  /**
   * 根节点id
   * @type number | string | null
   * @default 0
   */
  rootParentId?: string | number | null;
  /**
   * 是否显示搜索框
   * @type boolean
   * @default true
   */
  search?: boolean;
  /**
   * 自定义菜单
   */
  menuProps?: RhTreeMenuProps;
  /**
   * 搜索框右侧，是否显示新增按钮（search 为true的时候生效）
   * @type boolean
   * @default true
   */
  showAddBtn?: boolean;
  /**
   * 节点是否显示添加菜单
   * @type boolean
   * @default true
   */
  showAddMenu?: boolean;
  /**
   * 节点是否显示删除菜单
   * @type boolean
   * @default true
   */
  showDeleteMenu?: boolean;
  /**
   * 高亮文字，一般用于搜索过滤时的关键词高亮
   * @type string
   */
  highlightText?: string;
  /**
   * 是否单选，用于点击设备数字模型菜单等单选联动显示效果
   * @type boolean
   * @default false
   */
  singleSelect?: boolean;
  /**
   * 点击树节点触发
   * @type Function
   * @default (selectedKeys, e:{selected: bool, selectedNodes, node, event})=>void
   */
  onClick?: (node: Partial<EventDataNode & { name: string }>) => void;
  /**
   * 新增按钮回调
   * @type Function
   * @default function(){}
   */
  addBtnCallback?: () => void;
  /**
   * icon自定义渲染
   * @type Function
   * @default (nodeType: string) => string;
   */
  iconRender?: (nodeType?: string) => string;
  /**
   * 新增按钮自定义渲染
   * @type Function
   * @default (fn?: (type: string) => void) => void;
   */
  addMenuRender?: (fn?: (type: string) => void) => void;
  /**
   * 编辑节点回调方法
   * @type Function
   * @default (value: string, id: Key) => void
   */
  onEdit?: (value: string, id: Key) => void;
  /**
   * 新增节点回调方法
   * @type Function
   * @default (value: string, nodeType: string, parentId: Key) => void;
   */
  onCreate?: (value: string, nodeType: string, parentId: Key) => void;
  /**
   * 删除节点回调方法
   * @type Function
   * @default (id: Key) => void
   */
  onDelete?: (id: Key) => void;
  /**
   * 自定义编辑回调方法
   * @type Function
   * @default (id: Key, node?: ILeafNode) => void;
   */
  customEditCallback?: (id: Key, node?: ILeafNode) => void;
  /**
   * 选中节点触发
   * @type Function
   * @default (id: Key | Key[]) => void;
   */
  onSelect?: (id: Key | Key[]) => void;
}

export interface RhEditableTreeRef {
  selectKeys: React.Key[];
  setSelectKeys: React.Dispatch<React.SetStateAction<React.Key[]>>;
}

// 导出用于 Api 文档自动生成
export const RhTreeMenuPropsApi: React.FC<RhTreeMenuProps> = () => null;
export const IEditableTreeApi: React.FC<IRhTree> = () => null;
export const ILeafNodeApi: React.FC<ILeafNode> = () => null;
