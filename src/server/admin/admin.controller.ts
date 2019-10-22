import * as express from "express";
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

  private initializeAndSetupDb =
    async (request: express.Request, response: express.Response, next: express.NextFunction) => {

    response.send("NOT IMPLEMENTED");

    // const connection = await createConnection();
    // const area = new Area();

    // area.Name = "Västra Hamnen";

    // await connection.manager.save(area);
    // const areas = await connection.manager.find(Area);

    // response.send(areas);

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
