import * as express from "express";
import HttpException from "../exceptions/HttpException";
import DatabaseHelper from "../helpers/database.hlp";
import {HtmlFetcher} from "../helpers/htmlFetcher.hlp";
import Controller from "../interfaces/controller.itf";
//import { MiaMariasNu } from "./mealDealers/miamarias_nu.dlr";

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

  private async fetchMenusForAllAreas(
      request: express.Request, response: express.Response, next: express.NextFunction) {

    try {
        // const miaMariasNu = new MiaMariasNu();

      // const meals = miaMariasNu.mealsFromWeb();
      const htmlFetcher = new HtmlFetcher("https://kolga.gastrogate.com/lunch/");
      const htmlFetcherString = await htmlFetcher.htmlFromWeb();
let i =  0;

    } catch (e) {
        next(new HttpException(500, e));
    }
  }

  private fetchMenusForAreaId(request: express.Request, response: express.Response, next: express.NextFunction) {
    const id = request.params.id;

    response.send("NOT IMPLEMENTED");
  }
}
