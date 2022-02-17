import commander from 'commander';
import fse from 'fs-extra';
import SwaggerAPI from './api/swagger-api';
import { CONFIG_FILE_NAME } from '../../constants';
import { chooseNeedMock, chooseSwaggerPaths } from './api/choose';
import doMock from './mock';

export async function update(config: { all: any; mock: any }) {
  if (fse.existsSync(CONFIG_FILE_NAME)) {
    const globalConfig = JSON.parse(
      fse.readFileSync(CONFIG_FILE_NAME).toString('utf8'),
    );
    const { outputFolder } = globalConfig;
    let { swaggerPaths } = globalConfig;
    const taskList = [];
    // const apiSpecsPathsList: ApiSpecsPathsType[][] = [];
    if (!config.all && swaggerPaths.length > 1) {
      swaggerPaths = await chooseSwaggerPaths(
        swaggerPaths.map((item: { name: any }) => ({
          name: item.name,
          value: item,
        })),
      );
    }
    for (let i = 0; i < swaggerPaths.length; i++) {
      const allConfig = {
        ...swaggerPaths[i],
        ...config,
        globalConfig: globalConfig,
      };
      if (config.mock) {
        taskList.push(
          async () => await doMock(swaggerPaths[i].path, allConfig),
        );
      } else {
        const func = async () => {
          const { specUrls } = await SwaggerAPI(swaggerPaths[i].path, {
            ...allConfig,
            output: outputFolder + '/api',
          });
          // apiSpecsPathsList.push(apiSpecsPaths);
          let needMock = config.all;
          if (!needMock) {
            needMock = await chooseNeedMock();
          }
          if (needMock) {
            await doMock(swaggerPaths[i].path, { ...allConfig, specUrls });
          }
        };
        taskList.push(func);
      }
    }

    for (let i = 0; i < taskList.length; i++) {
      await taskList[i]();
    }

    // // update 更新 不使用
    // if (apiSpecsPathsList.some((item) => item.length)) {
    //   const newConfig = {
    //     ...globalConfig,
    //     swaggerPaths: globalConfig.swaggerPaths.map(
    //       (item: any, index: string | number) => {
    //         if (apiSpecsPathsList[index].length) {
    //           return {
    //             ...item,
    //             apiSpecsPaths: apiSpecsPathsList[index],
    //           };
    //         } else {
    //           return item;
    //         }
    //       },
    //     ),
    //   };

    //   fse.writeFileSync(
    //     CONFIG_FILE_NAME,
    //     JSON.stringify(newConfig, null, 2),
    //   );
    // }
  } else {
    console.error('请先生成配置文件, rh codegen init');
  }
}

export default function InitCommand(program: commander.Command) {
  program
    .command('update')
    .description('更新文件(api|mock)')
    .option('-a, --all', '跳过选择，更新所有数据')
    .option('--mock', '单独 mock 数据')
    .action(async (config) => {
      await update(config);
    });
}
