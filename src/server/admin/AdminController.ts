import * as express from "express";
import HttpException from "../exceptions/HttpException";
import { logger } from "../helpers/default.logger";
import { EpochHelper } from "../helpers/EpochHelper";
import IController from "../interfaces/IController";
import { MealService } from "../repository/MealService";
import { DealerService } from "./DealerService";

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
            const epochHelper = new EpochHelper();

            const lastUpdatedUTCTimestamp = epochHelper.getCurrentUTCTimestamp();

            const allMeals = await dealerService.mealsFromActiveDealers(weekYear, weekIndex);
            logger.info(`Fetched ${allMeals.length} meal(s)`);

            await mealService.bulkInsert(allMeals, lastUpdatedUTCTimestamp);
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
