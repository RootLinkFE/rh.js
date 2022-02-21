import { Spec } from 'swagger-schema-official';
import path from 'path';
import chalk from 'chalk';
import request from 'request';
import { camelCase } from 'lodash';

import SwaggerGen from './swagger-gencode';
import { fixDefinitionsChinese } from './utils';
import {
  chooseSpec,
  getAllResources,
  SwaggerResourcesType,
} from '../../../utils';

export interface ApiSpecsPathsType {
  name: string;
  url: string;
}

export type SwaggerApiCLIConfigType = {
  js?: boolean;
  output?: string;
  yes?: boolean;
  no?: boolean;
  group?: boolean;
  apiSpecsPaths?: ApiSpecsPathsType[];
  all?: boolean;
  globalConfig?: Record<string, any>;
};

const NO_VALID_SWAGGER_JSON = 'Not valid swagger schema json';

export default async function SwaggerAPI(
  swaggerUrl: string,
  config: SwaggerApiCLIConfigType,
) {
  const returnData: {
    apiSpecsPaths: ApiSpecsPathsType[];
    specs?: Spec[];
    specUrls: {
      url: string;
    }[];
  } = { apiSpecsPaths: [], specUrls: [] };
  if (!/https?:\/\//.test(swaggerUrl)) {
    console.log(chalk.red(` ${swaggerUrl} 不是有效的地址`));
    return returnData;
  }

  config.output = path.resolve(process.cwd(), config?.output || '');

  const specs: Spec[] = [];
  const isSingleSpecs = !config.group;
  if (isSingleSpecs) {
    // 尝试获取当前地址，判断是否JSON的返回内容
    try {
      const spec = await getSwaggerSchemaJSON(swaggerUrl);
      const group = new URL(swaggerUrl).searchParams.get('group');
      try {
        (spec as any).resourceName = camelCase(group?.split('--')[0]);
      } catch (e) {
        (spec as any).resourceName = new URL(swaggerUrl).hostname;
      }
      specs.push(spec);
      returnData.specUrls.push({ url: swaggerUrl });
    } catch (err: any) {
      console.log(err);
      if (err?.message !== NO_VALID_SWAGGER_JSON) {
        console.error(err);
        throw err;
      }
    }
  } else {
    try {
      // 尝试获取资源文件
      let resources = await getAllResources(swaggerUrl);
      if (!config.all) {
        resources = await chooseSpec(
          resources.map(
            (item: { url: any; name: any }) => `${item.name}(${item.url})`,
          ),
        );
      }
      returnData.specUrls.push(
        ...resources.map((item) => ({
          url: encodeURI(swaggerUrl + item.url),
        })),
      );
      if (config.apiSpecsPaths && config.apiSpecsPaths.length === 0) {
        returnData.apiSpecsPaths = resources.map((item) => ({
          name: item.name,
          url: item.url,
        }));
      }

      specs.push(
        ...(await getSwaggerSchemaJSONByResources(resources, swaggerUrl)),
      );
    } catch (err) {
      console.error(err);
      console.log(chalk.red('不是可用的 swagger 资源链接'));
      process.exit(-1);
    }
  }

  specs.forEach((spec) => {
    console.log(chalk.green(`🍖️   找到 ${(spec as any).resourceName} 资源`));
  });

  const genInstance = new SwaggerGen(specs, config);
  await genInstance.gen();

  returnData.specs = specs;

  return returnData;
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
          const url = swaggerUrl.replace(/\/$/, '') + resource.url;
          const spec = await getSwaggerSchemaJSON(url);
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
    request(encodeURI(url), function (err, resp, body) {
      if (err) {
        console.log(err);
        return reject(err);
      }
      if (body) {
        try {
          const data = fixDefinitionsChinese(JSON.parse(body));
          if (!data.swagger) {
            reject(new Error(NO_VALID_SWAGGER_JSON));
          }
          return resolve(data);
        } catch (err: any) {
          reject(new Error(err));
        }
      } else {
        reject(new Error(NO_VALID_SWAGGER_JSON));
      }
    });
  });
}
