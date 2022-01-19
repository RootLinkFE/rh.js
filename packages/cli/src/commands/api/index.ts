import commander from 'commander';
import SwaggerAPI from './swagger-api';
import { chooseApi } from './choose';
/**
 * 根据Swagger生成API
 * @param program
 */
export default function InitCommand(program: commander.Command) {
  program
    .command('api <swagger-path>')
    .description(
      'Generate api via swagger scheme.\nSupports OA 3.0, 2.0, JSON, yaml.',
    )
    .option(
      '-o, --output <output>',
      'output path of typescript api file',
      './src/rh/apis',
    )
    .option('-y, --yes', 'A positive answer')
    .option('-n, --no', 'A negative answer')
    .option('--js', 'generate js api module with declaration file', false)
    .option('--axiosConfig <path>', 'export default axios config file path')
    .option('-c, --choose', 'choose apiUrl')
    .action(async function (swaggerPath, config) {
      let sPath = swaggerPath;
      if (config.choose) {
        sPath += await chooseApi(swaggerPath);
        sPath = encodeURI(sPath.replace('/swagger-resources', ''));
      }
      await SwaggerAPI(sPath, config);
    });
}
