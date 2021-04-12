import fse from 'fs-extra';
import path from 'path';
import glob from 'globby';
import { RH_MATERIAL_DIR } from './constant';
import { MaterialResourcesConfigType } from './init';
import { MaterialTypeKeys, Material } from './material';
import { InquirePrompt, MaterialPrompt } from './init/prompt';
import inquirer from 'inquirer';

export type MaterialConfigType = {
  path: string;
  title: string;
  type: string;
  belong?: string; // 归属那套框架下（区块、页面）
  namespace?: string;
  name?: string;
  key: string;
  description?: string;
  features?: string[];
  tags?: string[];
  img: string;
  private?: boolean;
  dependencies?: string[];
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
  static materialPrefix = 'material-';

  resource = {
    scaffolds: [],
    pages: {},
    blocks: {},
  };
  scaffolds: MaterialConfigType[] = [];
  pages: MaterialConfigType[] = [];
  blocks: MaterialConfigType[] = [];
  prompts: InquirePrompt[] = [];

  constructor(public config: MaterialResourcesConfigType) {
    if (config.localPath) {
      this.path = config.localPath;
    } else {
      this.path = path.join(RH_MATERIAL_DIR, this.config.name);
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

  resolveDepResources(type: MaterialTypeKeys): MaterialConfigType[] {
    const result: MaterialConfigType[] = [];
    const materialFiles = glob.sync(`${type}s/*/material.json`, {
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
    const path = `scaffolds/${MaterialResources.materialPrefix}scaffolds.json`;
    await this.readFile(path).then((res: any) => {
      const scaffolds = res.map((b: MaterialListType) => b.name);
      this.resource['scaffolds'] = scaffolds;
    });
  }

  async resolveCommonPrompts() {
    await this.resolveScaffoldsPrompts();
    const types = ['blocks', 'pages'];
    this.resource = types.reduce((prev: any, curr) => {
      const path = `${curr}/${MaterialResources.materialPrefix}${curr}.json`;
      this.resource[curr] = this.readFilesync(path);
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

  // 整合资源
  async combineResource() {
    let result;
    const materialsConfig = this.resolveDepResources('scaffold');
    const materialPrompt = await this.resolveCommonPrompts();
    let materialsCollection: Material[] = [];
    const combineMaterialFn = (materials: Material) => {
      materials.dependencies.map((b: Material) => {
        materialsCollection.push(b);
        combineMaterialFn(b);
      });
      return materials;
    };
    materialsConfig.map((materialConfig) => {
      const scaffolds = materialPrompt['scaffolds'];
      // 获取模板本身依赖
      if (materialConfig.key === scaffolds) {
        const externalDependencies = this.removeExtraDependencie(
          materialPrompt,
        );
        // result = new Material(materialConfig.path, this, externalDependencies)
        result = combineMaterialFn(
          new Material(materialConfig.path, this, externalDependencies),
        );
        result.dependencies = this.removeRepeatDependencie(materialsCollection);
      }
    });
    return result;
  }

  // 去除交互选择的重复依赖
  removeExtraDependencie(prompts: any): string[] {
    const { scaffolds } = prompts;
    const dependencies: string[] = [];
    ['pages', 'blocks'].map((who) => {
      const deps = prompts[who];
      deps.map((dep: string) => {
        dependencies.push(`${who}/${scaffolds}/${dep}`);
      });
    });
    return dependencies;
  }

  // 去除嵌套中的重复依赖
  removeRepeatDependencie(collcetions: Material[]): Material[] {
    let obj = {};
    let dependencies: Material[] = collcetions.reduce(function (
      item: Material[],
      next: Material,
    ) {
      const { type, belong, name } = next.info;
      const key = `${type}/${belong}/${name}`;
      obj[key] ? '' : (obj[key] = true && item.push(next));
      return item;
    },
    []);
    return dependencies;
  }
}
