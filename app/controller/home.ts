import BaseController from '../core/baseController';

export default class HomeController extends BaseController {
  constructor(ctx) {
    super(ctx);
  }
  async index() {
    this.ctx.body = 'Hello world';
  }
}
