/*
 * @Author: mingxing.zhong
 * @Date: 2021-06-29 13:55:41
 * @Description: block command
 */

import axios from 'axios';
import chalk from 'chalk';
import child_process from 'child_process';
import fse from 'fs-extra';
import inquirer from 'inquirer';
import ora from 'ora';
import os from 'os';
import path from 'path';
import util from 'util';
import { copyFile } from '../utils/file-handler';
import {
  PATH_RESOURCE, RECOMMEND_MATERIALS, URL_MATERIALS_JSON
} from './config';
import { Block, Repository } from './type';

const exec = util.promisify(child_process.exec);
const cwd = process.cwd(); // 当前node进程执行路径

const homedir = os.homedir();
const localStorageDir = path.join(homedir, PATH_RESOURCE); // 本地存储位置
let spinnerRoot: any = null;

const clearSpinnerRoot = () => {
  spinnerRoot?.stop();
  spinnerRoot = null;
};

async function getBlockKey(key: string) {
  if (!key) {
    const { name } = await inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Enter block key',
        validate: (value: string) => (value ? true : 'Block key is required'),
      },
    ]);

    key = name;
  }

  return key;
}

async function getRepository(repositoryName: string) {
  const repositoryList = (await getRepositoryList()) || RECOMMEND_MATERIALS;

  if (!repositoryName) {
    const choices = repositoryList.map((item) => item.name);

    const { name } = await inquirer.prompt([
      {
        type: 'list',
        name: 'name',
        message: 'Select block repository',
        choices,
      },
    ]);

    repositoryName = name;
  }

  const repository = repositoryList?.find(
    (item) => item.name === repositoryName,
  );

  if (!repository) {
    throw new Error(`[rh block] Can't find the repository: ${repositoryName}`);
  }

  return repository;
}

function ensurePath(path: string) {
  if (fse.existsSync(path)) {
    throw new Error(`[rh block] Path already exists: ${path}`);
  }
}

export async function getRepositoryList(): Promise<Repository[]> {
  console.log('💡从 RootHub 读取物料参考列表！', URL_MATERIALS_JSON);
  const spinner = ora('block repository fetching...').start();
  try {
    const { data } = await axios.get(URL_MATERIALS_JSON);
    return data?.data?.recommendMaterials;
  } catch (error) {
    throw error;
  } finally {
    spinner.stop();
  }
}

function getLocalRepositoryPath(repository: Repository) {
  const gitPath = repository.gitPath;
  const name = getRepositoryName(gitPath);
  const localRepositoryPath = path.join(localStorageDir, name);
  // 兼容mac和windows
  return localRepositoryPath.replace(/\\/g, '/');
}

async function downloadRepository(repository: Repository) {
  const gitPath = repository.gitPath;
  const localRepositoryPath = getLocalRepositoryPath(repository);
  const hasRepo = fse.existsSync(localRepositoryPath);

  if (hasRepo) {
    spinnerRoot = ora('block repository pulling...').start();
    await exec('git pull', {
      cwd: localRepositoryPath,
    });
  } else {
    spinnerRoot = ora('block repository cloning...').start();
    await exec(`git clone ${gitPath}`, {
      cwd: localStorageDir,
    });
  }
  clearSpinnerRoot();

  return true;
}

function getRepositoryName(gitPath: string) {
  const lastIndex = gitPath.lastIndexOf('/');
  let path = gitPath.substring(lastIndex + 1);
  path = path.substring(0, path.length - 4);

  return path;
}

function getBlock(repository: Repository, blockKey: string) {
  const localRepositoryPath = getLocalRepositoryPath(repository);
  const jsonFilePath = path.join(localRepositoryPath, repository.jsonFile);

  const json = fse.readJSONSync(jsonFilePath);

  const blockList: Block[] = json.list || json.blocks || [];
  const block = blockList.find((item) => item.key === blockKey);

  if (!block) {
    throw new Error(`[rh block] Can't find the block: ${blockKey}`);
  }

  return block;
}

function copyBlock(repository: Repository, block: Block, destination: string) {
  const localRepositoryPath = getLocalRepositoryPath(repository);
  const origin = path.join(localRepositoryPath, block.path);

  fse.copySync(origin, destination);

  console.log(chalk.blue(`[rh block] Block add successfully: ${destination}`));
}

export async function rhBlockUpdate(
  packageNames: string[] | null,
  logger = (msg: string) => console.log(msg),
) {
  const tmpPath = path.join(localStorageDir, '.tmp');
  const repositoryList = (await getRepositoryList()) || RECOMMEND_MATERIALS;
  const pkgs = !packageNames ? repositoryList.map((r) => r.name) : packageNames;
  if (!fse.existsSync(tmpPath)) {
    fse.mkdirSync(tmpPath);
  }
  for (let i = 0; i < pkgs.length; ++i) {
    let isInit = true;
    const pkName = pkgs[i];
    const downloadBlockPath = path.join(localStorageDir, pkName);
    const repo = repositoryList?.find((item) => item.name === pkName);
    if (!repo) {
      continue;
    }
    try {
      if (fse.existsSync(downloadBlockPath)) {
        isInit = false;
        copyFile(downloadBlockPath, path.join(tmpPath, pkName));
        fse.removeSync(downloadBlockPath);
      }
      await downloadRepository(repo);
      if (isInit) {
        logger(chalk.green(`${pkName}添加成功`));
      } else {
        logger(chalk.green(`${pkName}更新成功`));
      }
    } catch (error) {
      if (fse.existsSync(path.join(tmpPath, pkName))) {
        copyFile(path.join(tmpPath, pkName), path.join(localStorageDir, pkName));
      }
      logger(chalk.red(`${pkName}更新失败,原因：${error}`));
      clearSpinnerRoot();
    }
  }
  fse.removeSync(tmpPath);
}

export default async function rhBlockInsert(packageName: string,
  pathName: string = '',) {
  try {
    // rh block use materials-react:FileImportModal

    const arr = packageName.split(':');
    const repositoryName = arr[0];
    const blockName = arr[1];
    const blockKey = await getBlockKey(blockName);
    const downloadBlockPath = /^(.\/)/.test(pathName)
      ? path.join(cwd, pathName, blockKey)
      : path.join(cwd, blockKey);
    ensurePath(downloadBlockPath);
    const repository = await getRepository(repositoryName);
    await downloadRepository(repository);
    const block = getBlock(repository, blockKey);
    copyBlock(repository, block, downloadBlockPath);
  } catch (error) {
    console.log(chalk.red(error));
    clearSpinnerRoot();
  }
}
