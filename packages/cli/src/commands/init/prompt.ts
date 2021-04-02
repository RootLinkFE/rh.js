import inquirer from 'inquirer';

export function InquireMaterialCollection() {
  const materialQues = [
    {
      name: 'materialAns',
      type: 'list',
      message: '请选择物料库:',
      choices: ['rh-material'],
      default: 'rh-material'
    },
  ];
  return inquirer.prompt(materialQues);
}
