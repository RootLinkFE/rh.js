import { loadManifestConfig, MaterialResourcesConfigType } from './init';
import { cloneMaterials } from './init/clone-materials';
import { createProject } from './init/create-project';
import { MaterialTypeKeys, Material } from './material';
import { MaterialResources, MaterialConfigType } from './material-resources';
// import { InquirePrompt, MaterialPrompts } from './init/prompt';

export class MaterialResourcesCollection {
  manifestsConfig: MaterialResourcesConfigType[] = [];
  materialResources: MaterialResources[] = [];
  // promots: InquirePrompt[] = MaterialPrompts;

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
  async getFinalMaterial(projectName: string, key?: string, type?: MaterialTypeKeys) {
    let result: any;
    const _key = key || 'rh-materials@vue',
      _type = type || 'scaffold';
    const [scope, materialKey] = _key.split('@');
    if (!scope || !materialKey) {
      throw new Error(`${_key} 不符合格式：[scope]@[materialName]`);
    }
    for (let i = 0; i < this.materialResources.length; ++i) {
      const _materialResource = this.materialResources[i];
      if (_materialResource.config.name === scope) {
        result = await _materialResource.combineResource();
      }
    }
    createProject(projectName, result);
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