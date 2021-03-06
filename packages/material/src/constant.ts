import os from 'os';
import path from 'path';

export const RH_MATERIAL_DIR = path.join(os.homedir(), '.rh-material');
export const RH_MATERIAL_DIR_MATERIALS = path.join(os.homedir(), '.rh-material', 'materials');
export const RH_MATERIAL_DIR_TEMPLATES = path.join(os.homedir(), '.rh-material', 'templates');
export const RH_MATERIAL_CONFIG = path.join(
  os.homedir(),
  '.rh-material',
  'manifest.json',
);

export const MATERIAL_INFO_FILE_NAME = 'material.json';
