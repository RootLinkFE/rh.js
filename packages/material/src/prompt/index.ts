import inquirer from 'inquirer';

export function InquireInitRemoteLib() {
  const initLibQues = [
    {
      name: 'isInitLib',
      type: 'confirm',
      message: '远程物料库有更新是否增量下载:',
      default: true
    },
  ];
  return inquirer.prompt(initLibQues);
}

export function InquireTemplateCollection(sources: Array<string>) {
  const materialQues = [
    {
      name: 'templateAns',
      type: 'list',
      message: '请选择模板:',
      choices: sources,
      default: sources[0]
    },
  ];
  return inquirer.prompt(materialQues);
}

export function InquireMaterialsCollection(sources: Array<string>) {
  const materialQues = [
    {
      name: 'materialAns',
      type: 'list',
      message: '请选择物料库:',
      choices: sources,
      default: sources[0]
    },
  ];
  return inquirer.prompt(materialQues);
}
