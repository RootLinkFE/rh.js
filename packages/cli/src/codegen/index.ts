import commander from 'commander';
import { loadContext } from '../utils/module-utils';
import path from 'path';

function registerCodegenCommand() {
  /**
   * 代码生成相关命令
   * @param program
   */
  const codegen = new commander.Command('codegen');
  loadContext(path.resolve(path.join(__dirname, './commands'))).forEach(
    (command: any) => {
      command.default(codegen);
    },
  );
  return codegen;
}

export default registerCodegenCommand;
