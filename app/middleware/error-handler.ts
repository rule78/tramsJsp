'use strict';

import { Context } from 'egg';

export default function errorHandlerMiddleWare(): any {
  return async (ctx: Context, next: () => Promise<any>) => {
    try {
      await next();
    } catch (err) {
      ctx.helper.printLog(err);
      const status = err.status || 500;
      if (status === 500) { // 内部错误
        ctx.body = {
          success: false,
          error: ctx.app.config.error[500],
        };
      } else {
        ctx.body = {
          success: false,
          error: err.msg,
        };
      }
      ctx.status = status;
    }
  };
}
