## 物料CLI

把每一个物料（模板、页面、区块等）看做项目的一个元素，通过各自的material.json去获取对应的依赖信息，生成最终完整的项目

### material.json部分字段解释
```typescript
type MaterialConfigType = {
  path: string;
  title: string;
  type: string; // 物料类型[block、page、component]
  belong?: string; // 归属那套框架下（material-vue等）
  belongLib?: string; // 归属那套库(ant-design-vue/element-ui等)
  namespace?: string;
  name?: string;
  key: string; // 物料名字，要和文件夹名字一致
  description?: string;
  features?: string[];
  tags?: string[];
  img: string;
  private?: boolean;
  dependencies?: string[]; // 三方库依赖
  materialDeps?: string[]; // 物料依赖，格式：ui库:物料类型:物料key， eg: [ant-design-vue:blocks:AdminLogin,ant-design-vue:blocks:AboutUs]
};
```

### 注意地方
1. 目前手动维护manifest.default.json
```typescript
type MaterialResourcesConfigType = {
  name: string;
  git?: string;
  description: string;
  localPath?: string;
  belong?: 'template' | 'material';
  materialsIncludes?: Array<string>; // 只选择符合当前模板的物料库
}
```
2. template模板必须包含src文件和material.json文件，原因组装的物料必须存放在src/materials  
3. 所有物料必须有material.json文件才能被识别


### TODO
**create**  

- [x] 初始化本地物料库及模板
- [x] 支持命令生成已选模板和物料项目工程
- [x] 支持命令式用户交互（询问）、直接式命令交互（create <name> -t xxx -l xxx -m xxx）
- [x] 支持增量添加远程物料库至本地
- [ ] 物料dependencies下依赖，向下兼容模板工程
- [ ] 支持本地物料库开发

**update**  

- [ ] 更新模板物料
