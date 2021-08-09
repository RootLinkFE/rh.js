# Rh.js

[![Test](https://github.com/RootLinkFE/rh.js/workflows/Test/badge.svg)](https://github.com/RootLinkFE/rh.js/actions?query=workflow%3ATest) [![Coverage](https://img.shields.io/codecov/c/github/RootLinkFE/rh.js/master.svg)](https://codecov.io/github/RootLinkFE/rh.js/) [![npm package](https://img.shields.io/npm/v/@roothub/cli.svg)](https://www.npmjs.com/package/@roothub/cli) [![npm package](https://img.shields.io/npm/dm/@roothub/cli.svg)](https://www.npmjs.com/package/@roothub/cli)[![Dependency Status](https://david-dm.org/RootLinkFE/rh.js/status.svg?style=flat-square)](https://david-dm.org/RootLinkFE/rh.js) [![GitHub Release Date](https://img.shields.io/github/release-date/RootLinkFE/rh.js.svg?style=flat-square)](https://github.com/RootLinkFE/rh.js/releases)[![prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://prettier.io/)[![GitHub license](https://img.shields.io/github/license/mashape/apistatus.svg?style=flat-square)](https://github.com/RootLinkFE/rh.js/blob/master/LICENSE)

## Packages & Libs

- 🚀 **@roothub/cli** cli 脚手架
- 📦 **@roothub/materials** 物料资产命令
- 🐠 **@roothub/shared** 工具包

## Getting started

## [Cli](./packages/cli/README.md)

To get a global install of the latest CLI release:

```shell
npm i -g @roothub/cli
```

Then running any `rh` command to use CLI. like:

```shell
rh -v
```

## TODO

- [x] 命令行处理
- [x] 模板依赖配置（package.json）
- [x] 物料模板结构调整（base、config、模板）
- [x] 生成初始模板
- [x] 模板依赖及组合依赖合并，生成组合模板（完成第一版脚手架）
- [x] 添加区块
- [ ] 优化本地调试模板
- [ ] tags
