import fse from 'fs-extra';
import os from 'os';
import path from 'path';

export const fileReg = /^[a-zA-Z]:(\\[0-9a-zA-Z\u4e00-\u9fa5].*)$/;

export const OS_TYPE = os.type();
export const RH_MATERIAL_DIR_NAME = '.roothub';
export const RH_MATERIAL_DIR = path.join(os.homedir(), RH_MATERIAL_DIR_NAME);

export function isExistRootDir () {
  if (!fse.existsSync(RH_MATERIAL_DIR)) {
    fse.mkdirsSync(RH_MATERIAL_DIR);
  }
}
