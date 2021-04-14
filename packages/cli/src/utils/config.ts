import { homedir } from 'os';
import path from 'path';
import fse from 'fs-extra';

const HomeDir = homedir();

const Config = {
  configPath: path.join(HomeDir, '.rhrc'),
  rcDir: path.join(HomeDir, '.rc/'),
};

if (!fse.existsSync(Config.rcDir)) {
  fse.mkdirpSync(Config.rcDir);
}

export default Config;
