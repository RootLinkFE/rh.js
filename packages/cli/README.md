# Cli

## Commands

**init**

- `rh init` 初始化远程物料库到本地目录

**add-block**

- `rh block use [repoName]:[block-name] [-p --path]` 添加 block 到当前目录/-p指定相对路径
- `rh block update [-n repoName1,repoName2]` 更新指定物料库名字,如有多个请用逗号隔开
- `rh block update  [-a --all]` 更新全部远程物料库

**create**

- `rh create [project-name]` 创建模板项目
- `rh create [project-name] -t <template> -l <UIlib> -m <material> -p <path>` 基于已知物料直接生成项目，t=模板，l=ui 库，m=物料库，path=生成项目的路径。

## Todo

> 参考实现 https://github1s.com/archguard/archguard-cli

- [ ] 创建基础组件模板 `rh g c 组件名 「-ba」`
- [ ] 创建业务组件模板 `rh g c 组件名 -bu`
- [ ] 创建页面：`rh g p test/Demo 页面菜单名`
  > 上述命令会在 `pages/test`文件夹下新建`Demo`页面，并且自动配置好`路由`和`菜单`（菜单名设置为最后一个参数：页面菜单名）

**常用缩写**

- `g => generate`
- `c => component`
- `-ba => --basic `
- `-bu => --business`

> 大家讨论讨论，想想还能做些什么
