import { mock } from './mock';
import fse from 'fs-extra';
import { getAllResources } from '../api/swagger-resources';
import prettier from 'prettier';
import chalk from 'chalk';
import { chooseSpec } from '../../../../commands/api/choose';

export default async (
  swaggerUrl: string,
  config: {
    globalConfig: { outputFolder: string };
    group: any;
    specUrls: string | any[];
    choose?: boolean;
  },
) => {
  const newConfig = {
    ...config,
    outputFolder: config.globalConfig.outputFolder + '/mock',
  };

  if (newConfig.group) {
    let resources = null;
    if (newConfig.specUrls && newConfig.specUrls.length) {
      resources = newConfig.specUrls;
    } else {
      resources = await getAllResources(swaggerUrl);
      if (newConfig.choose) {
        resources = await chooseSpec(
          resources.map(
            (item: { url: any; name: any }) => `${item.name}(${item.url})`,
          ),
        );
      }
      resources.forEach((item: { url: string }) => {
        item.url = encodeURI(swaggerUrl + item.url);
      });
    }

    for (let i = 0; i < resources.length; i++) {
      await mock.init(
        {
          url: resources[i].url,
        },
        newConfig,
      );
    }
  } else {
    await mock.init(
      {
        url: swaggerUrl,
      },
      newConfig,
    );
  }
  await genIndex(newConfig);
  console.log(chalk.green('生成 mock 数据成功！'));
};

async function genIndex({ outputFolder }: { outputFolder: string }) {
  fse.readdir(outputFolder, function (err, files) {
    if (err) {
      console.log(err);
      return;
    }
    const filteredFiles = files.filter(
      (name) => /.js$/.test(name) && name.indexOf('index.js') === -1,
    );
    const imports = filteredFiles.map(
      (file) =>
        `const ${file.replace(/.js$/g, '')} = require('./${file}');\r\n`,
    );
    const uses = filteredFiles.map(
      (file) => `${file.replace(/.js$/g, '')}(app);\r\n`,
    );
    const code = `
    const express = require('express');
    ${imports.join('')}
    const app = express()
    const port = 3000

    ${uses.join('')}

    app.listen(port, () => {
      console.log(\`running in \${port}\`)
    })
    `;
    fse.writeFileSync(
      outputFolder + '/index.js',
      prettier.format(code, { parser: 'babel' }),
    );
    const packageJson = {
      name: 'mock',
      version: '1.0.0',
      description: '',
      main: 'index.js',
      scripts: {
        test: 'echo "Error: no test specified" && exit 1',
      },
      author: '',
      license: 'ISC',
      dependencies: {
        express: '^4.17.2',
        mockjs: '^1.1.0',
      },
    };
    fse.writeFile(
      outputFolder + '/package.json',
      JSON.stringify(packageJson, null, 2),
    );
  });
}
