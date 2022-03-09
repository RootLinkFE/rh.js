const inquirer = require('inquirer');
const request = require('request');

// 供选择 Spec
export async function chooseSpec(choices: any) {
  const { results } = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'results',
      message: '选择具体服务(可多选)',
      choices,
      validate(answer: string | any[]) {
        if (answer.length < 1) {
          return '请至少选择一项';
        }
        return true;
      },
    },
  ]);
  return results.map((item: string) => {
    const data = /^(.*)\((.*)\)$/.exec(item) || [];
    return {
      name: data[1],
      url: data[2],
    };
  });
}

export async function chooseSwaggerPaths(choices: any) {
  const { paths } = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'paths',
      message: '选择 swaggerPaths',
      choices,
      validate(answer: string | any[]) {
        if (answer.length < 1) {
          return '请至少选择一项';
        }
        return true;
      },
    },
  ]);
  return paths;
}

export async function chooseNeedMock() {
  const { ok } = await inquirer.prompt([
    {
      name: 'ok',
      type: 'confirm',
      message: `是否需要 mock?`,
      default: true,
    },
  ]);
  return ok;
}

export type SwaggerResourcesType = {
  name: string;
  url: string;
  swaggerVersion: string;
  location: string;
};

export function getAllResources(
  swUrl: string,
): Promise<SwaggerResourcesType[]> {
  const url = swUrl.replace(/\/$/, '') + '/swagger-resources';

  return new Promise((resolve, reject) => {
    request.get(url, function (err: any, res: any, body: string) {
      if (err) {
        return reject(err);
      } else {
        try {
          const resources = JSON.parse(body);
          if (!Array.isArray(resources)) {
            return reject('resources is not valid');
          }
          resolve(resources);
        } catch (err) {
          reject(err);
        }
      }
    });
  });
}
