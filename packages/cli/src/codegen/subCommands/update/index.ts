import commander from 'commander';
import fse from 'fs-extra';
import SwaggerAPI from './api/swagger-api';
import { CONFIG_FILE_NAME } from '../../constants';
import { chooseNeedMock, chooseSwaggerPaths } from '../../utils';
import doMock from './mock';
import chalk from 'chalk';
import { UpdateConfigType, UpdateCommandConfig } from './type';

export async function update(config: UpdateCommandConfig) {
  if (fse.existsSync(CONFIG_FILE_NAME)) {
    const globalConfig: UpdateConfigType = JSON.parse(
      fse.readFileSync(CONFIG_FILE_NAME).toString('utf8'),
    );
    const { apiConfig } = globalConfig;
    let { swaggerPaths } = globalConfig;

    for (const swPath of swaggerPaths) {
      if (!swPath.group && !swPath.name) {
        console.log(
          '[rh codegen]',
          chalk.red('group=false时，请配置相应的name'),
        );
        return;
      }
    }
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

    let allSpecUrls: any[] = [];
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
            ...apiConfig,
          });

          allSpecUrls = allSpecUrls.concat(specUrls);
          // apiSpecsPathsList.push(apiSpecsPaths);
          let needMock = config.all || globalConfig.mockConfig.mock;
          if (needMock === undefined) {
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

    if (allSpecUrls.length) {
      console.log(
        `建议执行\n${chalk.blue(
          'eslint --fix --ext .ts --format=pretty ' +
            globalConfig.apiConfig.output,
        )}`,
      );
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
    console.error('[rh codegen init]', '请先生成配置文件');
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
