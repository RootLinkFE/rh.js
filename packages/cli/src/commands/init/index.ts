import commander from 'commander';
import ora from 'ora';
import execa from 'execa';
import fse from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import { MaterialResourcesCollection } from '@roothub/material/lib/material-resources-collection';
import { clearConsole } from '../../utils/logger';

const cwd = process.cwd();

// options：获取当前私有物料库rh-materials列表、模板列表
// init project
// inq

// 命令init：1、选已有模板，2、多选物料选项，3、组装

// 命令insert：1、插入物料选项
export default function InitCommand(program: commander.Command) {
  program
    .command('create <project-name>')
    .description('generate a new project from a scaffold template')
    // .option('-l --list', '列出脚手架')
    // .option('-a --all', '列出包含私有的脚手架')
    // .option('-s --scaffold [material]@[scaffold]', '指定物料库和脚手架')
    // .option('--local [dir]', '指定特定的本地物料库')
    .action(async (projectName, options) => {
      // const spinner = ora('初始化物料库…').start();
      // const materialResourcesCollection = new MaterialResourcesCollection(options)
      // await materialResourcesCollection.init();
      // spinner.stop();
      // clearConsole();
      // const templates = materialResourcesCollection.listAllScaffolds(options.all)
      // console.log(
      //   materialResourcesCollection.getFinalMaterial(
      //     options.scaffold,
      //     'scaffold',
      //   )
      // )
      const dirPath = path.join(cwd, projectName);
      if (fse.existsSync(dirPath)) {
        console.log(chalk.red(`项目名称${projectName}已存在，请勿重复创建`));
        return;
      }
      if (options.list || options.all) {
        const spinner = ora('初始化物料库…').start();
        const materialResourcesCollection = new MaterialResourcesCollection(
          options,
        );
        await materialResourcesCollection.init();
        spinner.stop();

        clearConsole();
        materialResourcesCollection
          .listAllScaffolds(options.all)
          .forEach((materialConfig: any) => {
            console.log(
              `${chalk.green.bold(
                `${materialConfig.namespace}@${chalk.yellow(
                  materialConfig.key,
                )}`,
              )}: ${materialConfig.name} - ${materialConfig.description} ${
                materialConfig.private ? chalk.red(`[private]`) : ''
              }`,
            );
          });

        // spinner.stop();
        // /* listTemplates().then((pjs) => {
        //   spinner.stop();
        //   pjs.forEach((pj) => {
        //     console.log(
        //       `${chalk.red(pj.name.replace(/^rh-template-/, ''))}  ${
        //         (pj as any).description
        //       }`,
        //     );
        //   });
        // }); */
      } else if (projectName) {
        const spinner = ora('初始化脚手架…').start();
        const materialResourcesCollection = new MaterialResourcesCollection(
          options,
        );
        await materialResourcesCollection.init();
        spinner.stop();

        let materialResult;
        if (options.scaffold) {
          console.log(
            materialResourcesCollection.getFinalMaterial(
              projectName,
              options.scaffold,
              'scaffold',
            ),
          );
        } else {
          materialResult = await materialResourcesCollection.getFinalMaterial(
            projectName,
          );
        }
        // clearConsole();
        materialResourcesCollection.listAllScaffolds();
        // console.log(materialResourcesCollection);
        // console.log(projectName, chalk.green('获取模板…'));
        // execa(
        //   'npx',
        //   [
        //     `git+https://gitlab.bighome360.com/frontend/rh/materials.git`,
        //     projectName,
        //   ],
        //   {
        //     stdio: 'inherit',
        //   },
        // );
      } else {
        console.log('[create] should have project-name');
      }
    });
}
