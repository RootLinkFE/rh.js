Rh 工程化项目

## [Cli](./packages/cli/README.md)

You can just run:

```shell
npm i -g @roothub/cli
```

to get a global install of the latest CLI release. Then running any `rh` command
in the example project will automatically find and use the local build of the
CLI.

To get CLI version:

```shell
rh -v
```

**功能清单**

- [x] 命令行处理  
- [x] 模板依赖配置（package.json）    
- [x] 物料模板结构调整（base、config、模板）
- [x] 生成初始模板
- [x] 模板依赖及组合依赖合并，生成组合模板（完成第一版脚手架）
- [x] 添加区块
- [ ] 优化本地调试模板
- [ ] tags
