import { MaterialResources } from '../material-resources';
import { Material } from '../material';

export function materialFactory(
  path: string,
  materialResources: MaterialResources,
): Material | undefined {
  return new Material(path, materialResources);
} 
