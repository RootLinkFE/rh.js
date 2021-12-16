/*
 * @Author: mingxing.zhong
 * @Date: 2021-06-29 13:55:41
 * @Description: block command
 */

import fse from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import os from 'os';
import inquirer from 'inquirer';
import axios from 'axios';
import util from 'util';
import child_process from 'child_process';
import ora from 'ora';
import { Block, Repository } from './type';
import { RECOMMEND_MATERIALS } from './config';

const PATH_RESOURCE = '.roothub';

const URL_MATERIALS_JSON =
  'https://raw.githubusercontent.com/RootLinkFE/roothub/master/recommendMaterials.json';

const exec = util.promisify(child_process.exec);

const homedir = os.homedir();
const localStorageDir = path.join(homedir, PATH_RESOURCE); // 本地存储位置

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

async function getRepositoryList(): Promise<Repository[]> {
  console.log(
    '💡资源都是从 GitHub 下载，请确保网络访问正常！',
    URL_MATERIALS_JSON,
  );
  const spinner = ora('block repository fetching...').start();
  try {
    // 国内大部分人可能会超时，不用梯子的话
    const { data = RECOMMEND_MATERIALS } = await axios.get(URL_MATERIALS_JSON);

    return data;
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
  return localRepositoryPath.replace(/\\/, '/');
}

async function downloadRepository(repository: Repository) {
  const gitPath = repository.gitPath;
  const localRepositoryPath = getLocalRepositoryPath(repository);
  const hasRepo = fse.existsSync(localRepositoryPath);

  if (hasRepo) {
    const spinner = ora('block repository pulling...').start();
    await exec('git pull', {
      cwd: localRepositoryPath,
    });
    spinner.stop();
  } else {
    const spinner = ora('block repository cloning...').start();
    await exec(`git clone ${gitPath}`, {
      cwd: localStorageDir,
    });
    spinner.stop();
  }
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

export default async function rhBlockInsert(packageName: string) {
  try {
    // rh block use materials-react:FileImportModal

    const cwd = process.cwd(); // 当前node进程执行路径
    const arr = packageName.split(':');
    const repositoryName = arr[0];
    const blockName = arr[1];
    const blockKey = await getBlockKey(blockName);
    const blockPath = path.join(cwd, blockKey);
    ensurePath(blockPath);
    const repository = await getRepository(repositoryName);
    await downloadRepository(repository);
    const block = getBlock(repository, blockKey);
    copyBlock(repository, block, blockPath);
  } catch (error) {
    console.log(chalk.red(error));
  }
}
