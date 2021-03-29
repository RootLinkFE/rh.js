import fse from 'fs-extra';
import path from 'path';
import glob from 'globby';
import { RH_MATERIAL_DIR } from './constant';
import { MaterialResourcesConfigType } from './init';
import { MaterialTypeKeys } from './material';

export type MaterialConfigType = {
  path: string;
  title: string;
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

export class MaterialResources {
  inited = false;
  path: string;

  scaffolds: MaterialConfigType[] = [];
  pages: MaterialConfigType[] = [];
  blocks: MaterialConfigType[] = [];

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
    this.scaffolds = this.resolveResources('scaffold');
  }
  resolvePages(): void {
    this.pages = this.resolveResources('page');
  }
  resolveBlocks(): void {
    this.blocks = this.resolveResources('block');
  }

  resolveResources(type: MaterialTypeKeys): MaterialConfigType[] {
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
}
