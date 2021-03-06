import chalk from 'chalk';
import fse from 'fs-extra';
import commander from 'commander';
import { CONFIG_FILE_NAME } from '../constants';

export const config = {
  apiConfig: {
    output: './src/apis', // api 文件输出目录
    replaceEntryFile: false, // 是否替换 api 入口文件
  },
  mockConfig: {
    output: './mock', // mock 文件输出目录
    independentServer: true, // 生成 entry-mock.js 文件 (入口) umi 环境下可配置 false 使得不生成
    port: 8081, // express 端口
  },
  swaggerPaths: [
    // 可能会是不同域名地址的微服务后端接口
    {
      name: '',
      path: '',
      group: false, // 代表多服务
      mockPrefix: '', // mock 服务前缀
    },
  ],
  options: {
    methodPrefix: '', // （预留）方法名称前缀
    reactNativeCompatible: false, // （预留）是否兼容RN App （要考虑支持，https://github.com/RootLinkFE/react-native-template 模板的 http-cient.ts 是不依赖antd和window.location等变量的）
  },
};

export function init(extraConfig = {}) {
  fse.writeFileSync(
    CONFIG_FILE_NAME,
    JSON.stringify({ ...config, ...extraConfig }, null, 2),
  );
  console.log(chalk.green('初始化成功！'));
}

export default function InitCommand(program: commander.Command) {
  program
    .command('init')
    .description('初始化配置文件')
    .action(() => {
      init();
    });
}
