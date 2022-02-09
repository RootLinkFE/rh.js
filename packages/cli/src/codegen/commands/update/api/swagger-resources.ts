import request from 'request';

export type SwaggerResourcesType = {
  name: string;
  url: string;
  swaggerVersion: string;
  location: string;
};

export function getAllResources(
  swUrl: string,
): Promise<SwaggerResourcesType[]> {
  const url = swUrl.replace(/\/$/, '') + '/swagger-resources';

  return new Promise((resolve, reject) => {
    request.get(url, function (err, res, body) {
      if (err) {
        return reject(err);
      } else {
        try {
          const resources = JSON.parse(body);
          if (!Array.isArray(resources)) {
            return reject('resources is not valid');
          }
          resolve(resources);
        } catch (err) {
          reject(err);
        }
      }
    });
  });
}
