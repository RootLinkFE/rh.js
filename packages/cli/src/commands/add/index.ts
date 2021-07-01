/*
 * @Author: mingxing.zhong
 * @Date: 2021-06-29 13:55:41
 * @Description: add command
 */

import commander from 'commander';
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

const exec = util.promisify(child_process.exec);

const cwd = process.cwd(); // 当前node进程执行路径
const homedir = os.homedir();
const localStorageDir = path.join(homedir, `.roothub`); // 本地存储位置

export default (program: commander.Command) => {
  program
    .command('add-block [name]')
    .usage('add block [name]')
    .description('Add a block to your project.')
    .option('-r, --repository-name <string>', 'repository name')
    .action(async (blockKey, options) => {
      const { repositoryName } = options;
      try {
        blockKey = await getBlockKey(blockKey);
        const blockPath = path.join(cwd, blockKey);
        ensurePath(blockPath);
        const repository = await getRepository(repositoryName);
        await downloadRepository(repository);
        const block = getBlock(repository, blockKey);
        copyBlock(repository, block, blockPath);
      } catch (error) {
        console.log(chalk.red(error));
      }
    });
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
  const repositoryList = await getRepositoryList();

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

  const repository = repositoryList.find(
    (item) => item.name === repositoryName,
  );

  if (!repository) {
    throw new Error(`Can't find the repository: ${repositoryName}`);
  }

  return repository;
}

function ensurePath(path: string) {
  if (fse.existsSync(path)) {
    throw new Error(`Path already exists: ${path}`);
  }
}

async function getRepositoryList(): Promise<Repository[]> {
  const spinner = ora('block repository fetching...').start();
  try {
    const { data } = await axios.get(
      'https://raw.githubusercontent.com/RootLinkFE/roothub/master/recommendMaterials.json',
    );

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

  return localRepositoryPath;
}

async function downloadRepository(repository: Repository) {
  const gitPath = repository.gitPath;
  const localRepositoryPath = getLocalRepositoryPath(repository);

  if (fse.existsSync(localRepositoryPath)) {
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
  let path = gitPath.substr(lastIndex + 1);
  path = path.substr(0, path.length - 4);

  return path;
}

function getBlock(repository: Repository, blockKey: string) {
  const localRepositoryPath = getLocalRepositoryPath(repository);
  const jsonFilePath = path.join(localRepositoryPath, repository.jsonFile);

  const json = fse.readJSONSync(jsonFilePath);

  const blockList: Block[] = json.list;
  const block = blockList.find((item) => item.key === blockKey);

  if (!block) {
    throw new Error(`Can't find the block: ${blockKey}`);
  }

  return block;
}

function copyBlock(repository: Repository, block: Block, destination: string) {
  const localRepositoryPath = getLocalRepositoryPath(repository);

  const origin = path.join(localRepositoryPath, block.path);

  fse.copySync(origin, destination);

  console.log(chalk.blue(`Block add successfully: ${destination}`));
}
