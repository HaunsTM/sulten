import * as express from "express";
import HttpException from "../exceptions/HttpException";
import DatabaseHelper from "../helpers/database.hlp";
import Controller from "../interfaces/controller.interface";

export default class MenuController implements Controller {
  public path = "/menu";
  public router = express.Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/getAllAreas`,  this.getAllAreas);
    this.router.get(`${this.path}/areaId/:areaId/weekNumber/:weekNumber`,  this.getMenuForArea);
  }

  private async getAllAreas(request: express.Request, response: express.Response, next: express.NextFunction): Promise<void> {

      try {
        const databaseHelper = new DatabaseHelper();
        const allAreas = await databaseHelper.getAllAreas();

        response.status(200);
        response.send(allAreas);
      } catch (e) {
        next(new HttpException(500, e));
      }

  }

  private getMenuForArea =
    (request: express.Request, response: express.Response, next: express.NextFunction) => {
    // http://localhost:8080/menus/areaName/vastraHamnen/weekNumber/201943
    const areaId = request.params.areaId;
    const weekNumber = request.params.weekNumber;

    response.send("NOT IMPLEMENTED");
  }

}
