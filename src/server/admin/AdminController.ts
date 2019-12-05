import * as express from "express";
import HttpException from "../exceptions/HttpException";
import { HtmlFetcher } from "../helpers/HtmlFetcher";
import IController from "../interfaces/IController";
import { MealService } from "../repository/MealService";
import { GlasklartDealer } from "./MealDealers/GlasklartDealer";
import { KolgaDealer } from "./MealDealers/KolgaDealer";
import { MiamariasDealer } from "./MealDealers/MiamariasDealer";
import { DealerService } from "./MealDealers/DealerService";

export default class AdminController implements IController {
    public path = "/admin";
    public router = express.Router();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(`${this.path}/fetchMenusForAllAreas/:weekIndex`, this.fetchMenusForAllAreas);
        this.router.get(`${this.path}/fetchMenusForArea/:id`, this.fetchMenusForAreaId);
    }

    private async fetchMenusForAllAreas(
        request: express.Request, response: express.Response, next: express.NextFunction) {

        try {
            const weekIndex = request.params.weekIndex;
            const weekYear =  new Date().getFullYear().toString();

            const dealerService = new DealerService();
            const mealService = new MealService();

            const allMeals = await dealerService.mealsFromActiveDealers(weekYear, weekIndex);

            await mealService.bulkInsert(allMeals);
            response.send(allMeals);

        } catch (e) {
            next(new HttpException(500, e));
        }
    }

    private fetchMenusForAreaId(request: express.Request, response: express.Response, next: express.NextFunction) {
        const id = request.params.id;

        response.send("NOT IMPLEMENTED");
    }
}
