'use strict';

import { resolveRequestFunctionName } from '../src/commands/api/swagger-gencode';
import { uniq } from 'lodash';

const data = [
  {
    pathArgs: [],
    operationId: 'conditionListUsingGET',
    method: 'get',
    route: '/api/dmp/model/list',
    moduleName: 'api',
    responsesTypes: [
      {
        description: 'OK',
        content: [Object],
        contentTypes: [Array],
        contentKind: 'OTHER',
        type: 'InputStream',
        status: 200,
        isSuccess: true,
      },
    ],
    description: '筛选部件模型',
    tags: ['部件模型-部件型号'],
    summary: '筛选部件模型',
    responses: { '200': { description: 'OK', content: [Object] } },
    produces: ['*/*'],
    requestBody: undefined,
    consumes: [],
    deprecated: false,
    'x-order': '2147483647',
  },
  {
    pathArgs: [],
    operationId: 'listUsingPOST_1',
    method: 'post',
    route: '/api/dmp/model/list',
    moduleName: 'api',
    responsesTypes: [
      {
        description: 'OK',
        content: [Object],
        contentTypes: [Array],
        contentKind: 'OTHER',
        type: 'InputStream',
        status: 200,
        isSuccess: true,
      },
    ],
    description: '一类部件的模型分页查询',
    tags: ['部件模型-部件型号'],
    summary: '一类部件的模型分页查询',
    responses: { '200': { description: 'OK', content: [Object] } },
    produces: ['*/*'],
    requestBody: { $ref: '#/components/requestBodies/ComponentModel_' },
    consumes: ['application/json'],
    deprecated: false,
    'x-order': '2147483647',
  },
  {
    pathArgs: [],
    operationId: 'listAllUsingGET_1',
    method: 'get',
    route: '/api/dmp/model/list/All',
    moduleName: 'api',
    responsesTypes: [
      {
        description: 'OK',
        content: [Object],
        contentTypes: [Array],
        contentKind: 'OTHER',
        type: 'InputStream',
        status: 200,
        isSuccess: true,
      },
    ],
    description: '所有已发布部件型号接口',
    tags: ['部件模型-部件型号'],
    summary: '所有已发布部件型号接口',
    responses: { '200': { description: 'OK', content: [Object] } },
    produces: ['*/*'],
    requestBody: undefined,
    consumes: [],
    deprecated: false,
    'x-order': '2147483647',
  },
  {
    pathArgs: [
      {
        name: 'type',
        optional: false,
        type: 'string',
        description: 'type',
      },
    ],
    operationId: 'listAllUsingGET_2',
    method: 'get',
    route: '/api/dmp/model/listAll/{type}',
    moduleName: 'api',
    responsesTypes: [
      {
        description: 'OK',
        content: [Object],
        contentTypes: [Array],
        contentKind: 'OTHER',
        type: 'InputStream',
        status: 200,
        isSuccess: true,
      },
    ],
    description: '根据type查询已发布部件型号接口',
    tags: ['部件模型-部件型号'],
    summary: '根据type查询已发布部件型号接口',
    responses: { '200': { description: 'OK', content: [Object] } },
    produces: ['*/*'],
    requestBody: undefined,
    consumes: [],
    deprecated: false,
    'x-order': '2147483647',
  },
];

describe('rh api(duplicate)', () => {
  test('test swagger api CodeGen when path has duplicate', async () => {
    const list = data.map((item: any) => resolveRequestFunctionName(item));
    const result = uniq(list).length === uniq(data).length;
    expect(result).toBeTruthy();
  });
});
