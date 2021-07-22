import { MaterialResources } from '../material-resources';
import { Material } from '../material';

export function materialFactory(
  path: string,
  materialResources: MaterialResources,
  externalDependencies?: string[],
  materialName?: string,
): Material | undefined {
  return new Material(path, materialResources, externalDependencies, materialName);
}
