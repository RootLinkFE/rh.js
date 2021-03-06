/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  // https://kulshekhar.github.io/ts-jest/docs/getting-started/presets/
  preset: 'ts-jest/presets/js-with-ts-esm',
  globals: {
    'ts-jest': {
      useESM: true,
      // isolatedModules: true,
    },
  },
  modulePaths: ['<rootDir>/packages'],
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  testPathIgnorePatterns: ['<rootDir>/packages/components'], // 组件走 umi-test
  testMatch: ['**/__tests__/**/*.(js|ts|tsx)', '**/?(*.)+(spec|test).(js|ts)'],
  transform: {
    '^.+\\.js?$': 'babel-jest',
    '^.+\\.ts?$': 'ts-jest',
  },
  moduleNameMapper: {},
  moduleDirectories: ['src/rh', '.', 'node_modules'],
};
