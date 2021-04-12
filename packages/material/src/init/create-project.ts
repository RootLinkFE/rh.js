import queue from 'queue';
import fse from 'fs-extra';
import path from 'path';
import { RH_MATERIAL_DIR } from '../constant';
import chalk from 'chalk';
import { copyFile, delDir } from '../utils/common';
import { Material } from '../material';

const cwd = process.cwd();

export function createProject(projectName: string, config: Material) {
  const { info, materialResources, dependencies } = config;
  const originPath = info?.path || '';
  const materialName = materialResources?.config?.name || 'rh-materials';
  const scaffoldsBasePath = path.join(
    RH_MATERIAL_DIR,
    materialName,
    info?.bus[0],
  );
  const targetPath = path.join(cwd, projectName);
  // 模板文件
  copyFile(originPath, targetPath);
  // 公共文件
  copyFile(scaffoldsBasePath, targetPath);
  // 添加对应物料
  createMaterial(targetPath, dependencies);
  console.log(chalk.green(`${projectName}项目创建成功`));
}

// 创建物料
function createMaterial(targetPath: string, dependencies: Material[]) {
  const srcPath = path.join(targetPath, 'src');
  if (!fse.existsSync(srcPath)) {
    console.log(chalk.red(`物料创建失败，原因：src目录不存在`));
    return;
  }
  const materialsPath = path.join(srcPath, 'materials');
  fse.mkdirSync(materialsPath);
  dependencies.map((dep) => {
    const depType = dep.info?.type;
    const depName = dep.info?.name;
    const depPath = dep.materialItemPath;
    const targetPath = path.join(materialsPath, depType, depName);
    copyFile(depPath, targetPath);
  });
}
