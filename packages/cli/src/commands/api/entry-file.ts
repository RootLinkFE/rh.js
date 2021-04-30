import path from 'path';
import fs from 'fs';
import prettier from 'prettier';
import inquirer from 'inquirer';
export default class EntryFile {
  files: string[] = [];
  imports: string[] = [];
  exports: string[] = [];
  ext: string = 'ts';
  hasConfig: boolean = false;
  constructor(private config: any) {
    if (config.toJS) {
      this.ext = 'js';
    }
    if (config.axiosConfig) {
      this.hasConfig = true;
    }
  }
  importAxiosConfig() {
    const axiosConfig: string = this.config.axiosConfig;
    if (!axiosConfig) return '';
    let configPath;
    if (axiosConfig.startsWith('@')) {
      configPath = axiosConfig;
    } else {
      configPath = path.relative(
        this.config.output,
        path.resolve(process.cwd(), axiosConfig),
      );
    }
    return `import axiosConfig from '${configPath}';`;
  }
  async genFile(basePath: string) {
    const indexFilePath = path.join(basePath, 'index.' + this.ext);
    if (fs.existsSync(indexFilePath)) {
      const { ok } = await inquirer.prompt([
        {
          name: 'ok',
          type: 'confirm',
          message: `目录下已存在 index.${this.ext} ，是否覆盖?`,
          default: false,
        },
      ]);
      if (!ok) return;
    }
    this.imports.push(this.importAxiosConfig());
    this.files.forEach((file) => {
      const fileO = path.parse(file);
      if (['http-client', 'data-contracts'].includes(fileO.name)) return;
      this.imports.push(`import { ${fileO.name} } from './${fileO.name}'\r\n`);
      this.exports.push(
        `${fileO.name}: new ${fileO.name}(${
          this.hasConfig ? 'axiosConfig' : ''
        }),`,
      );
    });

    const code = `
    ${this.imports.join('')}

    export const APIS = {
      ${this.exports.join('')}
    }
    `;
    const outputPath = path.join(basePath, 'index.' + this.ext);
    const prettierConfig = await prettier.resolveConfig(process.cwd());

    fs.writeFileSync(
      outputPath,
      prettier.format(code, { ...prettierConfig, filepath: outputPath }),
    );
  }
}
