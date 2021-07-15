import inquirer from 'inquirer';

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
