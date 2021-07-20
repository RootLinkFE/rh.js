import commander from 'commander';
import ora from 'ora';
import chalk from 'chalk';
import { MaterialResourcesCollection } from '@roothub/material/lib/material-resources-collection';

const cwd = process.cwd();

export default function InitCommand(program: commander.Command) {
  program
    .command('init')
    .description('初始化本地物料库')
    .option('-l --list', '列出脚手架')
    // .option('--local [dir]', '指定特定的本地物料库')
    .action(async (options) => {
      const spinner = ora('初始化物料库…').start();
      const materialResourcesCollection = new MaterialResourcesCollection(
        options,
      );
      await materialResourcesCollection.init();
      spinner.stop();
      if (options.list) {
        const lists = materialResourcesCollection.listAllManifest();
        console.log(
          `模板: ${chalk.blue('template')}:, 物料库: ${chalk.green(
            'material',
          )} \n`,
        );
        lists.map((list: any) => {
          const { name, belong, description } = list;
          console.log(
            `${
              belong === 'template' ? chalk.blue(belong) : chalk.green(belong)
            }:${name}(${description})`,
          );
        });
        console.log('\n');
      }
    });
}
