import chalk from 'chalk';
import lv from 'latest-version';
import semver from 'semver';
import fse from 'fs-extra';
import path from 'path';
import Config from './config';

const { version } = require('../../package.json');

const DAILY = 1000 * 60 * 60 * 24;
const WEEKLY = DAILY * 7;

const updateTimeout = (duration: number) => {
  const t = new Date(Date.now() - duration);
  const f = path.join(Config.rcDir, '.update-notifier-last-checked');
  let st;
  try {
    st = fse.statSync(f);
  } catch (err) {
    st = {
      mtime: 0,
    };
  }
  if (t > st.mtime) {
    fse.writeFileSync(f, '');
    return true;
  } else {
    return false;
  }
};

export default async function UpdateNotifier() {
  try {
    if (!updateTimeout(DAILY)) {
      return Promise.resolve();
    }
    return lv('@rh/cli').then((latestVersion) => {
      if (semver.lt(version, latestVersion)) {
        function exitHandler() {
          console.log();
          console.log(
            chalk.bgBlack.white(`@rh/cli 有新版本 ${latestVersion} 更新了！
  ${version} -> ${latestVersion}
  运行：${chalk.green(`npm install -g @rh/cli@${latestVersion}`)} 进行更新`),
          );
        }

        //do something when app is closing
        process.on('exit', exitHandler);

        //catches ctrl+c event
        process.on('SIGINT', exitHandler);

        // catches "kill pid" (for example: nodemon restart)
        process.on('SIGUSR1', exitHandler);
        process.on('SIGUSR2', exitHandler);

        //catches uncaught exceptions
        process.on('uncaughtException', exitHandler);
      }
    });
  } catch (err) {}
}
