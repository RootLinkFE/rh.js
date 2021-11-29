---
title: Tree
order: 2
nav:
  title: 组件
  path: /components
group:
  title: '数据展示'
---

# RhTree

树形组件，满足以下情况

- 可编辑
- 可搜索
- 自定义菜单
- 自定义图标
- 简单数据结构

## Demo

#### 简单例子

<code src="./demo/simple.tsx">

#### 自定义节点 Icon

可以直接通过 `icon` 属性指定 iconfont 图标，也可以通过 `iconRender` 来自定义渲染，`iconRender` 使用可以参考`复杂可编辑` demo

<code src="./demo/demo-icon.tsx">

#### 自定义前端搜索

> 直接使用 RhSearchInput 组件

<code src="./demo/demo-search.tsx">

#### 自定义菜单

<code src="./demo/demo-menu.tsx">

#### 复杂可编辑

<code src="./demo/complex.tsx">

<API src="./type.ts">
