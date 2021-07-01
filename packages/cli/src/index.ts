import { loadContext, compareVersion } from '@roothub/shared';
import commander from 'commander';
import path from 'path';
import updateNotifier from './utils/update-notifier';

const { version } = require('../package.json');

const program = new commander.Command('rh');

program
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  .version(version, '-v, --version')
  .description('Todo')
  .usage('<command> [options]');

loadContext(path.resolve(path.join(__dirname, './commands'))).forEach(
  (command) => {
    command.default(program);
  },
);

updateNotifier().then(() => {
  program.parse(process.argv);
  if (process.argv.length < 3) program.outputHelp();
});
