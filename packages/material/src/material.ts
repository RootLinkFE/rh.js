import fse from 'fs-extra';
import path from 'path';
import glob from 'globby';
import { MATERIAL_INFO_FILE_NAME, RH_MATERIAL_DIR_MATERIALS } from './constant';
import { MaterialResources, MaterialConfigType } from './material-resources';
import { materialFactory } from './init/material-factory';
import { lookUpFile } from './utils/common';

export type MaterialTypeKeys = 'page' | 'block' | 'scaffold';

export class Material {
  info: MaterialConfigType | any;
  dependencies: Material[] = [];
  materialResources: MaterialResources;
  materialItemPath: string;
  materialName: string | any;

  constructor(
    materialItemPath: string,
    materialResources: MaterialResources,
    private externalDependencies?: string[],
    materialName?: string,
  ) {
    this.materialResources = materialResources;
    this.materialItemPath = materialItemPath;
    this.materialName = materialName;
    this.check();
    this.loadDependencies();
  }

  render(source: string, additionalData = {}, ejsOptions = {}) {
    const baseDir = extractCallDir();
    source = path.resolve(baseDir, source);
  }

  private loadDependencies() {
    if (this.info?.materialDeps?.length) {
      this.info?.materialDeps.forEach((dependency: any) => {
        const dependencyMaterial = materialFactory(
          path.join(RH_MATERIAL_DIR_MATERIALS, this.materialName, dependency),
          this.materialResources,
          [],
          dependency,
        );
        if (!dependencyMaterial) {
          throw new Error(
            '未找到依赖:' + path.join(this.materialResources.path, dependency),
          );
        }
        this.dependencies.push(dependencyMaterial);
      });
    }
  }

  private check(): void {
    this.info = {};
    if (!fse.existsSync(this.materialItemPath)) {
      throw new Error('物料资源未能找到:' + this.materialItemPath);
    }
    // this.info = require(path.join(
    //   this.materialItemPath,
    //   MATERIAL_INFO_FILE_NAME,
    // ));
    this.info = lookUpFile(MATERIAL_INFO_FILE_NAME, this.materialItemPath);
    const isThirdLibBlocks = this.info.list && this.info.list['blocks'];
    if (isThirdLibBlocks) {
      isThirdLibBlocks.map((b: any) => {
        if (b.key === this.materialName) {
          this.info = b;
        }
      });
    }
    this.info.materialDeps =
      this.externalDependencies && this.externalDependencies.length
        ? Array.from(
            new Set([...this.info.materialDeps, ...this.externalDependencies]),
          )
        : this.info.materialDeps || [];
    // console.log(
    //   this.info,
    //   path.join(this.materialItemPath, MATERIAL_INFO_FILE_NAME),
    // );
  }
}

function extractCallDir() {
  // extract api.render() callsite file location using error stack
  const obj: any = {};
  Error.captureStackTrace(obj);
  const callSite = obj.stack.split('\n')[3];

  // the regexp for the stack when called inside a named function
  const namedStackRegExp = /\s\((.*):\d+:\d+\)$/;
  // the regexp for the stack when called inside an anonymous
  const anonymousStackRegExp = /at (.*):\d+:\d+$/;

  let matchResult = callSite.match(namedStackRegExp);
  if (!matchResult) {
    matchResult = callSite.match(anonymousStackRegExp);
  }

  const fileName = matchResult[1];
  return path.dirname(fileName);
}
