import os from 'os';
import path from 'path';

export const RH_MATERIAL_DIR = path.join(os.homedir(), '.rh-material');
export const RH_MATERIAL_CONFIG = path.join(
  os.homedir(),
  '.rh-material',
  'manifest.json',
);

export const MATERIAL_INFO_FILE_NAME = 'material.json';
