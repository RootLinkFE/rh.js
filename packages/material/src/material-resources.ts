import fse from 'fs-extra';
import path from 'path';
import glob from 'globby';
import {
  RH_MATERIAL_DIR_MATERIALS,
  RH_MATERIAL_DIR_TEMPLATES,
} from './constant';
import { MaterialResourcesConfigType } from './init';
import { MaterialTypeKeys, Material } from './material';
import { InquirePrompt, MaterialPrompt } from './init/prompt';
import inquirer from 'inquirer';
import { InquireMaterialsCollection } from './prompt';
import { RH_MATERIAL_DIR } from './constant';

export type MaterialConfigType = {
  path: string;
  title: string;
  type: string;
  belong?: string; // 归属那套框架下（区块、页面）
  belongLib?: string; // 归属那套库
  namespace?: string;
  name?: string;
  key: string;
  description?: string;
  features?: string[];
  tags?: string[];
  img: string;
  private?: boolean;
  dependencies?: string[];
  materialDeps?: string[]; // 物料依赖
};

export type MaterialResource = {
  scaffolds: string[];
  pages: string[];
  blocks: string[];
};

type MaterialType = {
  name: string;
  description: string;
  lists: Array<MaterialListType>;
};

type MaterialListType = {
  name: string;
  cnName: string;
  path: string;
};

export class MaterialResources {
  inited = false;
  path: string;
  static materialPrefix = 'material';

  resource = {
    scaffolds: [],
    pages: [],
    blocks: [],
  };
  scaffolds: MaterialConfigType[] = [];
  pages: MaterialConfigType[] = [];
  blocks: MaterialConfigType[] = [];
  prompts: InquirePrompt[] = [];

  constructor(public config: MaterialResourcesConfigType) {
    if (config.localPath) {
      this.path = config.localPath;
    } else {
      const dirPath =
        this.config.belong === 'template'
          ? RH_MATERIAL_DIR_TEMPLATES
          : RH_MATERIAL_DIR_MATERIALS;
      this.path = path.join(dirPath, this.config.name);
    }
    if (fse.existsSync(this.path)) {
      this.inited = true;
    }
  }

  generate(type: 'scaffold' | 'page' | 'block', key: string) {
    return;
  }

  resolveScaffolds(): void {
    this.scaffolds = this.resolveDepResources('scaffold');
  }
  resolvePages(): void {
    this.pages = this.resolveDepResources('page');
  }
  resolveBlocks(): void {
    this.blocks = this.resolveDepResources('block');
  }
  // packagesPath: string = '/packages'
  resolveDepResources(
    type: MaterialTypeKeys,
    pointPrefix: string = 'packages',
  ): MaterialConfigType[] {
    const result: MaterialConfigType[] = [];
    const materialPathReg =
      type !== 'scaffold' ? `${pointPrefix}/*/material.json` : 'material.json';
    const materialFiles = glob.sync(materialPathReg, {
      cwd: this.path,
    });
    materialFiles.forEach((file) => {
      const materialConfigFilePath = path.resolve(path.join(this.path, file));
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const materialConfig: MaterialConfigType = require(materialConfigFilePath);
      materialConfig.path = path.dirname(materialConfigFilePath);
      result.push(materialConfig);
    });
    return result;
  }

  async resolveScaffoldsPrompts() {
    const path = `scaffolds/${MaterialResources.materialPrefix}.json`;
    await this.readFile(path).then((res: any) => {
      const scaffolds = res.map((b: MaterialListType) => b.name);
      this.resource['scaffolds'] = scaffolds;
    });
  }

  async resolveCommonPrompts(materialName: string): Promise<MaterialResource> {
    // await this.resolveScaffoldsPrompts();
    const types = ['blocks', 'pages'];
    const basePath = path.join(RH_MATERIAL_DIR_MATERIALS, materialName);
    const baseMaterialPath = path.join(basePath, 'material.json');
    this.resource = types.reduce((prev: any, curr) => {
      const result: MaterialConfigType[] = [];
      const materialPackagePathReg = `packages/**/${curr}/**/material.json`;
      if (fse.existsSync(baseMaterialPath)) {
      } else {
        const materialFiles = glob.sync(materialPackagePathReg, {
          cwd: basePath,
        });
        materialFiles.forEach((file) => {
          const materialConfigFilePath = path.join(basePath, file);
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          const materialConfig: MaterialConfigType = require(materialConfigFilePath);
          // materialConfig.path = path.dirname(materialConfigFilePath);
          result.push(materialConfig);
        });
      }
      this.resource[curr] = result;
      return this.resource;
    }, this.resource);
    const prompts = new MaterialPrompt(this.resource);
    const promptsCollection = await prompts.inquireCombineMaterial();
    return promptsCollection;
  }

