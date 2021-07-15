import { loadManifestConfig, MaterialResourcesConfigType } from './init';
import { cloneMaterials } from './init/clone-materials';
import { createProject } from './init/create-project';
import { MaterialTypeKeys, Material } from './material';
import { MaterialResources, MaterialConfigType } from './material-resources';
import { InquireTemplateCollection } from './prompt';
import execa from 'execa';
// import { InquirePrompt, MaterialPrompts } from './init/prompt';

export class MaterialResourcesCollection {
  manifestsTemplates: MaterialResourcesConfigType[] = [];
  manifestsMaterials: MaterialResourcesConfigType[] = [];
  templateResources: MaterialResources[] = [];
  materialResources: MaterialResources[] = [];
  // promots: InquirePrompt[] = MaterialPrompts;

  constructor(private options: any) {}

  async init() {
    const { templates, materials } = loadManifestConfig();
    // 指定本地的
    if (this.options.local) {
      this.manifestsMaterials = [
        {
          name: 'local',
          description: '',
          localPath: this.options.local,
        },
      ];
    } else {
      this.manifestsTemplates = templates;
      this.manifestsMaterials = materials;
    }
    await this.copyResource('template');
    await this.copyResource('material');
  }

  async copyResource(type: string): Promise<void> {
    return new Promise(async (resolve) => {
      const UpType = type
        .toLowerCase()
        .replace(/( |^)[a-z]/g, (L) => L.toUpperCase());
      this[`manifests${UpType}s`].forEach(
        (config: MaterialResourcesConfigType) => {
          // console.log(config, new MaterialResources(config),  '1sdfa')
          this[`${type}Resources`].push(new MaterialResources(config));
        },
      );

      const notInit = this[`${type}Resources`].filter(
        (b: MaterialResources) => !b.inited,
      );
      if (notInit.length) {
        await cloneMaterials(notInit, type);
      }
      return resolve();
    });
  }

  /**
   *
   * @param key string '[scope]@[materialName]'
   */
  async getFinalMaterial(
    projectName: string,
    key?: string,
    packagePath?: string,
  ) {
    let result: any;

    if (key) {
      const [, template, scope] = key.split('-');
      if (!template || !scope) {
        throw new Error(`${key} 不符合格式：[scope]@[materialName]`);
      }
      for (let i = 0; i < this.templateResources.length; ++i) {
        const _materialResource = this.templateResources[i];
        if (_materialResource.config.name === key) {
          result = await _materialResource.combineResource();
        }
      }
      return console.log(1);
      createProject(projectName, result);
      return result;
    } else {
      const names = this.templateResources.map((source) => source.config.name);
      const { templateAns } = await InquireTemplateCollection(names);
      const materialResource: MaterialResources = this.templateResources.filter(
        (source) => source.config.name === templateAns,
      )[0];
      result = await materialResource.combineResource();
      createProject(projectName, result);
      return result;
    }
  }

  listAllManifest(): Pick<
    MaterialResourcesConfigType,
    'name' | 'description'
  >[] {
    return this.manifestsMaterials.map(({ name, description }) => ({
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
