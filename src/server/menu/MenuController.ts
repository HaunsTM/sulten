import * as express from "express";
import HttpException from "../exceptions/HttpException";
import IController from "../interfaces/IController";
import { AreaService } from "../repository/AreaService";
import { MealService } from "../repository/MealService";

export default class MenuController implements IController {
    public path = "/menu";
    public router = express.Router();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(`${this.path}/getAllAreas`,  this.getAllAreas);
        this.router.get(`${this.path}/getMealsPerAreaAndWeekAndYear/:areaId/:weekNumber/:weekYear`,
            this.getMealsPerAreaAndWeekAndYear);
        this.router.get(`${this.path}/getMealsPerAreaAndDayAndWeekAndYear/:areaId/:javaScriptDayIndex/:weekNumber/:weekYear`,
            this.getMealsPerAreaAndDayAndWeekAndYear);
    }

    private async getAllAreas(
        request: express.Request, response: express.Response, next: express.NextFunction): Promise<void> {

        try {
            const areaService = new AreaService();
            const allAreas = await areaService.getAllAreas();

            response.status(200);
            response.send(allAreas);

        } catch (e) {
            next(new HttpException(500, e));
        }

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

    private async getMealsPerAreaAndDayAndWeekAndYear(
        request: express.Request, response: express.Response, next: express.NextFunction) {

        try {
            const areaId = +request.params.areaId;
            const javaScriptDayIndex = +request.params.javaScriptDayIndex;
            const weekNumber = +request.params.weekNumber;
            const weekYear =  +request.params.weekYear;

            const mealService = new MealService();
            const mealsPerAreaAndWeekAndYear =
                await mealService.getMealsPerAreaAndDayAndWeekAndYear(areaId, javaScriptDayIndex, weekNumber, weekYear);

            response.send(mealsPerAreaAndWeekAndYear);

        } catch (e) {
            next(new HttpException(500, e));
        }

    }

}
