const { parser } = require('./parser');
const fs = require('fs');
const { mkdirp } = require('fs-extra');
import { camelCase } from 'lodash';
import prettier from 'prettier';

export const mock: any = {
  async init(
    opts: any,
    config: {
      mockPrefix?: string;
      mockConfig: Record<string, any>;
      name?: string;
    } = {
      mockConfig: {},
    },
  ): Promise<any> {
    const { mockConfig } = config;
    this.mockConfig = mockConfig;
    this.outputPath = mockConfig.output;
    this.dataLength = mockConfig.dataLength || '1-8';
    this.content = '';
    this.prefix = config.mockPrefix || '';
    this.ext = '.js';
    // this.ext = mockConfig.ext || '.js'; // TODO
    const group = new URL(opts.url).searchParams.get('group');

    if (group) {
      this.fileName = camelCase(group.split('--')[0]) + this.ext;
    } else {
      this.fileName = camelCase(config.name) + this.ext;
    }

    await this.parse(opts);

    if (this.content) {
      await writeToMockFile(
        this.outputPath,
        this.fileName,
        this.content,
        config,
      );
      return { state: 'success', content: this.content };
    } else {
      return { state: 'failed' };
    }
  },
  // 解析swagger-api-doc
  async parse(opts: any) {
    const { paths } = await parser(opts);

    await this.checkFileExist();
    this.traverse(paths);

    if (!paths) return;
  },
  // 初始化目录 判断是否有该文件
  checkFileExist() {
    return new Promise<void>((resolve, reject) => {
      if (!fs.existsSync(this.outputPath)) {
        // 新建该文件夹
        mkdirp(this.outputPath, (err: any) => {
          throwErr(err);
          initTemp(this.outputPath, this.fileName);
          resolve();
        });
      } else {
        initTemp(this.outputPath, this.fileName);
        resolve();
      }
    });
  },

  // 遍历paths
  traverse(paths: any) {
    this.content = '';
    for (let path in paths) {
      this.traverseMethod(paths, path);
    }
  },

  // 遍历某模块下的所有方法
  traverseMethod(
    paths: {
      [x: string]: { [x: string]: { [x: string]: { [x: string]: any } } };
    },
    path: string | number,
  ) {
    for (let method in paths[path]) {
      const summary = paths[path][method]['summary'];
      const responses = paths[path][method]['responses'];
      const response = responses['200'] || responses;

      this.generate(summary, response['example'], method, path);
    }
  },
  // 生成指定格式的文件后写入到指定文件中
  async generate(summary: any, example: any, method: any, path: any) {
    try {
      const data = this.generateTemplate({ summary, example, method, path });
      this.content += data;
    } catch (error) {
      console.log(error);
    }
  },

  // 生成mock api模版
  generateTemplate({
    summary,
    example,
    method,
    path,
  }: {
    summary: string;
    example: string;
    method: string;
    path: string;
  }) {
    // api path中的{petId}形式改为:petId
    if (!example) {
      return '';
    }
    const data = formatResToMock(path, example, this.dataLength);
    let temp = `
    // ${summary}
    '${method.toUpperCase()} ${this.prefix}${path.replace(
      /\{([^}]*)\}/g,
      ':$1',
    )}': (req, res) => {
      res.send(mockjs.mock(${data.replace(/null/g, '') || `true`}));
    },
    `;
    return temp;
  },
};

// 格式化mock，如果是数组，自动添加多条数据
function formatResToMock(
  path: string | string[],
  res: string,
  dataLength: any,
) {
  let data = '';
  let praseRes = JSON.parse(res || '{}');
  if (Array.isArray(praseRes)) {
    data = `{
      code: 1001,
      message: 'success' ,
      "data|${dataLength}": ${res}
    }`;
  } else {
    Object.keys(praseRes).forEach((key) => {
      if (Array.isArray(praseRes[key])) {
        praseRes[`${[key]}|${dataLength}`] = praseRes[key];
        delete praseRes[key];
      }
    });
    data = `{
      code: 1001,
      message: 'success' ,
      "data": ${JSON.stringify(praseRes)}
    }`;
  }
  return data;
}

// 将mock数据写入js文件
function writeToMockFile(
  outputPath: any,
  fileName: any,
  content: any,
  config: any,
) {
  // 写入文件
  const template = !config.globalConfig.codegenTest
    ? `import mockjs from 'mockjs';
  export default {
    ${content}
  }
`
    : `
    module.exports= {
      ${content}
    }
`;
  fs.writeFileSync(
    `${outputPath}/${fileName}`,
    prettier.format(template, { parser: 'babel' }),
    'utf8',
    () => throwErr,
  );
}

// 初始模版
function initTemp(path: any, fileName: any) {
  fs.writeFileSync(`${path}/${fileName}`, '', (err: any) => throwErr(err));
}
function throwErr(err: any) {
  if (err) {
    console.error('同步失败', err);
    throw err;
  }
}
