# Rh.js

[![Test](https://github.com/RootLinkFE/rh.js/workflows/Test/badge.svg)](https://github.com/RootLinkFE/rh.js/actions?query=workflow%3ATest) [![Coverage](https://codecov.io/gh/RootLinkFE/rh.js/branch/master/graph/badge.svg?token=SVSI9X9OF8)](https://codecov.io/github/RootLinkFE/rh.js/) [![prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://prettier.io/)[![GitHub license](https://img.shields.io/github/license/mashape/apistatus.svg?style=flat-square)](https://github.com/RootLinkFE/rh.js/blob/master/LICENSE)

## Packages & Libs

- 🚀 **@roothub/cli** 脚手架 cli [![npm package](https://img.shields.io/npm/v/@roothub/cli.svg)](https://www.npmjs.com/package/@roothub/cli)
- 📦 **@roothub/components** React 组件库 [![npm package](https://img.shields.io/npm/v/@roothub/components.svg)](https://www.npmjs.com/package/@roothub/components)，文档：http://components.leekhub.com/
- 📦 **@roothub/materials** 物料资产命令
- 🐠 **@roothub/shared** 工具包

## TODO

- [x] 命令行处理
- [x] 模板依赖配置（package.json）
- [x] 物料模板结构调整（base、config、模板）
- [x] 生成初始模板
- [x] 模板依赖及组合依赖合并，生成组合模板（完成第一版脚手架）
- [x] 添加区块
- [ ] 优化本地调试模板

## Documentation

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Introduction](#introduction)
- [Roothub CLI](#roothub-cli)
  - [CLI Args & Flags](#cli-args--flags)
    - [`rh init`](#rh-init)
    - [`rh block`](#rh-block)
    - [`rh create`](#rh-create)
    - [`rh api`](#rh-api)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Introduction

## Roothub CLI

```sh
npm i -g @roothub/cli
```

### CLI Args & Flags

Usage:

```sh
$ rh [command] [...entries] [...flags]
```

#### rh init

> TODO: 建议重命名，`init-materials` 或 `init-blocks`

- `rh init` 初始化远程物料库到本地目录

#### rh block

- `rh block use [repository-name]:[block-name]` 下载物料到当前目录。

#### rh create

- `rh create [project-name]` 创建模板项目
- `rh create [project-name] -t <template> -l <UIlib> -m <material> -p <path>` 基于已知物料直接生成项目，t=模板，l=ui 库，m=物料库，path=生成项目的路径

#### rh api

- `rh api [swagger-url]` 根据 swagger 的接口文档，生成包括请求的代码
- `rh api [swagger-url] --output <output> --axiosConfig <path> --js --help` 根据 swagger 的接口文档，生成包括请求的代码，output=文件输出路径，path=axios 配置输出路径，js=是否输出为 js，help=输出帮助
- [更多详情](./packages/cli/src/commands/api/README.md)
