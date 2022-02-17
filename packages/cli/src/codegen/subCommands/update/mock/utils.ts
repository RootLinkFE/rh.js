function isObject(obj: any) {
  return !!obj && typeof obj === 'object';
}

function objectify(thing: any) {
  if (!isObject(thing)) return {};
  return thing;
}

function normalizeArray(arr: any) {
  if (Array.isArray(arr)) return arr;
  return [arr];
}

function isFunc(thing: any) {
  return typeof thing === 'function';
}

function inferSchema(thing: any) {
  if (thing.schema) {
    thing = thing.schema;
  }

  if (thing.properties) {
    thing.type = 'object';
  }

  return thing;
}

module.exports = {
  isObject: isObject,
  objectify: objectify,
  isFunc: isFunc,
  inferSchema: inferSchema,
  normalizeArray: normalizeArray,
};
