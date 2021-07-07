import { Service } from 'egg';
const testApi = 'https://petstore.swagger.io/v2/swagger.json';

export default class HomeService extends Service {
    async getHomeInfo(pathKey: any, params) {
        console.log(pathKey, params)
        const result = await this.ctx.curl(
            testApi,
            { dataType: 'json' }
        );
        return result;
    }
}
