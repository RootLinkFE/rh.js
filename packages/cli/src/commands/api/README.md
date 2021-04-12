## 通过 Swagger 文档生成代码

根据 swagger 的接口文档，生成包括请求的代码。以 axios 作为http客户端

### 使用说明

`rh api [swagger-url]`

```bash
Options:
  -o, --output <output>  output path of typescript api file (default: "./src/.rh/apis")
  --js                   generate js api module with declaration file (default: false)
  --axiosConfig <path>   export default axios config file path
  -h, --help             display help for command
```

执行成功后，会在当前目录下的`./src/.rh/apis`生成多个源码文件。

```js
// 在业务代码中引入
import API from '@/.rh/apis'

// 调用API
API.Common.api.basePositionAdd(xxx); 
  // Common 对应 swagger 导出时的多个资源
```

## 参数说明

**out**  --  指定输出目录

**js**  --  输出JS格式，默认TS格式

**axiosConfig**  --  指定 axios 配置目录。

### axiosConfig

axiosConfig 配置项是 axios 的配置文件路径，并且导出以`default`导出。

```js
// ./src/config/axios.ts

export default {
  baseURL: "/abc.com"
}
```

执行`rh api [swagger-url] --axiosConfig "src/config/axios.ts"`

输出文件如下：

```js
import axiosConfig from '../../config/axios'; // 相对路径会根据output路径计算
import { Api as Common } from "./Common";
import { Api as Project } from "./Project";

export default {
  Common: new Common(axiosConfig),
  Project: new Project(axiosConfig),
};
```

## 注意事项

#### 1. swagger 文档的地址

应该填写类似 

- https://drp.bighome360.com/v2/api-docs?group=commonApi--公共API
- https://drp.bighome360.com/swagger-ui.html
- https://dapi.bighome360.com/visual-server/doc.html

#### 建议使用 TypeScript

TypeScript 有类型推导，能节省翻查文档时间。