import { PlusCircleOutlined } from '@ant-design/icons';
import { Input, Popconfirm, Tooltip, Tree } from 'antd';
import type { EventDataNode, TreeProps } from 'antd/lib/tree';
import { compact, debounce, flattenDepth } from 'lodash';
import type { Key } from 'react';
import React, { useCallback, useEffect, useState } from 'react';
import IconFont from '../IconFont';
import './style.less';
import type { IEditableTree, ILeafNode } from './type';
import { isNotEmptyArray, translateDataToTree } from './utils';

const { Search } = Input;

const INPUT_ID = 'inputId';

const RhTree = ({
  debug = false,
  list,
  treeData,
  expandedKeys = [],
  selectedKeys = [],
  disabled = false,
  autoExpandParent = true,
  search = true,
  showAddMenu = true,
  showAddBtn = false,
  showDeleteMenu = true,
  theme = 'gray',
  deleteTooltipText = '子节点将一起删除，是否继续？',
  rootParentId = 0,
  onEdit,
  onCreate,
  onDelete,
  onSelect,
  iconRender,
  addMenuRender,
  customEditCallback,
  onClick,
  addBtnCallback = () => {},
  height = 600,
  ...props
}: IEditableTree & TreeProps) => {
  const [isInputShow, toggleInputShow] = useState(true);
  const [nodeType, setNodeType] = useState('');
  const [isUpdated, toggleUpdated] = useState(false);
  const [lineList, setLineList] = useState<ILeafNode[]>([]);
  const [treeList, setTreeList] = useState<ILeafNode[]>([]);
  const [expandKeys, setExpandKeys] = useState<any[]>(expandedKeys);
  const [selectKeys, setSelectKeys] = useState<Key[]>(selectedKeys);
  const [autoExpand, setAutoExpand] = useState(autoExpandParent);
  const [inputValue, setInputValue] = useState('');
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    const lineLeafList: ILeafNode[] = isNotEmptyArray(list)
      ? list.map((item) => ({
          ...item,
          key: item.id,
          title: item.name,
          isCreate: false,
          isEdit: false,
          children: [],
        }))
      : [];
    setLineList(lineLeafList);
  }, [list]);

  useEffect(() => {
    const listObj = JSON.parse(JSON.stringify(lineList));
    const treeNodeList = translateDataToTree(listObj);

    setTreeList(treeNodeList);
    if (autoExpand) {
      setExpandKeys([treeNodeList[0]?.key]);
    }
  }, [autoExpand, lineList]);

  const inputNode = useCallback(
    (input) => {
      if (isInputShow && input) {
        input.focus();
      }
    },
    [isInputShow],
  );

  const toggleLeafEdit = (key: Key, isEdit: boolean) => {
    const leafList = lineList.map((leaf) => ({
      ...leaf,
      isCreate: false,
      isEdit: leaf.key === key ? isEdit : false,
    }));
    toggleUpdated(false);
    setLineList(leafList);
    toggleInputShow(isEdit);
  };

  const handleExpand = (keys: Key[]) => {
    // console.log(keys);

    setExpandKeys([...new Set(keys)]);
    setAutoExpand(false);
  };

  const toggleLeafCreate = (key: Key, type: string, isCreate: boolean) => {
    setNodeType(type);
    const leafList = lineList.map((leaf) => ({
      ...leaf,
      isEdit: false,
      // type: leaf.key === key ? type : leaf.type,
      isCreate: leaf.key === key ? isCreate : false,
    }));
    setLineList(leafList);
    toggleInputShow(isCreate);
    handleExpand([...expandKeys, key]);
  };

  const handleLeafEdit = (value: string, key: Key) => {
    toggleLeafEdit(key, false);
    setInputValue('');
    if (isUpdated && onEdit) {
      onEdit(value, key);
    }
  };

  const handleLeafCreate = (value: string, parentId: Key, type: string) => {
    toggleLeafCreate(parentId, type, false);
    setInputValue('');
    if (onCreate) {
      onCreate(value, type, parentId);
    }
  };

  const handleLeafDelete = (key: Key) => {
    if (onDelete) {
      onDelete(key);
    }
  };

  const handleTreeNodeClick = (
    e: React.MouseEvent,
    node: Partial<EventDataNode & { name: string }>,
  ) => {
    e.stopPropagation();
    if (onClick && node) {
      let n = node;
      // node 不含原始字段，这里做一层赋值
      list.forEach((item) => {
        if (item.id === node.key) {
          n = Object.assign(n, item);
        }
      });
      onClick(n);
    }
  };

  const handleTreeNodeSelect = (
    keys: (string | number)[],
    info?: { nativeEvent: MouseEvent },
  ) => {
    const inputId: any = (info?.nativeEvent?.target as HTMLInputElement)?.id;
    // 防止选中input所在的节点
    if (inputId !== INPUT_ID) {
      setSelectKeys(keys);
    }
    if (onSelect && keys.length) {
      onSelect(keys);
    }
  };

  const getParentKey = useCallback(
    (id: number | string | null) => {
      const parentKey: any[] = [];
      const iterateFn = (pId: number | string | null) => {
        lineList.forEach((item) => {
          if (item.id === pId) {
            parentKey.push(item.id);
            if (item.parentId !== rootParentId) {
              iterateFn(item.parentId);
            }
          }
        });
      };

      iterateFn(id);
      return parentKey;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [lineList],
  );

  // 防抖
  const delaySearch = debounce((e) => {
    const { value } = e.target;
    if (!value) return;
    const keys = lineList.map((item: any) => {
      if (item.title?.indexOf(value) > -1) {
        return getParentKey(item.parentId);
      }
      return null;
    });
    const expKeys = compact(flattenDepth(keys));

    setExpandKeys(expKeys);
    setSearchValue(value);
  }, 200);

  const onSearchChange = useCallback(
    (e: any) => {
      delaySearch(e);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [lineList, delaySearch],
  );

  function highLightSearchTitle(item: ILeafNode) {
    if (!searchValue) return <span>{item.name}</span>;
    const index = item.name.indexOf(searchValue);
    const beforeStr = item.name.substr(0, index);
    const afterStr = item.name.substr(index + searchValue.length);
    const title =
      index > -1 ? (
        <span>
          {beforeStr}
          <span className="site-tree-search-value">{searchValue}</span>
          {afterStr}
        </span>
      ) : (
        <span>{item.name}</span>
      );
    return title;
  }

  const actionElement = (leaf: ILeafNode) => {
    return (
      <span className="action" onClick={(e) => e.stopPropagation()}>
        {addMenuRender
          ? addMenuRender((type: string) => {
              toggleLeafCreate(leaf.key, type, true);
            })
          : showAddMenu && (
              <IconFont type="rh-icon-tree-create" className="icon" />
            )}

        <IconFont
          type="rh-icon-tree-edit"
          className="icon"
          onClick={() => {
            if (customEditCallback) {
              customEditCallback(leaf.key, leaf);
            } else {
              toggleLeafEdit(leaf.key, true);
              setInputValue(leaf.name);
            }
          }}
        />
        {showDeleteMenu && (
          <Popconfirm
            placement="top"
            title={deleteTooltipText}
            onConfirm={() => {
              handleLeafDelete(leaf.id);
            }}
          >
            <IconFont type="rh-icon-tree-delete" className="icon" />
          </Popconfirm>
        )}
      </span>
    );
  };
  const renderTree: any = (
    leafList: ILeafNode[],
    idx: number,
    parentId: Key,
    isCreate: boolean,
  ) => {
    if (debug) {
      // eslint-disable-next-line no-console
      console.log('treeList=', treeList);
    }
    const tree = leafList.map((leaf) => ({
      key: leaf.key,
      icon: leaf.icon || '',
      title: !leaf.isEdit ? (
        <div className="tree-leaf">
          {iconRender ? (
            <img src={iconRender(leaf.type)} />
          ) : (
            leaf.icon && (
              <IconFont type={leaf.icon as string} className="leaf-icon" />
            )
          )}
          {highLightSearchTitle(leaf)}
          {!disabled && !leaf.disabled && actionElement(leaf)}
        </div>
      ) : (
        <Input
          id={INPUT_ID}
          maxLength={10}
          ref={inputNode}
          value={inputValue}
          placeholder="输入限制为10个字符"
          suffix={<span>{inputValue.length}/10</span>}
          onChange={({ currentTarget }) => {
            const val = currentTarget.value;
            setInputValue(val);
            toggleUpdated(val !== leaf.name);
          }}
          onPressEnter={({ currentTarget }) => {
            handleLeafEdit(currentTarget.value, leaf.key);
          }}
          onBlur={({ currentTarget }) => {
            handleLeafEdit(currentTarget.value, leaf.key);
          }}
        />
      ),
      children: leaf.children
        ? renderTree(leaf.children, idx + 1, leaf.key, leaf.isCreate)
        : renderTree([], idx + 1, leaf.key, leaf.isCreate),
    }));
    return isCreate
      ? tree.concat({
          key: idx - 1000000,
          icon: '',
          title: (
            <Input
              maxLength={10}
              id={INPUT_ID}
              ref={inputNode}
              value={inputValue}
              placeholder={
                nodeType === 'NODE' ? '请输入节点名称' : '请输入属性名称'
              }
              // placeholder="输入限制为10个字符"
              suffix={<span>{inputValue.length}/10</span>}
              onChange={({ currentTarget }) => {
                setInputValue(currentTarget.value);
              }}
              onBlur={({ currentTarget }) => {
                handleLeafCreate(currentTarget.value, parentId, nodeType);
              }}
              onPressEnter={({ currentTarget }: any) => {
                handleLeafCreate(currentTarget.value, parentId, nodeType);
              }}
            />
          ),
          children: null,
        })
      : tree;
  };

  return (
    <div
      className="container-editable-tree"
      style={{
        backgroundColor: theme === 'light' ? '#fff' : '',
        height: height ? `${height}px` : '',
      }}
    >
      <div className="flex items-center justify-between w-11/12">
        {search && (
          <Search
            // size="small"
            allowClear
            className="search-tree"
            placeholder="输入筛选"
            onChange={onSearchChange}
          />
        )}
        {showAddBtn && (
          <Tooltip placement="top" title="新增">
            <PlusCircleOutlined
              className="pointer"
              onClick={(e: any) => {
                e.stopPropagation();
                // toggleLeafCreate();
                addBtnCallback();
              }}
            />
          </Tooltip>
        )}
      </div>
      <Tree
        {...props}
        blockNode
        selectedKeys={selectKeys}
        expandedKeys={compact(expandKeys)}
        treeData={renderTree(treeList)}
        onExpand={handleExpand}
        onSelect={handleTreeNodeSelect}
        onClick={handleTreeNodeClick}
        autoExpandParent={autoExpand}
      />
    </div>
  );
};

export default RhTree;
