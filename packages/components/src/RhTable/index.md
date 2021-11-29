---
title: Table
order: 1
nav:
  title: 组件
  path: /components
group:
  title: '数据展示'
---

# RhTable

用于修改查询条件规范，使用方式和 [ProTable - 高级表格](https://procomponents.ant.design/components/table?current=1&pageSize=5) 一致

- 改造查询条件 UI 交互
- 通用配置统一
- 简化使用

精简写法：

```html
// 正常只需要配置这几个属性即可满足要求
<RhTable columns="{columns}" actionRef="{actionRef}" request="{getList}" />
```

## Demo

### 简单 table

<code src="./demos/simple.tsx">

### 复杂 table

<code src="./demos/complex.tsx">

<API src="./index.tsx" />
