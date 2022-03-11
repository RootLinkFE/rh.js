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
