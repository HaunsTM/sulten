import "dotenv/config";
import "reflect-metadata";

import { createConnection } from "typeorm";
import AdminController from "./admin/admin.controller";
import App from "./app";
import MenuController from "./menu/menu.controller";

createConnection()
  .then(async () => {
    const app = new App(
      [
        new AdminController(),
        new MenuController(),
      ],
    );

    app.listen();
  })
  .catch(
    // tslint:disable-next-line:no-console
    (error) => console.log(error));
