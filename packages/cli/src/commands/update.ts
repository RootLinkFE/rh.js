const { exec } = require('child_process');
import commander from 'commander';

export default function initCommandUpdate(program: commander.Command) {
  program
    .command('update')
    .alias('u')
    .description('更新到最新版本')
    .action((options) => {
      console.log('@roothub/cli 更新中...');
      exec(
        'npm i -g @roothub/cli@latest',
        (err: any, stdout: any, stderr: any) => {
          if (err) {
            console.log('@roothub/cli 更新失败', err);
            return;
          }
          console.log('@roothub/cli 更新完成');
        },
      );
    });
}
