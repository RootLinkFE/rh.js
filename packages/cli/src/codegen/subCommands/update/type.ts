export interface UpdateCommandConfig {
  all?: boolean;
  mock?: boolean;
}

export interface UpdateConfigType {
  apiConfig: ApiConfig;
  mockConfig: MockConfig;
  swaggerPaths: SwaggerPath[];
  options: Options;
}

export interface ApiConfig {
  output: string;
  replaceEntryFile: boolean;
}

export interface MockConfig {
  output: string;
  mock?: boolean;
  independentServer: boolean;
  port: number;
}

export interface SwaggerPath {
  name: string;
  path: string;
  group: boolean;
  mockPrefix: string;
}

export interface Options {
  methodPrefix: string;
  reactNativeCompatible: boolean;
}
