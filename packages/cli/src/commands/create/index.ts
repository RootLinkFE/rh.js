import commander from 'commander';
import ora from 'ora';
import os from 'os';
import fse from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import { MaterialResourcesCollection } from '@roothub/material/lib/material-resources-collection';
import { clearConsole } from '../../utils/logger';
import { fileReg } from '../../utils/const';

const cwd = process.cwd();

// 命令create：1、选已有模板，2、多选物料选项，3、组装
export default function InitCommand(program: commander.Command) {
  program
    .command('create <project-name>')
    .description('根据模板和物料库创建项目')
    .option('-t --template [template]', '指定模板')
    .option(
      '-l --lib [lib]',
      '指定物料库，命令须有模板(-t)和物料(-m)的前提下才生效',
    )
    .option(
      '-m --material [material]',
      '指定物料,命令须有模板(-t)和物料库(-l)的前提下才生效,多个物料用逗号或斜杠隔开',
    )
    .option('-p --path [path]', '新项目文件位置')
    // .option('--local [dir]', '指定特定的本地物料库')
    .action(async (projectName, options) => {
      const pointPath = options.path;
      if (pointPath) {
        if (!fileReg.test(pointPath)) {
          return console.log(
            chalk.bgRed(`请输入正确的文件路径格式，${pointPath}`),
          );
        }
        if (!fse.existsSync(pointPath)) {
          return console.log(chalk.bgRed(`指定路径不存在，${pointPath}`));
        }
      }
      const dirPath = path.join(pointPath || cwd, projectName);
      if (fse.existsSync(dirPath))
        return console.log(
          chalk.bgRed(`项目名称${projectName}已存在，请勿重复创建`),
        );
      // const spinner = ora('检查物料库…').start();
      console.log('检查物料库…');
      const materialResourcesCollection = new MaterialResourcesCollection(
        options,
      );
      const projectPath = options.path || '';

      const isInit = await materialResourcesCollection.init();
      // spinner.stop();
      if (isInit) {
        console.log(
          chalk.bgGreen('初始化/更新本地物料库完成，请重新执行create命令'),
        );
        try {
          process.exit(0);
        } finally {
          return;
        }
      }

      let materialResult;
      const template = options.template;
      if (template) {
        const lib = options.lib;
        const material = options.material;
        if (lib && material) {
          materialResourcesCollection.getFinalMaterial(
            projectName,
            projectPath,
            template,
            lib,
            material,
          );
        } else {
          materialResourcesCollection.getFinalMaterial(
            projectName,
            projectPath,
            template,
          );
        }
      } else {
        materialResult = await materialResourcesCollection.getFinalMaterial(
          projectName,
          projectPath,
        );
      }
      materialResourcesCollection.listAllScaffolds();
    });
}
