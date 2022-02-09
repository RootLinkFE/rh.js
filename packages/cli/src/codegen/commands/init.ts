import chalk from 'chalk';
import fse from 'fs-extra';
import commander from 'commander';
import { CONFIG_FILE_NAME } from '../constants';

const config = {
  outputFolder: './src/rh', // 代码输出目录（内部有 apis/mocks两个目录）
  swaggerPaths: [
    // 预留数组结构，后续可能会是不同域名地址的微服务后端接口
    {
      name: 'protocol-model-server',
      path: 'http://protocol-model-server.nc-qa.rootcloudapp.com/frame-pmt',
      group: true, // 代表多服务
      mockPrefix: '', // mock 服务前缀
      apiSpecsPaths: [
        // update 操作时更新
      ],
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
