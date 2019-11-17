import * as express from "express";
import HttpException from "../exceptions/HttpException";
import { HtmlFetcher } from "../helpers/htmlFetcher.hlp";
import IController from "../interfaces/controller.itf";
import { InitializerService } from "../repository/InitializerService";
import { KolgaDealer } from "./MealDealers/KolgaDEALER";
import { MiamariasDealer } from "./MealDealers/MiamariasDealer";

import { MealService } from "../repository/MealService";

export default class AdminController implements IController {
    public path = "/admin";
    public router = express.Router();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(`${this.path}/initializeAndSetupDb`, this.initializeAndSetupDb);
        this.router.get(`${this.path}/fetchMenusForAllAreas/:weekIndex`, this.fetchMenusForAllAreas);
        this.router.get(`${this.path}/fetchMenusForArea/:id`, this.fetchMenusForAreaId);
    }

    private async initializeAndSetupDb(
        request: express.Request, response: express.Response, next: express.NextFunction) {

        try {
            const initializerService = new InitializerService();
            await initializerService.initializeAndSetupDb();

            response.status(200);
            response.send("Database created and initialized successfully!");
        } catch (e) {
            next(new HttpException(500, e));
        }

    }

    private async fetchMenusForAllAreas(
        request: express.Request, response: express.Response, next: express.NextFunction) {

        try {
            const weekIndex = request.params.weekIndex;
            const weekYear =  new Date().getFullYear().toString();

            const kolgaFetcher = new HtmlFetcher("https://kolga.gastrogate.com/lunch/");
            const kolgaGastroGate = new KolgaDealer( kolgaFetcher, weekYear, weekIndex );
            const kolgaGastroGateMealsFromWeb = await kolgaGastroGate.mealsFromWeb();

            const miaMariasFetcher = new HtmlFetcher("http://www.miamarias.nu/");
            const miamariasNu = new MiamariasDealer( miaMariasFetcher, weekYear, weekIndex );
            const miamariasNuMealsFromWeb = await miamariasNu.mealsFromWeb();

            let mealService = new MealService();

            await mealService.bulkInsert(miamariasNuMealsFromWeb);

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
