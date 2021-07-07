import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';

export default (appInfo: EggAppInfo) => {
  const config = {} as PowerPartial<EggAppConfig>;

  // override config from framework / plugin
  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1574995459292_260';

  // add your egg config in here
  config.security = {
    csrf: {
      enable: false,
      ignoreJSON: true, // 默认为 false，当设置为 true 时，将会放过所有 content-type 为 `application/json` 的请求
    },
  };
  config.middleware = [ 'errorHandler' ];
  config.error = {
    400: { code: 400, message: 'Invalid Param', detail: '' },
    401: { code: 401, message: 'Unauthorized', detail: '' },
    403: { code: 403, message: 'Forbidden', detail: '' },
    404: { code: 404, message: 'Not Found', detail: '' },
    500: { code: 500, message: 'Internal Server Error !', detail: '' },
    502: { code: 502, message: 'Remote Error', detail: '' },
  };
  // add your special config in here
  const bizConfig = {
    sourceUrl: `https://github.com/eggjs/examples/tree/master/${appInfo.name}`,
  };

  // the return config will combines to EggAppConfig
  return {
    ...config,
    ...bizConfig,
  };
};
