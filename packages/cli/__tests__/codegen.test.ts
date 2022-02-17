'use strict';

import { init, config } from '../src/codegen/subCommands/init';
import { update } from '../src/codegen/subCommands/update';
import { CONFIG_FILE_NAME } from '../src/codegen/constants';
import fse from 'fs-extra';
import path from 'path';

function testPath(pathSet: {}) {
  const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];

  const result = Object.keys(pathSet).some((item) => {
    const [method] = item.split(' ');

    return methods.indexOf(method.toUpperCase()) === -1;
  });
  return !result;
}

function removeDir(dir: string) {
  let files = fse.readdirSync(dir);
  for (let i = 0; i < files.length; i++) {
    let newPath = path.join(dir, files[i]);
    let stat = fse.statSync(newPath);
    if (stat.isDirectory()) {
      //如果是文件夹就递归下去
      removeDir(newPath);
    } else {
      //删除文件
      fse.unlinkSync(newPath);
    }
  }
  fse.rmdirSync(dir); //如果文件夹是空的，就将自己删除掉
}

describe('rh codegen update', () => {
  const dir = './testCodegen';
  init({
    swaggerPaths: [
      {
        name: 'pet-store',
        path: 'https://petstore.swagger.io/v2/swagger.json',
        group: false,
      },
    ],
    outputFolder: dir, // 代码输出目录
    mockConfig: {
      outputFolder: dir, // mock 文件输出目录
      ext: '.js', // 后缀名
      independentServer: false, // 生成 entry-mock[ext] 文件 (入口)
    },
    codegenTest: true,
  });
  test('test rh codegen update --all', async () => {
    try {
      await update({ all: true, mock: false });
      const mockDir = dir + '/mock';

      const files = await fse.readdir(mockDir);
      const ext = '.js';
      const extReg = new RegExp(`${ext}`, 'g');
      const filteredFiles = files.filter(
        (name) => extReg.test(name) && name.indexOf('entry-mock' + ext) === -1,
      );
      let result = true;

      for (let i = 0; i < filteredFiles.length; i++) {
        const file = await require(path.resolve(
          process.cwd(),
          mockDir,
          filteredFiles[i],
        ));
        result = testPath(file);
        if (!result) {
          break;
        }
      }
      expect(result).toBeTruthy();
    } finally {
      if (fse.existsSync(dir)) {
        removeDir(dir);
      }
      if (fse.existsSync(CONFIG_FILE_NAME)) {
        fse.unlinkSync(CONFIG_FILE_NAME);
      }
    }
  });
});
