import BaseController from '../core/baseController';
const path = require('path');

export default class JSPController extends BaseController {
  constructor(ctx) {
    super(ctx);
  }
  async show() {
    const { ctx } = this;
    const {name : pathKey} = ctx.params;
    console.log(pathKey, 'pathKey');
    // 1.通过cookie、query参数请求页面主接口
    const res = await ctx.service.home.getHomeInfo(pathKey, ctx.query);
    console.log(res);
    
    // 2.node-jsp 模板渲染，宏替换
    // ctx.helper.createJspPreprocessor({}, formatResponse(res))(str, tpl, ()=> {

    //})

    // 3.babel-core转译
    ctx.body = ctx.helper.getHtml(path.resolve(__dirname, `../public/tpl/${pathKey}.html`));
  }
}
