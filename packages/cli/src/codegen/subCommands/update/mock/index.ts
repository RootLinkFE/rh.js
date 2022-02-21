import { mock } from './mock';
import fse from 'fs-extra';
import prettier from 'prettier';
import chalk from 'chalk';
import { chooseSpec, getAllResources } from '../../../utils';

export default async (
  swaggerUrl: string,
  config: {
    globalConfig: {
      mockConfig: {
        independentServer: boolean;
        outputFolder: string;
      };
    };
    group: any;
    specUrls: string | any[];
    all?: boolean;
  },
) => {
  const mockConfig = config.globalConfig.mockConfig;
  const outputFolder = mockConfig.outputFolder + '/mock';
  const newConfig = {
    ...config,
    mockConfig: {
      ...mockConfig,
      outputFolder,
      ext: '.js',
    },
  };

  if (newConfig.group) {
    let resources = null;
    if (newConfig.specUrls && newConfig.specUrls.length) {
      resources = newConfig.specUrls;
    } else {
      resources = await getAllResources(swaggerUrl);
      if (!newConfig.all) {
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
  if (mockConfig.independentServer) {
    await genIndex({ ...newConfig.mockConfig, outputFolder });
  }
  console.log(chalk.green('生成 mock 数据成功！'));
};

async function genIndex({ outputFolder, port, ext }: any) {
  fse.readdir(outputFolder, function (err, files) {
    if (err) {
      console.log(err);
      return;
    }
    const extReg = new RegExp(`${ext}`, 'g');
    const filteredFiles = files.filter(
      (name) => extReg.test(name) && name.indexOf('entry-mock' + ext) === -1,
    );
    const imports = filteredFiles.map((file) => {
      const fileName = file.replace(extReg, '');
      return `import ${fileName} from './${fileName}';\r\n`;
    });
    const uses = filteredFiles.map(
      (file) => `useMethods(${file.replace(extReg, '')});\r\n`,
    );
    const code = `
    import express from 'express';
    ${imports.join('')}
    const app = express()
    const port = ${port || 8081}

    function useMethods(pathSet){
      Object.keys(pathSet).forEach(item=>{
       const [method, path] = item.split(' ');
       app[method.toLowerCase()](path, pathSet[item])
      })
    }

    ${uses.join('')}

    app.listen(port, () => {
      console.log(\`running in \${port}\`)
    })
    `;
    fse.writeFileSync(
      outputFolder + '/entry-mock' + ext,
      prettier.format(code, { parser: 'babel' }),
    );
    // const packageJson = {
    //   name: 'mock',
    //   version: '1.0.0',
    //   description: '',
    //   main: 'index.js',
    //   scripts: {
    //     test: 'echo "Error: no test specified" && exit 1',
    //   },
    //   author: '',
    //   license: 'ISC',
    //   dependencies: {
    //     express: '^4.17.2',
    //     mockjs: '^1.1.0',
    //   },
    // };
    // fse.writeFile(
    //   outputFolder + '/package.json',
    //   JSON.stringify(packageJson, null, 2),
    // );
  });
}
