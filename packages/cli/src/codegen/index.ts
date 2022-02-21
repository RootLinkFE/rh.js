import commander from 'commander';
import { loadContext } from '../utils/module-utils';
import path from 'path';

function registerCodegenCommand(): commander.Command {
  /**
   * 代码生成相关命令
   * @param program
   */
  const codegen = new commander.Command('codegen')
    .alias('cg')
    .description('代码生成(API|MOCK)');
  loadContext(path.resolve(path.join(__dirname, './subCommands'))).forEach(
    (command: any) => {
      command.default(codegen);
    },
  );
  return codegen;
}

export default registerCodegenCommand;
