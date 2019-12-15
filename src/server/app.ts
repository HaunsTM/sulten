#!/usr/bin/env nodejs
import express from "express";
import Controller from "./interfaces/IController";
// import errorMiddleware from "./middleware/error.middleware";

/** Following tutorial https://wanago.io/2018/12/03/typescript-express-tutorial-routing-controllers-middleware/ */

export default class App {

  public app: express.Application;

  private readonly PORT = 8080;

  constructor(controllers: Controller[]) {
    this.app = express();

    this.initializeControllers(controllers);
    // this.initializeErrorHandling();
  }

  public listen() {
    this.app.listen(this.PORT, () => {
      // tslint:disable-next-line:no-console
      console.log(`App listening on the port ${this.PORT}`);
    });
  }

  public getServer() {
    return this.app;
  }

/*
  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }
*/

  private initializeControllers(controllers: Controller[]) {
    controllers.forEach((controller) => {
      this.app.use("/", controller.router);
    });
  }

}
