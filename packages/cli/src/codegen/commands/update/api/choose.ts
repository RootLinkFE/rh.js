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
        console.log('[rh api -c]', err);
        return reject(err);
      }
      if (body) {
        try {
          resolve(JSON.parse(body));
        } catch (err: any) {
          // console.log('[rh api]',err);
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
  const answer = await inquirer.prompt([
    {
      name: 'ok',
      type: 'confirm',
      message: `是否需要 mock?`,
      default: true,
    },
  ]);
  return answer;
}
