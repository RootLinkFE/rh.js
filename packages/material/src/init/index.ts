import fse from 'fs-extra';
import path from 'path';
import yaml from 'yaml';
import {
  RH_MATERIAL_CONFIG,
  RH_MATERIAL_DIR,
  RH_MATERIAL_DIR_TEMPLATES,
  RH_MATERIAL_DIR_MATERIALS,
} from '../constant';

export type ResourceConfigType<T> = {
  templates: T[];
  materials: T[];
};

export type MaterialResourcesConfigType = {
  name: string;
  git?: string;
  description: string;
  localPath?: string;
  belong?: string;
  materialsIncludes?: Array<string>;
};

export type LocalMaterialsType = 'init' | 'update' | 'updated';

export function isInit(): boolean {
  return fse.existsSync(RH_MATERIAL_DIR) && fse.existsSync(RH_MATERIAL_CONFIG);
}

export function loadCliManifestConfig(): ResourceConfigType<MaterialResourcesConfigType> {
  if (!fse.existsSync(RH_MATERIAL_DIR)) {
    fse.mkdirSync(RH_MATERIAL_DIR);
  }
  fse.copyFileSync(
    path.join(__dirname, '../../manifest.default.json'),
    RH_MATERIAL_CONFIG,
  );

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const config = require(RH_MATERIAL_CONFIG);

  return config;
}

export function readLocalManifestConfig(): ResourceConfigType<MaterialResourcesConfigType> {
  const config = require(RH_MATERIAL_CONFIG);
  return config;
}

// 判断脚手架manifest和本地物料库是否一致，判断是否更新物料库
export function compareLocalMaterials(): Promise<LocalMaterialsType> {
  return new Promise(async (resolve, reject) => {
    if (!fse.existsSync(RH_MATERIAL_DIR)) {
      return resolve('init');
    }
    let materialsCollectionName: string[] = [];
    let localMaterialsName: string[] = [];
    await fse.readFile(
      path.join(__dirname, '../../manifest.default.json'),
      'utf-8',
      (err, file) => {
        if (err) {
          console.log(`获取脚手架manifest.default.json失败，原因：${err}`);
          return reject();
        }
        const materialCollection = JSON.parse(file) || {};

        Object.keys(materialCollection).map((key) => {
          materialCollection[key].map((m: MaterialResourcesConfigType) => {
            materialsCollectionName.push(m.name);
          });
        });
        if (fse.existsSync(RH_MATERIAL_DIR_TEMPLATES)) {
          const templatesName = fse.readdirSync(RH_MATERIAL_DIR_TEMPLATES);
          localMaterialsName = [...localMaterialsName, ...templatesName];
        }
        if (fse.existsSync(RH_MATERIAL_DIR_MATERIALS)) {
          const materialsName = fse.readdirSync(RH_MATERIAL_DIR_MATERIALS);
          localMaterialsName = [...localMaterialsName, ...materialsName];
        }
        if (materialsCollectionName.length > localMaterialsName.length)
          return resolve('update');
        return resolve('updated');
      },
    );
  });
}
