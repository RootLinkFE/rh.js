import { startCase, camelCase } from 'lodash';

const pinyin = require('chinese-to-pinyin');

export function normalizeSchemaName(name: string) {
  return startCase(camelCase(name))
    .replace(/ /g, '')
    .replace(/[^a-zA-Z]/g, '')
    .replace(/api/gi, '');
}

export function fixDefinitionsChinese(data: any) {
  const { definitions, ...swaggerData } = data;
  const newDefinitions = {};
  const swaggerDataText = JSON.stringify(swaggerData);
  Object.keys(definitions).forEach((key) => {
    if (!/^[\w-]*$/.test(key)) {
      const newKey = normalizeSchemaName(pinyin(key, { removeTone: true }));
      newDefinitions[newKey] = definitions[key];
      swaggerDataText.replaceAll(
        `#/definitions/${key}`,
        `#/definitions/${newKey}`,
      );
    } else {
      newDefinitions[key] = definitions[key];
    }
  });
  return {
    definitions: newDefinitions,
    ...JSON.parse(swaggerDataText),
  };
}
