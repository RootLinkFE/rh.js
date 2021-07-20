import {
  compareLocalMaterials,
  loadCliManifestConfig,
  readLocalManifestConfig,
  LocalMaterialsType,
  MaterialResourcesConfigType,
  isInit,
} from './init';
import { cloneMaterials } from './init/clone-materials';
import { createProject } from './init/create-project';
import { MaterialTypeKeys, Material } from './material';
import { MaterialResources, MaterialConfigType } from './material-resources';
import { InquireInitRemoteLib, InquireTemplateCollection } from './prompt';
import execa from 'execa';
// import { InquirePrompt, MaterialPrompts } from './init/prompt';

export class MaterialResourcesCollection {
  manifestsTemplates: MaterialResourcesConfigType[] = [];
  manifestsMaterials: MaterialResourcesConfigType[] = [];
  templateResources: MaterialResources[] = [];
  materialResources: MaterialResources[] = [];
  // promots: InquirePrompt[] = MaterialPrompts;

  constructor(private options: any) {}

  async init(): Promise<boolean> {
    return new Promise(async (resolve) => {
      const localMaterialsType: LocalMaterialsType =
        await compareLocalMaterials();
      const { templates, materials } = loadCliManifestConfig();
      // 指定本地的
      if (this.options.local) {
        this.manifestsMaterials = [
          {
            name: 'local',
            description: '',
            localPath: this.options.local,
          },
        ];
      }

      this.manifestsTemplates = templates;
      this.manifestsMaterials = materials;

      const templateInits = this.copyResource('template');
      const materialInits = this.copyResource('material');
      if (localMaterialsType !== 'init') {
        if (localMaterialsType === 'update') {
          const { isInitLib } = await InquireInitRemoteLib();
          if (isInitLib) {
            await cloneMaterials(templateInits, 'template');
            await cloneMaterials(materialInits, 'material');
            return resolve(true);
          }
        }
      } else {
        await cloneMaterials(templateInits, 'template');
        await cloneMaterials(materialInits, 'material');
        return resolve(true);
      }
      return resolve(false);
    });
  }

  copyResource(type: string): MaterialResources[] {
    const UpType = type
      .toLowerCase()
      .replace(/( |^)[a-z]/g, (L) => L.toUpperCase());

    this[`manifests${UpType}s`].forEach(
      (config: MaterialResourcesConfigType) => {
        this[`${type}Resources`].push(new MaterialResources(config));
      },
    );

    const notInit = this[`${type}Resources`].filter(
      (b: MaterialResources) => !b.inited,
    );
    if (notInit.length) {
      return notInit;
    }
    return [];
  }

  /**
   * 根据依赖生成项目
   * @param projectName 项目名
   * @param templateName? 模板名 配合命令 -t
   * @param libName? 物料库名 配合命令 -l
   * @param materialsName? 物料名 配合命令 -m
   * @returns
   */
  async getFinalMaterial(
    projectName: string,
    templateName?: string,
    libName?: string,
    materialsName?: string,
  ) {
    let result: any;

    if (templateName) {
      // if (!template) {
      //   throw new Error(`${key} 不符合格式：[scope]@[materialName]`);
      // }
      for (let i = 0; i < this.templateResources.length; ++i) {
        const _materialResource = this.templateResources[i];
        if (_materialResource.config.name === templateName) {
          if (!libName && !materialsName) {
            // 单纯模板生成
            result = await _materialResource.combineResource();
          } else {
            // 模板、物料库、物料组合生成
            const _materialsName = materialsName.split(/[,，\/]/);
            result = await _materialResource.combineAllResource(
              libName,
              _materialsName,
            );
          }
        }
      }
      createProject(projectName, result);
      return result;
    } else {
      let names: string[] = [];
      this.templateResources.map((source) => {
        if (source.inited) names.push(source.config.name);
      });
      const { templateAns } = await InquireTemplateCollection(names);
      const materialResource: MaterialResources = this.templateResources.filter(
        (source) => source.config.name === templateAns,
      )[0];
      result = await materialResource.combineAllResource();
      createProject(projectName, result);
      return result;
    }
  }

  listAllManifest(): Pick<
    MaterialResourcesConfigType,
    'name' | 'belong' | 'description'
  >[] {
    const materials = [...this.manifestsTemplates, ...this.manifestsMaterials];
    return materials.map(({ name, belong, description }) => ({
      name,
      belong,
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
