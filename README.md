# Rh.js

[![Test](https://github.com/RootLinkFE/rh.js/workflows/Test/badge.svg)](https://github.com/RootLinkFE/rh.js/actions?query=workflow%3ATest) [![Coverage](https://img.shields.io/codecov/c/github/RootLinkFE/rh.js/master.svg)](https://codecov.io/github/RootLinkFE/rh.js/) [![npm package](https://img.shields.io/npm/v/@roothub/cli.svg)](https://www.npmjs.com/package/@roothub/cli) [![npm package](https://img.shields.io/npm/dm/@roothub/cli.svg)](https://www.npmjs.com/package/@roothub/cli) [![GitHub Release Date](https://img.shields.io/github/release-date/RootLinkFE/rh.js.svg?style=flat-square)](https://github.com/RootLinkFE/rh.js/releases)[![prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://prettier.io/)[![GitHub license](https://img.shields.io/github/license/mashape/apistatus.svg?style=flat-square)](https://github.com/RootLinkFE/rh.js/blob/master/LICENSE)

## Packages & Libs

- 🚀 **@roothub/cli** 脚手架 cli
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
- [ ] tags

## Documentation

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Introduction](#introduction)
- [Roothub CLI](#roothub-cli)
  - [CLI Args & Flags](#cli-args--flags)
    - [`rh init`](#rh-init)
    - [`rh add-block`](#rh-add-block)
    - [`rh create`](#rh-create)

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

#### `rh init`

_TODO: 建议重命名，init-materials 或 init-blocks_

- rh init 初始化远程物料库到本地目录

#### `rh add-block`

- rh add-block [block-name] [repository-name] 添加 block 到当前目录。

#### `rh create`

- `rh create [project-name]` 创建模板项目
- `rh create [project-name] -t <template> -l <UIlib> -m <material> -p <path>` 基于已知物料直接生成项目，t=模板，l=ui 库，m=物料库，path=生成项目的路径

####  `rh api`

- `rh api [swagger-url]` 根据 swagger 的接口文档，生成包括请求的代码
- `rh api [swagger-url] --output <output> --axiosConfig <path> --js --help` 根据 swagger 的接口文档，生成包括请求的代码，output=文件输出路径，path=axios配置输出路径，js=是否输出为js，help=输出帮助
- [更多详情](./packages/cli/src/commands/api/README.md)



