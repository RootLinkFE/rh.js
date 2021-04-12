const fs = require('fs');
const fse = require('fs-extra');
const path = require('path');
const os = require('os');
const cwd = process.cwd();

/**
 * 复制文件夹
 *
 * @param {String} templateDir 源目录
 * @param {String} projectDir 目标目录
 * @returns
 */
export function copyFile(templateDir: string, projectDir: string) {
  fse.ensureDirSync(projectDir);
  fse.copySync(templateDir, projectDir);
}

/**
 * 创建目录
 *
 * @param {String} templateDir 源目录
 * @param {String} probjectDir 源目录
 * @param {String} iframe 框架类型
 * @returns
 */
export function mkFile(
  templateDir: string,
  probjectDir: string,
  iframe: string,
) {
  const templateDirList = fs.readdirSync(templateDir); // 根据用户传入参数从模版目录找到对应模版
  templateDirList.map((dirName: string) => {
    if (/(\.git|\.DS_Store)/gi.test(dirName)) {
      return;
    }
    const dirPath = path.join(templateDir, dirName);
    if (checkDir(dirPath)) {
      const dirExt = dirPath.split(
        path.join(path.dirname(cwd), `./templates/${iframe}`),
      )[1];
      fs.mkdirSync(probjectDir + dirExt);
      mkFile(dirPath, probjectDir, iframe);
    } else {
      const reg = new RegExp(`\/` + iframe + `\/`);
      const copyDistPath = `${probjectDir}/${dirPath.split(reg)[1]}`;
      fs.copyFileSync(dirPath, copyDistPath);
    }
  });
}

/**
 * 检查传入路径是否为目录
 *
 * @param {String} targetDir 目标目录
 * @returns
 */
export function checkDir(targetDir: string) {
  if (fs.statSync(targetDir).isDirectory()) {
    return true;
  } else {
    return false;
  }
}

/**
 * 删除某个目录下的所有文件
 *
 * @param {String} target 目标目录
 * @returns
 */
export function delDir(target: string) {
  // 判断目录是否存在
  if (fs.existsSync(target)) {
    // 遍历目录下存在的文件 / 目录
    const targetList = fs.readdirSync(target);
    if (targetList.length > 0) {
      // 计数器，用于判断是否删除当前目录
      let count = 0;
      let configFlag = false; // 不对dist/config.json进行删除
      targetList.map((dirName: string) => {
        count++; // 每遍历一项就加一
        if (checkDir(`${target}/${dirName}`)) {
          // 目录，则递归
          delDir(`${target}/${dirName}`);
        } else {
          configFlag = dirName === 'config.json' ? true : false;
          // 文件，则删除
          if (!configFlag) {
            fs.unlinkSync(`${target}/${dirName}`);
          }
        }
      });
      // 当计数器等于当前目录的文件/目录加起来的总值，则删除当前目录
      if (count === targetList.length && !configFlag) {
        fs.rmdirSync(target);
      }
    } else {
      fs.rmdirSync(target);
    }
  } else {
    console.log('该目录不存在: ', target);
  }
}
