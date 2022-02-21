const utils = require('./utils');

function flatSchema(
  schema: {
    type: any;
    properties: any;
    additionalProperties: any;
    items: any;
    $$ref: any;
  },
  models: any[],
) {
  schema = utils.objectify(schema);

  let type = schema.type;
  const properties = schema.properties;
  const additionalProperties = schema.additionalProperties;
  const items = schema.items;
  const $$ref = schema.$$ref;

  if (!type) {
    if (properties) {
      type = 'object';
    } else if (items) {
      type = 'array';
    } else {
      return;
    }
  }

  if ($$ref) {
    models.push(schema);
  }

  if (type === 'object') {
    const props = utils.objectify(properties);

    for (const name in props) {
      flatSchema(props[name], models);
    }

    if (additionalProperties && additionalProperties !== true) {
      const additionalProps = utils.objectify(additionalProperties);
      flatSchema(additionalProps, models);
    }
  }

  if (type === 'array') {
    flatSchema(items, models);
  }
}

function getClassName(schema: any) {
  const ref = schema.$$ref;
  return ref ? ref.replace(/.*\//g, '') : 'Demo';
}

function getValueByJS(prop: {
  type?: any;
  properties?: any;
  items?: any;
  $$ref?: any;
}): any {
  let type = prop.type;
  const properties = prop.properties;
  const items = prop.items;

  if (!type) {
    if (properties) {
      type = 'object';
    } else if (items) {
      type = 'array';
    }
  }

  switch (type) {
    case 'integer':
    case 'number':
      return 0;
    case 'array':
      return '[' + getValueByJS(items) + ']';
    case 'boolean':
      return false;
    case 'object':
      return getClassName(prop);
    default:
      return "''";
  }
}

function getValueByOC(key: string, prop: { type: any }) {
  let value;
  switch (prop.type) {
    case 'integer':
    case 'number':
      value = '@property (nonatomic, strong) NSNumber *' + key + ';';
      break;
    case 'array':
      value = '@property (nonatomic, copy) NSArray *' + key + ';';
      break;
    case 'boolean':
      value = '@property (nonatomic, assign) BOOL ' + key + ';';
      break;
    default:
      value = '@property (nonatomic, copy) NSString *' + key + ';';
      break;
  }
  return value + '\n';
}

function getEntities(docs: { content: { [x: string]: any } }, type: string) {
  docs = (docs.content && docs.content['application/json']) || docs;

  const models: any[] = [];
  const schema = utils.inferSchema(docs);

  if (schema) {
    flatSchema(schema, models);
  }

  return models.map(function (model) {
    const properties = model.properties;
    const props = [];
    let propName;

    if (type === 'js') {
      for (propName in properties) {
        props.push(
          'this.' + propName + ' = ' + getValueByJS(properties[propName]) + ';',
        );
      }
      return (
        'class ' +
        getClassName(model) +
        ' {constructor() {' +
        props.join('') +
        '}}'
      );
    }

    for (propName in properties) {
      props.push(getValueByOC(propName, properties[propName]));
    }
    return (
      '@interface ' +
      getClassName(model) +
      ' : NSObject\n\n' +
      props.join('') +
      '\n@end'
    );
  });
}

module.exports = {
  getJavaScriptEntities: function (docs: any) {
    return getEntities(docs, 'js');
  },
  getObjectiveCEntities: function (docs: any) {
    return getEntities(docs, 'oc');
  },
};
