import * as express from "express";
import HttpException from "../exceptions/HttpException";
import { EpochHelper } from "../helpers/EpochHelper";
import IController from "../interfaces/IController";
import { MealService } from "../repository/MealService";
import { DealerService } from "./DealerService";
import { NodeMailer } from "../helpers/NodeMailer";

export default class AdminController implements IController {
    public path = "/admin";
    public router = express.Router();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(
            `${this.path}/fetchMenusForAllAreas/:weekIndex`,
            this.fetchMenusForAllAreas.bind(this));
        this.router.get(
            `${this.path}/fetchMenusForArea/:id`,
            this.fetchMenusForAreaId.bind(this));
    }

    private async fetchMenusForAllAreas(
        request: express.Request, response: express.Response, next: express.NextFunction) {
        let dealerFetchAndDbInsertReport = "NO_REPORT";
        const mailer = new NodeMailer();

        try {

            const weekIndex = request.params.weekIndex;
            const weekYear =  new Date().getFullYear().toString();

            const messageOrderIsBeingProcessed =  this.htmlMessage("Processing...", "Menus are being fetched and processed.");
            response.set("Content-Type", "text/html");
            response.send(messageOrderIsBeingProcessed);

            dealerFetchAndDbInsertReport = await this.fetchMenusFromInternetAndSaveToDb(weekYear, weekIndex);

        } catch (e) {
            dealerFetchAndDbInsertReport = e;
        }

        await mailer.sendMail("sulten.se: menu fetch process report", dealerFetchAndDbInsertReport);
    }

    private htmlMessage(header: string, paragraph: string): string {
        const htmlMessage =
        `
            <h1>${header}</h1>
            <p>${paragraph}</p>
        `;
        return htmlMessage;
    }
    private async fetchMenusFromInternetAndSaveToDb(weekYear: string, weekIndex: string): Promise<string> {
        let dealerFetchAndDbInsertReport = "NO_REPORT_FETCHED";

        try {
            const dealerService = new DealerService();
            const mealService = new MealService();
            const epochHelper = new EpochHelper();

            const lastUpdatedUTCTimestamp = epochHelper.getCurrentUTCTimestamp();

            const resultsFromActiveDealers = await dealerService.resultsFromActiveDealers(weekYear, weekIndex);
            const mealsFromActiveDealers = DealerService.mealsFromActiveDealers(resultsFromActiveDealers);
            dealerFetchAndDbInsertReport = DealerService.dealerFetchAndDbInsertReport(resultsFromActiveDealers);

            await mealService.bulkInsert(mealsFromActiveDealers, lastUpdatedUTCTimestamp);
        } catch (e) {
            dealerFetchAndDbInsertReport = `ERROR FETCH AND SAVE MENUS:\n-------\n ${e}`;
        }

        return dealerFetchAndDbInsertReport;

    }

    private fetchMenusForAreaId(request: express.Request, response: express.Response, next: express.NextFunction) {
        const id = request.params.id;

        response.send("NOT IMPLEMENTED");
    }
}
