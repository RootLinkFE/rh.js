import commander from 'commander';
import ora from 'ora';
import chalk from 'chalk';
import { spawn } from 'child_process';
import { listTemplates } from './index';
import execa from 'execa';

export default function buildProgram(program: commander.Command) {
  program
    .command('create [template-name] [project-name]')
    .description('generate a new project from a template')
    .option('-l --list', 'show all templates')
    .action(async (templateName, projectName, options) => {
      if (options.list) {
        const spinner = ora('Loading data').start();
        listTemplates().then(pjs => {
          spinner.stop();
          pjs.forEach(pj => {
            console.log(
              `${chalk.red(pj.name.replace(/^rh-template-/, ''))}  ${
                (pj as any).description
              }`,
            );
          });
        });
      } else if (templateName && projectName) {
        console.log(chalk.green('获取模板…'));
        execa(
          'npx',
          [
            `git+https://gitlab.bighome360.com/frontend/rh/templates/rh-template-${templateName}.git`,
            projectName,
          ],
          {
            stdio: 'inherit',
          },
        );
      }
    });
}
