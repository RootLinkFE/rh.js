import { MaterialResourcesConfigType } from '.';
import queue from 'queue';
import fse from 'fs-extra';
import chalk from 'chalk';
import path from 'path';
import execa from 'execa';
import { RH_MATERIAL_DIR } from '../constant';
import { getLogger } from '../index';
import { MaterialResources } from '../material-resources';

export function cloneMaterials(
  materials: MaterialResources[],
  type: string,
): Promise<void> {
  return new Promise(async (resolve, reject) => {
    // const q = new queue();
    /* material.manifests.forEach((item) => {
      if (fse.existsSync(path.join(RH_MATERIAL_DIR, item.name))) {
        // TODO 检查代码是否最新？或者只是个假的git目录？
      } else {
        q.push(async () => {
          await downloadManifest(item);
        });
      }
    }); */

    for (let item of materials) {
      await downloadManifest(item, type);
    }
    return resolve();

    // materials.reduce(async (prev, curr) => {
    //   return await downloadManifest(curr, type);
    // }, Promise.resolve());
    // return resolve();

    // for (let i = 0; i < materials.length; ++i) {
    //   console.log(i)
    //   const material = materials[i]
    //   await downloadManifest(material, type);
    // }
    // resolve();

    // materials.forEach((material) => {
    //   q.push(async () => {
    //     q.push(async () => {
    //       await downloadManifest(material, type);
    //     });
    //   });
    // });

    // q.on('success', () => {
    //   resolve();
    // });
    // q.on('error', (err: Error) => {
    //   reject(err);
    // });
    // q.start();
  });
}

export async function downloadManifest(
  material: MaterialResources,
  type: string,
  logger: (msg: string) => void = console.log,
): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      if (!fse.existsSync(`${RH_MATERIAL_DIR}/${type}s`)) {
        fse.mkdirSync(`${RH_MATERIAL_DIR}/${type}s`);
      }
      if (
        fse.existsSync(`${RH_MATERIAL_DIR}/${type}s/${material.config.name}`)
      ) {
        return resolve();
      }
      logger(
        chalk.bgYellow.bold(`开始初始化 ${material.config.name} ${type}库`),
      );

      async function promiseFn() {
        return await execa(
          'git',
          ['clone', '--depth=1', material.config.git!, material.config.name],
          {
            cwd: `${RH_MATERIAL_DIR}/${type}s`,
            stdio: 'inherit',
          },
        );
      }

      promiseFn().then(() => {
        logger(chalk.green.bold(`${material.config.name} ${type}库初始化成功`));
        return resolve();
      });
    } catch (err) {
      console.error(err);
      reject();
    }
  });
}
