import { Spec } from 'swagger-schema-official';
import path from 'path';
import rimraf from 'rimraf';
import chalk from 'chalk';
import request from 'request';

import { getAllResources, SwaggerResourcesType } from './swagger-resources';

import SwaggerGen from './swagger-gencode';

export type SwaggerApiCLIConfigType = { js: boolean; output: string };

const NO_VALID_SWAGGER_JSON = 'Not valid swagger schema json';

export default async function SwaggerAPI(
  swaggerUrl: string,
  config: SwaggerApiCLIConfigType,
) {
  if (!/https?:\/\//.test(swaggerUrl)) {
    console.log(chalk.red(` ${swaggerUrl} 不是有效的地址`));
    return;
  }

  config.output = path.resolve(process.cwd(), config?.output);

  const specs: Spec[] = [];
  // 尝试获取当前地址，判断是否JSON的返回内容
  try {
    const spec = await getSwaggerSchemaJSON(swaggerUrl);

    (spec as any).resourceName = new URL(swaggerUrl).hostname;
    specs.push(spec);
  } catch (err) {
    if (err.message !== NO_VALID_SWAGGER_JSON) {
      console.error(err);
      throw err;
    }
  }
  try {
    // 尝试获取资源文件
    const resources = await getAllResources(swaggerUrl);
    specs.push(
      ...(await getSwaggerSchemaJSONByResources(resources, swaggerUrl)),
    );
  } catch (err) {
    console.error(err);
    console.log(chalk.red('不是可用的 swagger 资源链接'));
    process.exit(-1);
  }

  specs.forEach((spec) => {
    console.log(chalk.green(`🍖️   找到 ${(spec as any).resourceName} 资源`));
  });

  const genInstance = new SwaggerGen(specs, config);
  genInstance.gen();
}

function getSwaggerSchemaJSONByResources(
  resources: SwaggerResourcesType[],
  swaggerUrl: string,
): Promise<Spec[]> {
  const result: Spec[] = [];
  return new Promise((resolve, reject) => {
    resources
      .reduce((_p, resource) => {
        return _p.then(async () => {
          const url = new URL(resource.url, swaggerUrl);
          const spec = await getSwaggerSchemaJSON(url.toString());
          (spec as any).resourceName = resource.name;
          result.push(spec);
        });
      }, Promise.resolve())
      .then(() => {
        resolve(result);
      });
  });
}

function getSwaggerSchemaJSON(url: string): Promise<Spec> {
  return new Promise((resolve, reject) => {
    request(url, function (err, resp, body) {
      if (err) return reject(err);
      if (body) {
        try {
          const data = JSON.parse(body);
          if (!data.swagger) {
            reject(new Error(NO_VALID_SWAGGER_JSON));
          }
          return resolve(data);
        } catch (err) {
          reject(err);
        }
      } else {
        reject(new Error(NO_VALID_SWAGGER_JSON));
      }
    });
  });
}