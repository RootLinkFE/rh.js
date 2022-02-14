import chalk from 'chalk';
import fse from 'fs-extra';
import commander from 'commander';
import { CONFIG_FILE_NAME } from '../constants';

const config = {
  outputFolder: './src/rh', // 代码输出目录
  mockConfig: {
    outputFolder: './', // mock 文件输出目录
    ext: '.js', // 后缀名
    independentServer: true, // 生成 entry-mock[ext] 文件 (入口)
    port: 8081, // express 端口
  },
  swaggerPaths: [
    // 预留数组结构，后续可能会是不同域名地址的微服务后端接口
    {
      name: '',
      path: '',
      group: false, // 代表多服务
      mockPrefix: '', // mock 服务前缀
    },
  ],
  options: {
    methodPrefix: '', // （预留）方法名称前缀
    reatNativeCompatible: false, // （预留）是否兼容RN App （要考虑支持，https://github.com/RootLinkFE/react-native-template 模板的 http-cient.ts 是不依赖antd和window.location等变量的）
  },
};

export default function InitCommand(program: commander.Command) {
  program
    .command('init')
    .description('初始化配置文件')
    .action(() => {
      fse.writeFileSync(CONFIG_FILE_NAME, JSON.stringify(config, null, 2));
      console.log(chalk.green('初始化成功！'));
    });
}
