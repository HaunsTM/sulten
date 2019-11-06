import { getConnection } from "typeorm";
import { EnumArea } from "../enum/area.enum";
import { EnumDishLabel } from "../enum/dishLabel.enu";
import { EnumWeekDay } from "../enum/weekDay.enu";
import { Area } from "./entities/area.mdl";
import { Label } from "./entities/label.mdl";
import { WeekDay } from "./entities/weekDay.mdl";

import { IWebMealResult } from "../interfaces/webMealResult.itf";

export class MealRepository {


    public async saveSingleMeal(webMealResult: IWebMealResult): Promise<number> {

        const dbManager = getConnection().manager;

        try {
            const areas: Area[] = await dbManager.find(Area);
            return areas;
        } catch (e) {
            throw new Error(`Couldn't initialize database: ${e}`);
        }
    }

}