  readFile(fileName: string): Promise<MaterialType> {
    return new Promise((resolve, reject) => {
      fse.readFile(path.join(this.path, fileName), 'utf-8', (err, file) => {
        if (err) {
          return reject(`获取${fileName}列表失败`);
        }
        return resolve(JSON.parse(file));
      });
    });
  }

  readFilesync(fileName: string) {
    const content = fse.readFileSync(path.join(this.path, fileName), 'utf-8');
    return JSON.parse(content);
  }

  // 生成模板 纯命令rh create <name> -t xxx
  async combineResource() {
    const materialPackagePathReg = path.join(
      RH_MATERIAL_DIR_TEMPLATES,
      this.config.name,
    );
    let materialsConfig = this.resolveDepResources('scaffold');
    materialsConfig[0].materialDeps = this.resolveDepPath(
      materialsConfig[0].materialDeps || [],
    );
    // TODO: 暂时默认第一个物料库名字
    const defaultMaterialLib: string =
      (this.config.materialsIncludes && this.config.materialsIncludes[0]) || '';
    return new Material(materialPackagePathReg, this, [], defaultMaterialLib);
  }

  /**
   * 整合资源，1、通过命令式用户交互（询问）；2、传递参数使用直接式命令交互（create <name> -t xxx -l xxx -m xxx）
   * @param libName
   * @param materialsName
   * @returns
   */
  async combineAllResource(
    libName?: string,
    materialsName?: string[] | undefined,
  ) {
    let result;
    const materialPackagePathReg = path.join(
      RH_MATERIAL_DIR_TEMPLATES,
      this.config.name,
    );
    let materialsConfig = this.resolveDepResources('scaffold');

    let _libName: string,
      materialPrompt: MaterialResource = {
        scaffolds: [],
        pages: [],
        blocks: [],
      };
    // 命令包含物料库及物料执行自动创建
    if (libName && materialsName) {
      _libName = libName;
      materialsName.map((m: string) => {
        if (m.indexOf(':') !== -1) {
          const [lib, type, material] = m.split(':');
          return materialPrompt[type].push(m);
        }
        materialPrompt['blocks'].push(m); // 外部资源默认全部block类型
      });
    } else {
      const { materialAns } = await InquireMaterialsCollection(
        this.config.materialsIncludes || [],
      );
      _libName = materialAns;
      materialPrompt = await this.resolveCommonPrompts(materialAns);
    }
    let materialsCollection: Material[] = [];
    const combineMaterialFn = (materials: Material) => {
      console.log(materials.dependencies, 'materials.dependencies')
      materials.dependencies.map((b: Material) => {
        materialsCollection.push(b);
        combineMaterialFn(b);
      });
      return materials;
    };
    materialsConfig.map((materialConfig) => {
      const scaffolds = this.config.name;
      // 获取模板本身依赖
      if (materialConfig.key === scaffolds) {
        materialConfig.materialDeps = this.resolveDepPath(
          materialConfig.materialDeps || [],
        );
        const externalDependencies = this.resolveDepPath(
          this.removeExtraDependencie(materialPrompt),
        );
        // result = new Material(materialConfig.path, this, externalDependencies)
        result = combineMaterialFn(
          new Material(
            materialPackagePathReg,
            this,
            externalDependencies,
            _libName,
          ),
        );
        result.dependencies = this.removeRepeatDependencie(materialsCollection);
      }
    });
    return result;
  }

  // 去除交互选择的重复依赖
  removeExtraDependencie(prompts: any): string[] {
    const dependencies: string[] = [];
    ['pages', 'blocks'].map((who) => {
      const deps = prompts[who] || [];
      deps.map((dep: string) => {
        dependencies.push(dep);
      });
    });
    return [...new Set(dependencies)];
  }

  // 重组依赖中指定路径
  resolveDepPath(dependencies: string[]) {
    const result = dependencies.map((dep) => {
      // 标准依赖格式按照 belongLib:type:name
      if (dep.indexOf(':') !== -1) {
        const [belongLib, type, name] = dep.split(':');
        return `packages/${belongLib}/src/${type}/${name}`;
      }
      return dep;
    });
    return result;
  }

  // 去除嵌套中的重复依赖
  removeRepeatDependencie(collcetions: Material[]): Material[] {
    let obj = {};
    let dependencies: Material[] = collcetions.reduce(function (
      item: Material[],
      next: Material,
    ) {
      const { type, belong, name } = next.info; // key 为所有框架必有的字段，
      const objKey = `${type}/${belong}/${name}`;
      obj[objKey] ? '' : (obj[objKey] = true && item.push(next));
      return item;
    },
    []);
    return dependencies;
  }
}
