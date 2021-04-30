import os from 'os';
import path from 'path';
import fse from 'fs-extra';
import { Spec } from 'swagger-schema-official';
import { SwaggerApiCLIConfigType } from './swagger-api';

import {
  generateApi,
  GenerateApiParams,
  RawRouteInfo,
  RouteNameInfo,
  SchemaComponent,
} from 'swagger-typescript-api';
import { camelCase, kebabCase } from 'lodash';
import EntryFile from './entry-file';
import { normalizeSchemaName } from './utils';

function resolveRequestFunctionName(requestPath: string, moduleName: string) {
  const paths = requestPath.split('/');
  const moduleNamePaths = kebabCase(moduleName).split('-');
  return camelCase(paths.filter((p) => !moduleNamePaths.includes(p)).join('-'));
}

export default class SwaggerGen {
  defaultConfig = {
    httpClientType: 'axios', // or "fetch"
    defaultResponseAsSuccess: false,
    generateRouteTypes: false,
    generateResponses: true,
    toJS: false,
    extractRequestParams: false,
    prettier: {
      printWidth: 120,
      tabWidth: 2,
      trailingComma: 'all',
      parser: 'typescript',
    },
    defaultResponseType: 'void',
    singleHttpClient: false,
    cleanOutput: false,
    enumNamesAsValues: false,
    moduleNameFirstTag: false,
    generateUnionEnums: false,
    extraTemplates: [],
    modular: true,
    silent: true,
    hooks: {
      // onCreateComponent: (component: SchemaComponent) => {
      //   console.log('component: ', JSON.stringify(component));
      // },
      //  onCreateRequestParams: (rawType) => {},
      // onCreateRoute: (routeData: any) => {},
      onCreateRouteName: (
        routeNameInfo: RouteNameInfo,
        rawRouteInfo: RawRouteInfo,
      ) => {
        routeNameInfo.original = routeNameInfo.usage = resolveRequestFunctionName(
          rawRouteInfo.route,
          rawRouteInfo.moduleName,
        );
        return routeNameInfo;
      },
      // onFormatRouteName: (routeInfo, templateRouteName) => {},
      // onFormatTypeName: (typeName: any, rawTypeName: any) => {},
      // onInit: (configuration) => {},
      onParseSchema: (originalSchema: any, parsedSchema: any) => {
        if (parsedSchema.content === 'object') {
          parsedSchema.content = 'any';
        }
        return parsedSchema;
      },
      // onPrepareConfig: (currentConfiguration: any) => {
      //   console.log('currentConfiguration: ', JSON.stringify(currentConfiguration.rawModelTypes));
      // },
    },
  };
  config: Omit<GenerateApiParams, 'url' | 'spec' | 'input'> | undefined;

  constructor(private specs: Spec[], config: SwaggerApiCLIConfigType) {
    (this.config as any) = Object.assign({}, this.defaultConfig, config);
  }

  async gen() {
    const entryFile = new EntryFile(this.config);
    const output = this.config!.output!;
    const tempOutput = path.join(os.tmpdir(), '.rh', 'api_tmp');
    return this.specs
      .reduce((_p, spec) => {
        delete spec.info.termsOfService;
        return _p.then(() => {
          return new Promise((resolve, reject) => {
            generateApi({
              ...this.config,
              name: `${normalizeSchemaName((spec as any).resourceName)}.${
                this.config?.toJS ? 'js' : 'ts'
              }`,
              output: tempOutput,
              spec,
            }).then(({ files, configuration }) => {
              entryFile.files.push(
                ...files.map((file) => {
                  const target = path.join(output, file.name);
                  const patho = path.parse(target);
                  if (
                    ['http-client'].includes(patho.name) &&
                    fse.existsSync(target)
                  ) {
                    return file.name;
                  }
                  console.log(`✅   生成接口文件：${target}`);
                  fse.mkdirpSync(patho.dir);
                  fse.writeFileSync(target, file.content);
                  return file.name;
                }),
              );
              resolve();
            });
          });
        });
      }, Promise.resolve())
      .then(() => {
        entryFile.genFile(output);
      });
  }
}
