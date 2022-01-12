'use strict';

import { getRepositoryList } from '../src/block/main';

describe('rh block', () => {
  test('test fetch roothub materials json file', async () => {
    const result: any[] = await getRepositoryList();
    expect(result.length).toBeTruthy();
  });
});
