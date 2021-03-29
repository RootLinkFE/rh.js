import { Material } from '../lib/material';
import { loadManifestConfig, MaterialResourcesConfigType } from './init';
import { cloneMaterials } from './init/clone-materials';
import { MaterialTypeKeys } from './material';
import { MaterialResources, MaterialConfigType } from './material-resources';

export class MaterialResourcesCollection {
  manifestsConfig: MaterialResourcesConfigType[] = [];
  materialResources: MaterialResources[] = [];

  constructor(private options: any) {}

  async init(): Promise<void> {
    // 指定本地的
    if (this.options.local) {
      this.manifestsConfig = [
        {
          name: 'local',
          description: '',
          localPath: this.options.local,
        },
      ];
    } else {
      this.manifestsConfig = loadManifestConfig();
    }

    this.manifestsConfig.forEach((config) => {
      const materialResource = new MaterialResources(config);
      this.materialResources.push(materialResource);
    });

    const notInitMaterial = this.materialResources.filter(
      (materialResource) => !materialResource.inited,
    );

    if (notInitMaterial.length) {
      await cloneMaterials(notInitMaterial);
    }
  }

  /**
   *
   * @param key string '[scope]@[materialName]'
   */
  getMaterial(key: string, type: MaterialTypeKeys): Material | undefined {
    let result;
    const [scope, materialKey] = key.split('@');
    if (!scope || !materialKey) {
      throw new Error(`${key} 不符合格式：[scope]@[materialName]`);
    }
    this.materialResources.some((materialResource) => {
      if (materialResource.config.name === scope) {
        const materialsConfig = materialResource.resolveResources(type);
        return materialsConfig.some((materialConfig) => {
          if (materialConfig.key === materialKey) {
            result = new Material(materialConfig.path, materialResource);
            return true;
          }
          return false;
        });
      }
      return false;
    });
    return result;
  }

  listAllManifest(): Pick<
    MaterialResourcesConfigType,
    'name' | 'description'
  >[] {
    return this.manifestsConfig.map(({ name, description }) => ({
      name,
      description,
    }));
  }

  listAllScaffolds(all = false): MaterialConfigType[] {
    const scaffolds: MaterialConfigType[] = [];
    this.materialResources.forEach((materialResource) => {
      materialResource.resolveScaffolds();
      return materialResource.scaffolds.forEach((scaffold) => {
        if (!all && scaffold.private) return;
        scaffold.namespace = materialResource.config.name;
        scaffolds.push(scaffold);
      });
    });
    return scaffolds;
  }
}
