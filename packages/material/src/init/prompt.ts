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
    pages: [],
    blocks: [],
  };

  constructor(_resource: any) {
    this.resource = _resource;
    // this.getScaffoldsTypeList();
  }

  getPrompts() {
    return [...this.scaffoldsTypeList, ...this.pagesList, ...this.blocksList];
  }

  async inquireCombineMaterial() {
    let promptsCollection = {};
    const { scaffolds } = await inquirer.prompt(this.scaffoldsTypeList);
    this.resource.pages.length && this.getPagesList();
    this.resource.blocks.length && this.getBlocksList();
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

  getBlocksList() {
    const choices = this.resolveUIName('blocks');
    this.blocksList.push({
      name: 'blocks',
      message: `请选择添加的区块（${this.resource.blocks.length}个）:`,
      type: 'checkbox',
      choices,
    });
  }

  getPagesList() {
    const choices = this.resolveUIName('blocks');
    this.pagesList.push({
      name: 'pages',
      message: `请选择需要添加的页面（${this.resource.pages.length}个）:`,
      type: 'checkbox',
      choices,
    });
  }

  resolveUIName(who: string): Array<string | object> {
    let result: Array<string | object> = [];
    this.resource[who].map((item: any, index: number) => {
      const uiName = item.baseOn || 'lib'
      if (!index) {
        result.push(new inquirer.Separator(`UI库: ${uiName}`));
      } else {
        if (this.resource[who][index - 1]['baseOn'] !== item['baseOn'])
          result.push(new inquirer.Separator(`UI库: ${uiName}`));
      }
      result.push({
        name: `${item.key}[${item.title}]`,
        value: `${item.belongLib || 'ant-design-vue'}:blocks:${item.key}`   //${item.type}
      });
    });
    return result;
  }
}
