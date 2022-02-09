import commander from 'commander';
import fse from 'fs-extra';
import SwaggerAPI, { ApiSpecsPathsType } from './api/swagger-api';
import { CONFIG_FILE_NAME } from '../../constants';
import { chooseNeedMock } from './api/choose';
import doMock from './mock';

export default function InitCommand(program: commander.Command) {
  program
    .command('update')
    .description('更新文件')
    .option('-c, --choose', '选择具体服务')
    .option('--mock', '单独 mock 数据')
    .action(async (config) => {
      if (fse.existsSync(CONFIG_FILE_NAME)) {
        const globalConfig = JSON.parse(
          fse.readFileSync(CONFIG_FILE_NAME).toString('utf8'),
        );
        const { swaggerPaths, outputFolder } = globalConfig;
        const apiSpecsPathsList: ApiSpecsPathsType[][] = [];
        for (let i = 0; i < swaggerPaths.length; i++) {
          const allConfig = {
            ...swaggerPaths[i],
            ...config,
            globalConfig: globalConfig,
          };
          if (config.mock) {
            doMock(swaggerPaths[i].path, allConfig);
          } else {
            const { apiSpecsPaths, specUrls } = await SwaggerAPI(
              swaggerPaths[i].path,
              {
                ...allConfig,
                output: outputFolder + '/api',
              },
            );
            apiSpecsPathsList.push(apiSpecsPaths);
            const needMock = await chooseNeedMock();
            if (needMock) {
              doMock(swaggerPaths[i].path, { ...allConfig, specUrls });
            }
          }
        }

        // update 更新
        if (apiSpecsPathsList.some((item) => item.length)) {
          const newConfig = {
            ...globalConfig,
            swaggerPaths: globalConfig.swaggerPaths.map(
              (item: any, index: string | number) => {
                if (apiSpecsPathsList[index].length) {
                  return {
                    ...item,
                    apiSpecsPaths: apiSpecsPathsList[index],
                  };
                } else {
                  return item;
                }
              },
            ),
          };

          fse.writeFileSync(
            CONFIG_FILE_NAME,
            JSON.stringify(newConfig, null, 2),
          );
        }
      }
    });
}
