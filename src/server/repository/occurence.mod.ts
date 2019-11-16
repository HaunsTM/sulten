import { EntityRepository, getConnection, Repository } from "typeorm";
import { EnumArea } from "../enum/AreaName";
import { EnumDishLabel } from "../enum/LabelName";
import { EnumWeekDay } from "../enum/WeekDayJavascriptDayIndex";
import { Area } from "./entities/area.mdl";
import { Label } from "./entities/label.mdl";
import { WeekDay } from "./entities/weekDay.mdl";

import { IWebMealResult } from "../interfaces/IWebMealResult";

export class OccurenceModule {

private repository: Repository<Area>;

    public async getAllAreas(): Promise<Area[]> {
        const areas: Area[] = await getConnection().getRepository(Area).find();
        return areas;
    }

    private initialize() {
        const connection = getConnection();
        this.repository = connection.getRepository(Area);
    }

}

// https://levelup.gitconnected.com/complete-guide-to-using-typeorm-and-typescript-for-data-persistence-in-node-js-module-bfce169959d9
