import path from 'path';
import fs from 'fs';
import prettier from 'prettier';
import inquirer from 'inquirer';
import chalk from 'chalk';
import { isBoolean } from 'lodash';

export default class EntryFile {
  files: any[] = [];
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

  // 生成index
  async genFile(basePath: string) {
    const indexFilePath = path.join(basePath, 'index.' + this.ext);
    if (fs.existsSync(indexFilePath)) {
      if (this.config.replaceEntryFile === false) {
        // console.log(`${indexFilePath} `, chalk.green('已存在'));
        return;
      }

      if (!isBoolean(this.config.yes) || !this.config.yes) {
        const { ok } = await inquirer.prompt([
          {
            name: 'ok',
            type: 'confirm',
            message: `目录下已存在 index.${this.ext} ，是否覆盖?`,
            default: false,
          },
        ]);
        if (!ok) return;
      } else {
        console.log(`✅   文件：${indexFilePath} `, chalk.green('已覆盖'));
      }
    }

    this.imports.push(this.importAxiosConfig());
    this.files.forEach((file) => {
      // console.log(file);
      const fileName = file.name;
      const resourceName = file.resourceName;
      if (['http-client', 'data-contracts'].includes(file.name)) return;
      this.imports.push(
        `import { ${fileName} as ${resourceName} } from './${file.resourceName}/${fileName}'\r\n`,
      );
      this.exports.push(
        `${resourceName}: new ${resourceName}(${
          this.hasConfig ? 'axiosConfig' : ''
        }),`,
      );
    });

    const code = `
    ${this.imports.join('')}

    const RhApi = {
      ${this.exports.join('')}
    };

    export default RhApi
    `;
    const outputPath = path.join(basePath, 'index.' + this.ext);
    const prettierConfig = await prettier.resolveConfig(process.cwd());
    fs.writeFileSync(
      outputPath,
      prettier.format(code, { ...prettierConfig, filepath: outputPath }),
    );
  }
}
