import fs from 'fs';
import path from 'path';

function loadContextDefaultFilter(filePath: string): boolean {
  // 是JS直接返回
  if (/\.js$/.test(filePath)) return true;

  // 文件夹的index.js
  if (
    fs.statSync(filePath).isDirectory() &&
    fs.existsSync(path.join(filePath, 'index.js'))
  ) {
    return true;
  }

  return false
}

export function loadContext(
  dir: string,
  filter = loadContextDefaultFilter,
): any[] {
  const files = fs.readdirSync(dir);
  return files
    .filter((filename) => filter(path.resolve(path.join(dir, filename))))
    .map((filename) => require(path.resolve(path.join(dir, filename))));
}
