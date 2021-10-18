---
title: RhEditableTagGroup
nav:
  title: 'Components'
  path: /components
group:
  title: '数据展示'
---

## RhEditableTagGroup

可编辑标签组

### API

| 参数             | 说明                                 | 类型                        | 默认值     |
| ---------------- | ------------------------------------ | --------------------------- | ---------- |
| value            | 标签数组                             | `string[]`                  | `[]`       |
| disabled         | 是否禁用                             | `boolean`                   | `false`    |
| maxLength        | 最多标签数量                         | `number`                    | `Infinity` |
| InputMaxLength   | 输入框最大长度                       | `number`                    | `Infinity` |
| displayMaxLength | 单个标签展示最大长度，超出显示省略号 | `number`                    | `20`       |
| onChange         | 内存记录改变回调                     | `(value: string[]) => void` | -          |

## Demo

```tsx
import React from 'react';
import Demo from './Demo.tsx';

export default function () {
  return <Demo />;
}
```
