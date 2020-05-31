export function getNamespace(filename) {
  const prefix = '/cypress/integration/';
  const suffix = '.test.js';
  return filename.replace(prefix, '').replace(suffix, '');
}
