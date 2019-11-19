import * as express from "express";
import HttpException from "../exceptions/HttpException";
import { HtmlFetcher } from "../helpers/htmlFetcher.hlp";
import IController from "../interfaces/controller.itf";
import { InitializerService } from "../repository/InitializerService";
import { KolgaDealer } from "./MealDealers/KolgaDEALER";
import { MiamariasDealer } from "./MealDealers/MiamariasDealer";

import { MealService } from "../repository/MealService";
import { GlasklartDealer } from "./MealDealers/GlasklartDealer";

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
        this.router.get(`${this.path}/getMealsPerAreaAndWeekAndYear/:areaId/:weekNumber/:weekYear`,
            this.getMealsPerAreaAndWeekAndYear);
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
            const miamariasDealer = new MiamariasDealer( miaMariasFetcher, weekYear, weekIndex );
            const miamariasNuMealsFromWeb = await miamariasDealer.mealsFromWeb();

            const glasklartFetcher = new HtmlFetcher("https://glasklart.eu/sv/lunch/");
            const glasklartDealer = new GlasklartDealer( glasklartFetcher, weekYear, weekIndex );
            const glasklartMealsFromWeb = await glasklartDealer.mealsFromWeb();

            const mealService = new MealService();

            await mealService.bulkInsert(kolgaGastroGateMealsFromWeb);
            await mealService.bulkInsert(miamariasNuMealsFromWeb);
            await mealService.bulkInsert(glasklartMealsFromWeb);

            response.send(miamariasNuMealsFromWeb);

        } catch (e) {
            next(new HttpException(500, e));
        }
    }

    private fetchMenusForAreaId(request: express.Request, response: express.Response, next: express.NextFunction) {
        const id = request.params.id;

        response.send("NOT IMPLEMENTED");
    }

    private async getMealsPerAreaAndWeekAndYear(
        request: express.Request, response: express.Response, next: express.NextFunction) {

        try {
            const areaId = +request.params.areaId;
            const weekNumber = +request.params.weekNumber;
            const weekYear =  +request.params.weekYear;

            const mealService = new MealService();
            const mealsPerAreaAndWeekAndYear =
                await mealService.getMealsPerAreaAndWeekAndYear(areaId, weekNumber, weekYear);

            response.send(mealsPerAreaAndWeekAndYear);

        } catch (e) {
            next(new HttpException(500, e));
        }

    }
}
