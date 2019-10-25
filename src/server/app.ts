import express from "express";
import Controller from "./interfaces/controller.interface";
// import errorMiddleware from "./middleware/error.middleware";

/** Following tutorial https://wanago.io/2018/12/03/typescript-express-tutorial-routing-controllers-middleware/ */

export default class App {


  public app: express.Application;

  constructor(controllers: Controller[]) {
    this.app = express();

    this.initializeControllers(controllers);
    // this.initializeErrorHandling();
  }

  public listen() {
    //this.app.listen(process.env.PORT, () => {
    //  console.log(`App listening on the port ${process.env.PORT}`);
    //});
    
  const port = 8080;
    this.app.listen(port, () => {
      console.log(`App listening on the port ${port}`);
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
