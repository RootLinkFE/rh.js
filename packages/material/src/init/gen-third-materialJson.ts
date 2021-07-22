import { MaterialResourcesConfigType } from './index';
import { MATERIAL_INFO_FILE_NAME } from '../constant';
const fs = require('fs-extra');
const path = require('path');

export async function genMaterialsJsonFile(item: MaterialResourcesConfigType, materialsDir: string) {
  try {
    const { jsonFile } = item;
    let newJson = { ...item, list: {} };
    const jsonFilePath = path.join(materialsDir, jsonFile);
    let data = await fs.readJson(jsonFilePath);
    const blocks = data.blocks || data.list; // 两种物料的配置不一样
    newJson.list['blocks'] = blockMapping(blocks);
    // 同步成统一规范格式的配置，后续持续直接读此文件
    const dest = path.join(materialsDir, MATERIAL_INFO_FILE_NAME);
    let str = JSON.stringify(newJson, null, '\t');
    await fs.writeFile(dest, str);
  } catch (err) {
    console.error(err);
  }
}

function blockMapping(list = []) {
  const res = list
    ?.filter((v) => v)
    .map(function (v: any) {
      return {
        name: v.name,
        key: v.key,
        description: v.description,
        sourceCode: v.url,
        screenshot: v.img,
        // category: v.tags && v.tags[0],
        category: v.tags,
        tags: v.tags,
        type: v.type || 'blocks',
        dependencies: v.dependencies,
        previewUrl: v.previewUrl,
        downloadPath: v.defaultPath,
      };
    });
  return res;
}
