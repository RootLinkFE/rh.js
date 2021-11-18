import { cloneDeep } from 'lodash';
import type { ILeafNode } from './type';

export const isNotEmptyArray = (data: any[]) =>
  data && Array.isArray(data) && data.length > 0;

export const translateDataToTree = <T extends ILeafNode>(
  data: any[],
): any[] => {
  const dataParents = data.filter((item: T) => !item.parentId);

  const dataChildren = data.filter((item: T) => item.parentId > 0);

  const translator = (parents: any[], children: any[]) => {
    parents.forEach((parent: any) => {
      children.forEach((child, index) => {
        if (child.parentId === parent.id) {
          const temp = JSON.parse(JSON.stringify(children));
          temp.splice(index, 1);

          translator([child], temp);
          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
          isNotEmptyArray(parent.children)
            ? parent.children.push(child)
            : (parent.children = [child]);
        }
      });
    });
  };
  translator(dataParents, dataChildren);
  return dataParents;
};

/**
 * 根据关键词过滤树形数据
 * @param data 树数据list数组
 * @param searchKey 关键词搜索
 * @param showTree 是否显示结构
 * @returns
 */
export const searchByNodeName = (
  data: any[] = [],
  searchKey = '',
  showTree = true,
) => {
  const cloneTreeData = cloneDeep(data);
  const text = searchKey.trim();
  if (text) {
    const nodeMap: Record<string, any> = {}; // 方便拿节点
    const filterMap: Record<string, any> = {}; // 记录id，方便过滤
    const filterList: any[] = [];
    const result: any[] = [];
    cloneTreeData.filter((d: any) => {
      nodeMap[d.id] = d;
      if (d.name.indexOf(text) !== -1) {
        filterMap[d.id] = d.name;
        filterList.push(d);
      }
    });
    filterList.forEach((item) => {
      result.push(item);

      // 如果查询结果有parentId，就放到里边
      if (item.parentId && !filterMap[item.parentId]) {
        if (showTree) {
          filterMap[item.parentId] = nodeMap[item.parentId]; // 标记
          result.push(nodeMap[item.parentId]);
        } else {
          item.parentId = null;
        }
      } else if (!item.parentId) {
        // 如果搜索的是父级，把子级也展示出来
        if (showTree) {
          const arr = cloneTreeData.filter((b) => {
            if (b.parentId === item.id && !filterMap[b.id]) {
              filterMap[b.id] = nodeMap[b.id]; // 标记
              return true;
            }
            return false;
          });
          result.push(...arr);
        }
      }
    });

    return result;
  }
  return data;
};
