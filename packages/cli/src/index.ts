/*
 * @Author: your name
 * @Date: 2022-01-10 18:54:01
 * @LastEditTime: 2022-02-21 15:00:37
 * @LastEditors: your name
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \rh.js\packages\cli\src\index.ts
 */
import commander from 'commander';
import path from 'path';
import { loadContext } from './utils/module-utils';
import updateNotifier from './utils/update-notifier';
import registerBlockCommand from './block';
import registerCodegenComand from './codegen';

const { version } = require('../package.json');

const VALID_SUBCOMMANDS = [
  'api',
  'create',
  'init',
  'create',
  'update',
  'block',
  'codegen',
];
const program = new commander.Command();
// const rh = new commander.Command('rh');

program
  .name('rh')
  .usage('[commands] [options]')
  // .arguments('<cmd>')
  .action((cmd) => {
    if (VALID_SUBCOMMANDS.indexOf(cmd) === -1) {
      console.error('rh', 'Invalid command...');
      program.help();
    }
  });

program
  .version(version, '-v, --version')
  .description('@roothub/cli')
  .usage('<command> [options]');

loadContext(path.resolve(path.join(__dirname, './commands'))).forEach(
  (command: any) => {
    command.default(program);
  },
);

// SubCommands
program.addCommand(registerBlockCommand());
program.addCommand(registerCodegenComand());

updateNotifier().then(() => {
  program.parse(process.argv);
  if (process.argv.length < 3) program.outputHelp();
});
