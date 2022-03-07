import commander from 'commander';
import ora from 'ora';
import fse from 'fs-extra';
import path from 'path';
import { MaterialResourcesCollection } from '@roothub/material/lib/material-resources-collection';
import { isExistRootDir, RH_MATERIAL_DIR } from '../../utils/const';

const cwd = process.cwd();

export default function InitCommand(program: commander.Command) {
  program
    .command('init')
    .description('初始化本地物料库')
    // .option('--local [dir]', '指定特定的本地物料库')
    .action(async (options) => {
      isExistRootDir()
      console.log(`初始化成功，物料缓存地址：${RH_MATERIAL_DIR}`);
    });
}
