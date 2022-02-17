const inquirer = require('inquirer');
const request = require('request');

interface swaggerResourceType {
  location: 'string';
  name: 'string';
  swaggerVersion: 'string';
  url: 'string';
}

type swaggerResourceTypeList = swaggerResourceType[];

function getSwaggerResources(url: string): Promise<swaggerResourceTypeList> {
  return new Promise((resolve, reject) => {
    request(url, function (err: any, resp: any, body: string) {
      if (err) {
        console.log(err);
        return reject(err);
      }
      if (body) {
        try {
          resolve(JSON.parse(body));
        } catch (err: any) {
          console.log(err);
          reject(new Error(err));
        }
      } else {
        reject(new Error());
      }
    });
  });
}

export async function chooseApi(apiUrl: string) {
  const data = await getSwaggerResources(apiUrl);
  const { url } = await inquirer.prompt([
    {
      type: 'list',
      name: 'url',
      message: 'choose apiUrl',
      choices: data.map((item) => item.url),
    },
  ]);
  return url;
}

// 供选择 Spec
export async function chooseSpec(choices: any) {
  const { results } = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'results',
      message: '选择具体服务(可多选)',
      choices,
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
