import { MaterialResourcesConfigType } from '.';
import queue from 'queue';
import fse from 'fs-extra';
import chalk from 'chalk';
import path from 'path';
import execa from 'execa';
import { RH_MATERIAL_DIR } from '../constant';
import { getLogger } from '../index';
import { MaterialResources } from '../material-resources';

export function cloneMaterials(materials: MaterialResources[]): Promise<void> {
  return new Promise((resolve, reject) => {
    const q = new queue();
    /* material.manifests.forEach((item) => {
      if (fse.existsSync(path.join(RH_MATERIAL_DIR, item.name))) {
        // TODO 检查代码是否最新？或者只是个假的git目录？
      } else {
        q.push(async () => {
          await downloadManifest(item);
        });
      }
    }); */

    materials.forEach((material) => {
      q.push(async () => {
        q.push(async () => {
          await downloadManifest(material);
        });
      });
    });

    q.on('success', () => {
      resolve();
    });
    q.on('error', (err: Error) => {
      reject(err);
    });
    q.start();
  });
}

export async function downloadManifest(
  material: MaterialResources,
  logger: (msg: string) => void = console.log,
): Promise<void> {
  try {
    logger(chalk.red.bold(`开始初始化 ${material.config.name} 物料库`));
    await execa(
      'git',
      ['clone', '--depth', '1', material.config.git!, material.config.name],
      {
        cwd: RH_MATERIAL_DIR,
        stdio: 'inherit',
      },
    );
    logger(chalk.green.bold(`${material.config.name} 物理库初始化成功`));
  } catch (err) {
    console.error(err);
    throw err;
  }
}
