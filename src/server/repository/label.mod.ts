import { EntityRepository, getConnection, Repository } from "typeorm";
import { EnumArea } from "../enum/area.enum";
import { EnumDishLabel } from "../enum/dishLabel.enu";
import { EnumWeekDay } from "../enum/weekDay.enu";
import { Area } from "./entities/area.mdl";
import { Label } from "./entities/label.mdl";
import { WeekDay } from "./entities/weekDay.mdl";

import { IWebMealResult } from "../interfaces/webMealResult.itf";

export class LabelModule {

}

// https://levelup.gitconnected.com/complete-guide-to-using-typeorm-and-typescript-for-data-persistence-in-node-js-module-bfce169959d9
