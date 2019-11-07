import { getConnection } from "typeorm";
import { EnumArea } from "../enum/area.enum";
import { EnumDishLabel } from "../enum/dishLabel.enu";
import { EnumWeekDay } from "../enum/weekDay.enu";
import { Area } from "./entities/area.mdl";
import { Label } from "./entities/label.mdl";
import { WeekDay } from "./entities/weekDay.mdl";

import { IWebMealResult } from "../interfaces/webMealResult.itf";

export class MealModule {


    public async saveSingleMeal(webMealResult: IWebMealResult): Promise<number> {

    }

}
