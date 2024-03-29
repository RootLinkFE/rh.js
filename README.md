# Rh.js

[![Test](https://github.com/RootLinkFE/rh.js/workflows/Test/badge.svg)](https://github.com/RootLinkFE/rh.js/actions?query=workflow%3ATest) [![Coverage](https://codecov.io/gh/RootLinkFE/rh.js/branch/master/graph/badge.svg?token=SVSI9X9OF8)](https://codecov.io/github/RootLinkFE/rh.js/) [![prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://prettier.io/)[![GitHub license](https://img.shields.io/github/license/mashape/apistatus.svg?style=flat-square)](https://github.com/RootLinkFE/rh.js/blob/master/LICENSE)

## Packages & Libs

- 🚀 **@roothub/cli** 脚手架 cli [![npm package](https://img.shields.io/npm/v/@roothub/cli.svg)](https://www.npmjs.com/package/@roothub/cli)
- 📦 **@roothub/components** React 组件库 [![npm package](https://img.shields.io/npm/v/@roothub/components.svg)](https://www.npmjs.com/package/@roothub/components)，文档：http://components.leekhub.com/
- 📦 **@roothub/materials** 物料资产命令
- 🐠 **@roothub/shared** 工具库

## Development

- yarn
- lerna bootstrap
- yarn dev

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
    - [`rh codegen`](#rh-codegen)

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

> block 可简写为 b

- `rh block use [repository-name]:[block-name]` 下载物料到当前目录。

#### rh create

- `rh create [project-name]` 创建模板项目
- `rh create [project-name] -t <template> -l <UIlib> -m <material> -p <path>` 基于已知物料直接生成项目，t=模板，l=ui 库，m=物料库，path=生成项目的路径

#### rh api （不维护）

> 推荐使用 `rh codegen`

- `rh api [swagger-url]` 根据 swagger 的接口文档，生成包括请求的代码
- `rh api [swagger-url] --output <output> --axiosConfig <path> --js --help` 根据 swagger 的接口文档，生成包括请求的代码，output=文件输出路径，path=axios 配置输出路径，js=是否输出为 js，help=输出帮助
- [更多详情](./packages/cli/src/commands/api/README.md)

#### rh codegen

> `codegen` 可简写为 `cg`

- `rh codegen init` 生成配置文件 rh-codegen.config.json

```js
const config = {
  apiConfig: {
    output: './src/apis', // api 文件输出目录
    replaceEntryFile: false, // 是否替换 api 入口文件
  },
  mockConfig: {
    mock: true, // ( true / false )是否需要mock，可配置，不用询问
    output: './mock', // mock 文件输出目录
    independentServer: true, // 生成 entry-mock.js 文件 (入口) umi 环境下可配置 false 使得不生成
    port: 8081, // express 端口
  },
  swaggerPaths: [
    // 可能会是不同域名地址的微服务后端接口
    {
      name: '',
      path: '',
      group: false, // 是否代表多服务
      mockPrefix: '', // mock 服务前缀
    },
  ],
  options: {
    methodPrefix: '', // （预留）方法名称前缀
    reactNativeCompatible: false, // （预留）是否兼容RN App （要考虑支持，https://github.com/RootLinkFE/react-native-template 模板的 http-cient.ts 是不依赖antd和window.location等变量的）
  },
};
```

- `rh codegen update` 根据配置文件（多个 spec 情况下是选择模式）生成 API 文件，并询问是否继续生成 mock;
- `rh codegen update --all` 不需要选择，直接按照配置文件生成 API 文件与 MOCK 文件
- `rh codegen update --mock` 根据配置文件生成 MOCK 文件

## Related

- [RootHub](http://roothub.leekhub.com/) 前端研发平台

## License

MIT
