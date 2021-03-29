import commander from 'commander';
import ora from 'ora';
import chalk from 'chalk';
import { MaterialResourcesCollection } from '@rh/material/lib/material-resources-collection';
import { clearConsole } from '../../utils/logger';

export default function InitCommand(program: commander.Command) {
  program
    .command('init [project-name]')
    .description('generate a new project from a scaffold template')
    .option('-l --list', '列出脚手架')
    .option('-a --all', '列出包含私有的脚手架')
    .option('-s --scaffold [material]@[scaffold]', '指定物料库和脚手架')
    .option('--local [dir]', '指定特定的本地物料库')
    .action(async (projectName, options) => {
      console.log('options.list: ', options.local);
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
          .forEach((materialConfig) => {
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
        if (options.scaffold) {
          console.log(
            materialResourcesCollection.getMaterial(
              options.scaffold,
              'scaffold',
            ),
          );
        }
        spinner.stop();
        // console.log(chalk.green('获取模板…'));
        /* execa(
          'npx',
          [
            `git+https://gitlab.bighome360.com/frontend/rh/templates/rh-template-${templateName}.git`,
            projectName,
          ],
          {
            stdio: 'inherit',
          },
        ); */
      } else {
        console.log('[create] should have project-name');
      }
    });
}
