import path from 'path';
import fs from 'fs';
import prettier from 'prettier';
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
  genFile(basePath: string) {
    this.imports.push(this.importAxiosConfig());
    this.files.forEach((file) => {
      const fileO = path.parse(file);
      this.imports.push(
        `import { Api as ${fileO.name} } from './${fileO.name}'\r\n`,
      );
      this.exports.push(
        `${fileO.name}: new ${fileO.name}(${
          this.hasConfig ? 'axiosConfig' : ''
        }),`,
      );
    });

    const code = `
    ${this.imports.join('')}

    export default {
      ${this.exports.join('')}
    }
    `;
    fs.writeFileSync(
      path.join(basePath, 'index.' + this.ext),
      prettier.format(code),
    );
  }
}
