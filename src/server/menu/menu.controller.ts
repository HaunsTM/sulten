import * as express from "express";
import HttpException from "../exceptions/HttpException";
import IController from "../interfaces/controller.itf";
import { AreaService } from "../repository/AreaService";

export default class MenuController implements IController {
    public path = "/menu";
    public router = express.Router();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(`${this.path}/getAllAreas`,  this.getAllAreas);
        this.router.get(`${this.path}/areaId/:areaId/weekNumber/:weekNumber`,  this.getMenuForArea);
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

    private async getMenuForArea(
        request: express.Request, response: express.Response, next: express.NextFunction): Promise<void> {
        // http://localhost:8080/menus/areaName/vastraHamnen/weekNumber/201943

        response.send("NOT IMPLEMENTED");
        try {
            const areaService = new AreaService();
            const allAreas = await areaService.getAllAreas();

            const areaId = request.params.areaId;
            const weekNumber = request.params.weekNumber;

            response.status(200);
            response.send(allAreas);

        } catch (e) {
            next(new HttpException(500, e));
        }
    }

}
