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
  const url = new URL('./swagger-resources', swUrl);
  return new Promise((resolve, reject) => {
    request.get(url.toString(), function (err, res, body) {
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
