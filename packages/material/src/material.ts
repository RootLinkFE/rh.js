import fse from 'fs-extra';
import path from 'path';
import glob from 'globby';
import { MATERIAL_INFO_FILE_NAME } from './constant';
import { MaterialResources, MaterialConfigType } from './material-resources';
import { materialFactory } from './init/material-factory';

export type MaterialTypeKeys = 'page' | 'block' | 'scaffold';

export class Material {
  info: MaterialConfigType | undefined;
  dependencies: Material[] = [];

  constructor(
    protected materialItemPath: string,
    protected materialResources: MaterialResources,
  ) {
    this.check();
    this.loadDependencies();
  }

  render(source: string, additionalData = {}, ejsOptions = {}) {
    const baseDir = extractCallDir();
    source = path.resolve(baseDir, source);
  }

  private loadDependencies() {
    if (this.info?.dependencies?.length) {
      this.info?.dependencies.forEach((dependency) => {
        const dependencyMaterial = materialFactory(
          path.join(this.materialResources.path, dependency),
          this.materialResources,
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
    if (!fse.existsSync(this.materialItemPath)) {
      throw new Error('物料资源未能找到:' + this.materialItemPath);
    }
    this.info = require(path.join(
      this.materialItemPath,
      MATERIAL_INFO_FILE_NAME,
    ));
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
