export * from './material-resources-collection';

let logger = console.log;

export function setLogger(
  _logger: (message?: any, ...optionalParams: any[]) => void,
): void {
  logger = _logger;
}

export function getLogger(): (message?: any, ...optionalParams: any[]) => void {
  return logger;
}
