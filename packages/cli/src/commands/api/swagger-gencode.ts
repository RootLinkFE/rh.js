import { Spec } from 'swagger-schema-official';
import { SwaggerApiCLIConfigType } from './swagger-api';

import {
  generateApi,
  GenerateApiParams,
  RawRouteInfo,
  RouteNameInfo,
  SchemaComponent,
} from 'swagger-typescript-api';
import { camelCase } from 'lodash';
import EntryFile from './entry-file';
import { normalizeSchemaName } from './utils';

function resolveRequestFunctionName(requestPath: string) {
  const paths = requestPath.split('/');
  return camelCase([paths.pop(), paths.pop()].reverse().join('-'));
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
        );
        return routeNameInfo;
      },
      // onFormatRouteName: (routeInfo, templateRouteName) => {},
      // onFormatTypeName: (typeName, rawTypeName) => {},
      // onInit: (configuration) => {},
      // onParseSchema: (originalSchema: any, parsedSchema: any) => {},
      // onPrepareConfig: (currentConfiguration) => {},
    },
  };
  config: Omit<GenerateApiParams, 'url' | 'spec' | 'input'> | undefined;

  constructor(private specs: Spec[], config: SwaggerApiCLIConfigType) {
    (this.config as any) = Object.assign({}, this.defaultConfig, config);
  }

  async gen() {
    const entryFile = new EntryFile(this.config);
    const output = this.config!.output!;
    return this.specs
      .reduce((_p, spec) => {
        delete spec.info.termsOfService;
        return _p.then(() => {
          return new Promise((resolve) => {
            generateApi({
              ...this.config,
              name: `${normalizeSchemaName((spec as any).resourceName)}.${
                this.config?.toJS ? 'js' : 'ts'
              }`,
              output,
              spec,
            }).then(({ files, configuration }) => {
              entryFile.files.push(...files.map((file) => file.name));
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
