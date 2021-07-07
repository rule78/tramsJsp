import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router } = app;
  router.get('/jsp/:name', controller.jsp.show);
};
