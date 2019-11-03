import * as express from "express";
import HttpException from "../exceptions/HttpException";
import DatabaseHelper from "../helpers/database.hlp";
import {HtmlFetcher} from "../helpers/htmlFetcher.hlp";
import Controller from "../interfaces/controller.itf";
import { Kolga_Gastro_Gate_Com } from "./mealDealers/kolga_gastrogate_com.dlr";
import { WeekIndex } from "../oRModels/weekIndex.mdl";
import { WeekDayHelper } from "../helpers/weekDay.hlp";
import { Miamarias_Nu } from "./mealDealers/miamarias_nu";

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
        const kolgaGastroGate = new Kolga_Gastro_Gate_Com( kolgaFetcher, weekIndex )
        const kolgaGastroGateMealsFromWeb = await kolgaGastroGate.mealsFromWeb();


        const miaMariasFetcher = new HtmlFetcher("http://www.miamarias.nu/");
        const miamariasNu = new Miamarias_Nu( miaMariasFetcher, weekIndex )
        const miamariasNuMealsFromWeb = await miamariasNu.mealsFromWeb();
        
        response.send(miamariasNuMealsFromWeb);
        let kalle = 1;
      // const meals = miaMariasNu.mealsFromWeb();
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
