import fse from 'fs-extra';
import path from 'path';
import yaml from 'yaml';
import { RH_MATERIAL_CONFIG, RH_MATERIAL_DIR } from '../constant';

export type MaterialResourcesConfigType = {
  name: string;
  git?: string;
  description: string;
  localPath?: string;
};

export function isInit(): boolean {
  return fse.existsSync(RH_MATERIAL_DIR) && fse.existsSync(RH_MATERIAL_CONFIG);
}

export function loadManifestConfig(): MaterialResourcesConfigType[] {
  if (!fse.existsSync(RH_MATERIAL_DIR)) {
    fse.mkdirSync(RH_MATERIAL_DIR);
  }
  if (!fse.existsSync(RH_MATERIAL_CONFIG)) {
    fse.copyFileSync(
      path.join(__dirname, '../../manifest.default.json'),
      RH_MATERIAL_CONFIG,
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const config = require(RH_MATERIAL_CONFIG);

  return config;
}
