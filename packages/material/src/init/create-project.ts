import queue from 'queue';
import fse from 'fs-extra';
import path from 'path';
import { RH_MATERIAL_DIR } from '../constant';
import chalk from 'chalk';
import { copyFile, delDir } from '../utils/common';
import { Material } from '../material';

const cwd = process.cwd();

export async function createProject(projectName: string, config: Material) {
  try {
    const { info, materialResources, dependencies } = config;
    const originPath = info?.path || '';
    const materialName = materialResources?.config?.name || 'rh-materials';
    // const scaffoldsBasePath = path.join(
    //   RH_MATERIAL_DIR,
    //   materialName,
    //   info?.bus[0],
    // );
    const targetPath = path.join(cwd, projectName);
    // 模板文件
    copyFile(originPath, targetPath);
    // 公共文件
    // copyFile(scaffoldsBasePath, targetPath);
    // 添加对应物料
    await createMaterial(targetPath, dependencies);
    console.log(chalk.bgGreen(`${projectName}项目创建成功`));
  } catch (error) {
    const dirPath = path.join(cwd, projectName);
    if (fse.existsSync(dirPath)) {
      delDir(dirPath);
    }
    if(!config) {
      return console.log(chalk.bgRed(`${projectName}项目创建失败，原因：缺少material.json文件`));
    }
    return console.log(chalk.bgRed(`${projectName}项目创建失败， 原因：${error}`));
  }
}

// 创建物料
function createMaterial(
  targetPath: string,
  dependencies: Material[],
): Promise<void> {
  const srcPath = path.join(targetPath, 'src');
  if (!fse.existsSync(srcPath)) {
    console.log(chalk.red(`物料创建失败，原因：模板src目录不存在`));
    return Promise.reject();
  }
  const materialsPath = path.join(srcPath, 'materials');
  fse.mkdirSync(materialsPath);
  dependencies.map((dep) => {
    const depType = dep.info?.type;
    const depName = dep.info?.key || dep.info?.name;  // 兼容key作标识
    const depPath = dep.materialItemPath;
    const targetPath = path.join(materialsPath, depType, depName);
    copyFile(depPath, targetPath);
  });
  return Promise.resolve();
}
