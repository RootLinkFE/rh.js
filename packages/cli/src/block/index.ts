import commander from 'commander';
import getGitRootPath from '../utils/getGitRootPath';
import rhBlockInsert from './main';

function registerBlockCommand() {
  /**
   * 区块物料相关命令
   * @param program
   */
  const block = new commander.Command('block').description(
    '根据包名下载和使用物料',
  );
  block
    .command('use <pkgName>')
    .description('根据包名下载和使用物料')
    .action(async (packageName, config) => {
      const projectDir = getGitRootPath();
      console.log(projectDir);
      await rhBlockInsert(packageName);
    });
  return block;
}

export default registerBlockCommand;
