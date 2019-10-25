import * as express from "express";
import HttpException from "../exceptions/HttpException"
import DatabaseHelper from "../helpers/database.hlp";
import Controller from "../interfaces/controller.interface";

export default class AdminController implements Controller {
  public path = "/admin";
  public router = express.Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/initializeAndSetupDb`, this.initializeAndSetupDb);
    this.router.get(`${this.path}/fetchMenusForAllAreas`, this.fetchMenusForAllAreas);
    this.router.get(`${this.path}/fetchMenusForArea/:id`, this.fetchMenusForAreaId);
  }

  private async initializeAndSetupDb(request: express.Request, response: express.Response, next: express.NextFunction) {

    try {
      const databaseHelper = new DatabaseHelper();
      await databaseHelper.initializeAndSetupDb();

      response.status(200);
      response.send("Database created and initialized successfully!");
    } catch (e) {
      next(new HttpException(500, e));
    }

  }

  private fetchMenusForAllAreas =
    (request: express.Request, response: express.Response, next: express.NextFunction) => {

    response.send("NOT IMPLEMENTED");
  }

  private fetchMenusForAreaId = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    const id = request.params.id;

    response.send("NOT IMPLEMENTED");
  }
}
