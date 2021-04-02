import { MaterialResources } from '../material-resources';
import inquirer from 'inquirer';

export type InquirePrompt = {
  name: string;
  when?: string;
  type: string;
  default?: string | number | boolean;
  message?: string;
  choices?: Array<any>;
};

export class MaterialPrompt {
  scaffoldsTypeList: Array<InquirePrompt> = [];
  pagesList: Array<InquirePrompt> = [];
  blocksList: Array<InquirePrompt> = [];

  resource: any = {
    scaffolds: [],
    pages: {},
    blocks: {},
  };

  constructor(_resource: any) {
    this.resource = _resource;
    this.getScaffoldsTypeList();
  }

  getPrompts() {
    return [...this.scaffoldsTypeList, ...this.pagesList, ...this.blocksList];
  }

  async inquireCombineMaterial() {
    let promptsCollection = {};
    const { scaffolds } = await inquirer.prompt(this.scaffoldsTypeList);
    this.getBlocksList(scaffolds);
    this.getPagesList(scaffolds);
    const { pages } = await inquirer.prompt(this.pagesList);
    const { blocks } = await inquirer.prompt(this.blocksList);
    promptsCollection = {
      scaffolds,
      pages,
      blocks,
    };
    return promptsCollection;
  }

  getScaffoldsTypeList() {
    // const choices = this.resource.scaffolds
    this.scaffoldsTypeList.push({
      name: 'scaffolds',
      type: 'list',
      message: '请选择该项目所使用的模板:',
      choices: this.resource.scaffolds,
      default: 'vue',
    });
  }

  getBlocksList(who: string) {
    const choices = this.resource.blocks[who]?.lists.map((item: any) => item.name) || []
    this.blocksList.push({
      name: 'blocks',
      message: '请选择添加的物料:',
      type: 'checkbox',
      choices,
    });
  }

  getPagesList(who: string) {
    const choices = this.resource.pages[who]?.lists.map((item: any) => item.name) || []
    this.pagesList.push({
      name: 'pages',
      message: '请选择需要添加的页面:',
      type: 'checkbox',
      choices
    });
  }
}
