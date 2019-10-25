import "reflect-metadata";

import AdminController from "./admin/admin.controller";
import App from "./app";
import MenuController from "./menu/menu.controller";

// https://developer.okta.com/blog/2019/05/07/nodejs-typescript-api
const port = 8080 || process.env.PORT;

const app = new App(
    [
      new AdminController(),
      new MenuController(),
    ],
  );

app.listen();
