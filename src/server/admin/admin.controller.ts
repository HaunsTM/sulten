import * as express from "express";
import HttpException from "../exceptions/HttpException";
import DatabaseHelper from "../helpers/database.hlp";
import {HtmlFetcher} from "../helpers/htmlFetcher.hlp";
import Controller from "../interfaces/controller.itf";
import { KolgaDealer } from "./mealDealers/kolga.dlr";
import { WeekIndex } from "../oRModels/weekIndex.mdl";
import { WeekDayHelper } from "../helpers/weekDay.hlp";
import { MiamariasDealer } from "./mealDealers/miamarias.dlr";

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
        const weekIndex = 44;
        const kolgaFetcher = new HtmlFetcher("https://kolga.gastrogate.com/lunch/");
        const kolgaGastroGate = new KolgaDealer( kolgaFetcher, weekIndex );
        const kolgaGastroGateMealsFromWeb = await kolgaGastroGate.mealsFromWeb();


        const miaMariasFetcher = new HtmlFetcher("http://www.miamarias.nu/");
        const miamariasNu = new MiamariasDealer( miaMariasFetcher, weekIndex );
        const miamariasNuMealsFromWeb = await miamariasNu.mealsFromWeb();

        response.send(miamariasNuMealsFromWeb);

    } catch (e) {
        next(new HttpException(500, e));
    }
  }

  private fetchMenusForAreaId(request: express.Request, response: express.Response, next: express.NextFunction) {
    const id = request.params.id;

    response.send("NOT IMPLEMENTED");
  }
}
