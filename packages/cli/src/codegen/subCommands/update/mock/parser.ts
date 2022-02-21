const uutils = require('./utils');
const primitives = require('./primitives');
const swagger = require('swagger-client');

function primitive(schema: { type: string; format: any; example: any }) {
  schema = uutils.objectify(schema);

  const type = schema.type;
  const format = schema.format;
  const value = primitives[type + '_' + format] || primitives[type];

  if (typeof schema.example === 'undefined') {
    return value || 'Unknown Type: ' + schema.type;
  }

  return schema.example;
}

function sampleFromSchema(schema: any): any {
  schema = uutils.objectify(schema);

  let type = schema.type;
  const properties = schema.properties;
  const additionalProperties = schema.additionalProperties;
  const items = schema.items;

  if (!type) {
    if (properties) {
      type = 'object';
    } else if (items) {
      type = 'array';
    } else {
      return;
    }
  }

  if (type === 'object') {
    const props = uutils.objectify(properties);
    const obj: Record<string, any> = {};
    for (const name in props) {
      obj[name] = sampleFromSchema(props[name]);
    }

    if (additionalProperties === true) {
      obj.additionalProp1 = {};
    } else if (additionalProperties) {
      const additionalProps = uutils.objectify(additionalProperties);
      const additionalPropVal = sampleFromSchema(additionalProps);

      for (let i = 1; i < 4; i++) {
        obj['additionalProp' + i] = additionalPropVal;
      }
    }
    return obj;
  }

  if (type === 'array') {
    return [sampleFromSchema(items)];
  }

  if (schema['enum']) {
    if (schema['default']) return schema['default'];
    return uutils.normalizeArray(schema['enum'])[0];
  }

  if (type === 'file') {
    return;
  }

  return primitive(schema);
}

function getSampleSchema(schema: any) {
  return JSON.stringify(sampleFromSchema(schema), null, 2);
}

export const parser = function (opts: { url?: any } | undefined) {
  opts = opts || {};

  return swagger(opts).then(function (res: { spec: any }) {
    const spec = res.spec;
    const isOAS3 = spec.openapi && spec.openapi === '3.0.0';
    for (const path in spec.paths) {
      for (const method in spec.paths[path]) {
        const api = spec.paths[path][method];
        let schema;
        for (const code in api.responses) {
          const response = api.responses[code];
          if (isOAS3) {
            schema =
              response.content &&
              response.content['application/json'] &&
              uutils.inferSchema(response.content['application/json']);
            response.example = schema ? getSampleSchema(schema) : null;
          } else {
            schema = uutils.inferSchema(response);
            response.example = schema ? getSampleSchema(schema) : null;
          }
        }
        if (!api.parameters) continue;
        for (const parameter of api.parameters) {
          schema = uutils.inferSchema(parameter);
          parameter.example = schema ? getSampleSchema(schema) : null;
        }
      }
    }
    return spec;
  });
};
