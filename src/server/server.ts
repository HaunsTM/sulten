#!/usr/bin/env nodejs
import { createConnection } from "typeorm";
import AdminController from "./admin/AdminController";
import App from "./app";
import MenuController from "./menu/MenuController";

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
