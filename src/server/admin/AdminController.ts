import * as express from "express";
import HttpException from "../exceptions/HttpException";
import { HtmlFetcher } from "../helpers/HtmlFetcher";
import IController from "../interfaces/IController";
import { InitializerService } from "../repository/InitializerService";
import { MealService } from "../repository/MealService";
import { GlasklartDealer } from "./MealDealers/GlasklartDealer";
import { KolgaDealer } from "./MealDealers/KolgaDealer";
import { MiamariasDealer } from "./MealDealers/MiamariasDealer";

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
}
