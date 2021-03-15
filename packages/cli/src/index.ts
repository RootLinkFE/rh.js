import commander from 'commander';

import InitBuildProgram from './actions/create/program';

const program = new commander.Command('rh');

program
  .version(require('../package.json').version, '-v, --version')
  .description('Todo')
  .usage('<command> [options]');

InitBuildProgram(program);

program.parse(process.argv);

if (process.argv.length < 3) program.outputHelp();
