'use strict';

import SwaggerAPI from '../src/commands/api/swagger-api';
// const SwaggerAPI = require('../src/commands/api/swagger-api');
// jest.useFakeTimers();

const swaggerUrl = 'https://petstore.swagger.io/v2/swagger.json';

describe('rh api', () => {
  test('test swagger api CodeGen is normal', async () => {
    let config = { yes: true, output: 'src/rh/apis' };
    const result = await SwaggerAPI(swaggerUrl, config);
    console.log('result', result);
    expect(result).toBeTruthy();
  });
});
