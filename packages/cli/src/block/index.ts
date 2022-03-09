import commander from 'commander';
import getGitRootPath from '../utils/getGitRootPath';
import rhBlockInsert, { rhBlockUpdate } from './main';
import chalk from 'chalk';
import ora from 'ora';
import { isExistRootHubDir } from '../utils/file-handler';

function registerBlockCommand() {
  /**
   * 区块物料相关命令
   * @param program
   */
  const block = new commander.Command('block')
    .alias('b')
    .description('根据包名下载和使用物料');

  block
    .command('use <pkgName>')
    .option('-p, --path <pathName>', '物料存放的文件位置, 有“./”前缀代表相对路径，没有则取当前路径')
    .description('根据包名下载和使用物料')
    .action(async (packageName, options) => {
      isExistRootHubDir();
      // const projectDir = getGitRootPath();
      const projectPath = options.path || '';
      await rhBlockInsert(packageName, projectPath);
    });

  block
    .command('update')
    .option('-n, --name <pkgName>', '更新指定物料库名字,如有多个请用逗号隔开')
    .option('-a, --all', '更新全部远程物料库')
    .description('更新物料库')
    .action(async (options) => {
      isExistRootHubDir();
      const { name, all } = options;
      try {
        if (name || all) {
          const nameArr = all ? null : name.split(/[,，]/g);
          await rhBlockUpdate(nameArr);
          console.log('\n');
          return;
        }
        console.log(chalk.red('请添加update属性<--name/--all>'));
      } catch (error) {
        console.log('\n');
        console.log(chalk.red(error));
      } finally {
      }
    });

  return block;
}

export default registerBlockCommand;
