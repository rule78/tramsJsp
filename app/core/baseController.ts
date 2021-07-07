import { Controller } from 'egg';

export default class BaseController extends Controller {
  validateParam(rule: any, value: any) {
    try {
      this.ctx.validate(rule, value);
    } catch (err) {
      const msg = Object.assign(
        this.app.config.error[400],
        { detail: `Parameter [${err.errors[0].field}] ${err.errors[0].message}` });
      this.ctx.throw(400, { msg });
    }
  }
  throwError(code: string | number, status?: number) {
    this.ctx.throw(status || 200, { msg: this.config.error[code] });
  }
  returnSuccess(result: any, status: number = 200) {
    this.ctx.status = status;
    this.ctx.body = {
        success: true,
        data: result,
    };
  }
  returnError(code: number) {
    this.throwError(code);
  }
  returnMessage(code: number, message: any) {
    const msg = Object.assign(
      this.config.error[code],
      { detail: message });
    this.ctx.throw(code, { msg });
  }
}
