import * as express from "express";
import Controller from "../interfaces/controller.interface";

export default class MenuController implements Controller {
  public path = "/menu";
  public router = express.Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/:id/posts`,  this.availableAreas);
    this.router.get(`${this.path}/areaId/:areaId/weekNumber/:weekNumber`,  this.getMenuForArea);
  }


  private availableAreas =
    (request: express.Request, response: express.Response, next: express.NextFunction) => {
//    const dbConnection = await createConnection();
//    const areas = await dbConnection.manager.find(Area);

    response.send("NOT IMPLEMENTED");
  }

  private getMenuForArea =
    (request: express.Request, response: express.Response, next: express.NextFunction) => {
    // http://localhost:8080/menus/areaName/vastraHamnen/weekNumber/201943
    const areaId = request.params.areaId;
    const weekNumber = request.params.weekNumber;

    response.send("NOT IMPLEMENTED");
  }

}