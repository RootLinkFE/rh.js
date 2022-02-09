const { parser } = require('./parser');
const fs = require('fs');
const mkdirp = require('mkdirp');
import { camelCase } from 'lodash';
import prettier from 'prettier';

export const mock: any = {
  async init(
    opts: any,
    config: { outputFolder?: string; mockPrefix?: string } = {},
  ): Promise<any> {
    this.blacklist = [];
    this.whitelist = [];
    this.outputPath = config.outputFolder;
    this.dataLength = '1-8';
    this.content = '';
    this.prefix = config.mockPrefix || '';
    const group = new URL(opts.url).searchParams.get('group');
    try {
      this.fileName = camelCase(group?.split('--')[0]) + '.js';
    } catch (e) {
      this.fileName = new URL(opts.url).hostname + '.js';
    }
    await this.parse(opts);

    if (this.content) {
      await writeToMockFile(this.outputPath, this.fileName, this.content, true);
      return { state: 'success', content: this.content };
    } else {
      return { state: 'failed' };
    }
  },
  // 解析swagger-api-doc
  async parse(opts: any) {
    const { paths } = await parser(opts);
    this.checkFileExist().then(this.traverse(paths));
    if (!paths) return;
  },
  // 初始化目录 判断是否有该文件
  async checkFileExist() {
    return new Promise<void>((resolve, reject) => {
      if (!fs.existsSync(this.outputPath)) {
        // 新建该文件夹
        mkdirp(this.outputPath, (err: any) => {
          throwErr(err);
          initTemp(this.outputPath, this.fileName);
        });
      } else {
        initTemp(this.outputPath, this.fileName);
      }
      resolve();
    });
  },

  // 遍历paths
  traverse(paths: any) {
    let index = 0;
    this.content = '';
    for (let path in paths) {
      index++;
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
      const response = paths[path][method]['responses']['200'];
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
  generateTemplate({ summary, example, method, path }: any) {
    // api path中的{petId}形式改为:petId
    const data = formatResToMock(path, example, this.dataLength);
    let temp = `
        /**
          ${summary}
        **/
        app.${method}('${this.prefix}${path.replace(
      /\{([^}]*)\}/g,
      ':$1',
    )}', (req, res) => {
        res.send(Mock.mock(${data.replace(/null/g, '') || `true`}));
      });`;
    return prettier.format(temp, { parser: 'babel' });
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
  independentServer: boolean,
) {
  // 写入文件
  let template = !independentServer
    ? `var Mock = require('mockjs')
  export default {
    ${content}
  }
    `
    : `const Mock = require('mockjs')
    module.exports = function(app) {
      ${content}
    }
  `;
  fs.writeFileSync(
    `${outputPath}/${fileName}`,
    template,
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
