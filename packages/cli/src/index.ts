import { loadContext } from '@rh/shared';
import commander from 'commander';
import path from 'path';

const program = new commander.Command('rh');

program
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  .version(require('../package.json').version, '-v, --version')
  .description('Todo')
  .usage('<command> [options]');

loadContext(path.resolve(path.join(__dirname, './commands'))).forEach(
  (command) => {
    command.default(program);
  },
);

program.parse(process.argv);

if (process.argv.length < 3) program.outputHelp();
