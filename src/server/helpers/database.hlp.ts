import { getConnection } from "typeorm";
import { EnumArea } from "../enum/area.enum";
import { EnumDishLabel } from "../enum/dishLabel.enu";
import { EnumWeekDay } from "../enum/weekDay.enu";
import { Area } from "../oRModels/area.mdl";
import { Label } from "../oRModels/label.mdl";
import { WeekDay } from "../oRModels/weekDay.mdl";

import { IWebMealResult } from "../interfaces/webMealResult.itf";

export default class DatabaseHelper {

    get areas(): Area[] {

        const areas = [ new Area( null, EnumArea.MALMO__VASTRA_HAMNEN ) ];

        return areas;
    }

    get dishLabels(): Label[] {

        const labels = [
            new Label(null, EnumDishLabel.ARABIC ),
            new Label(null, EnumDishLabel.BREAD ),
            new Label(null, EnumDishLabel.BREAKFAST ),
            new Label(null, EnumDishLabel.CAKE ),
            new Label(null, EnumDishLabel.COFFEE ),
            new Label(null, EnumDishLabel.DESSERT ),
            new Label(null, EnumDishLabel.DRINK ),
            new Label(null, EnumDishLabel.FALAFEL ),
            new Label(null, EnumDishLabel.FAST_FOOD ),
            new Label(null, EnumDishLabel.FISH_AND_SEAFOOD ),
            new Label(null, EnumDishLabel.GRATIN ),
            new Label(null, EnumDishLabel.HOTPOT ),
            new Label(null, EnumDishLabel.INDIAN ),
            new Label(null, EnumDishLabel.MAIN ),
            new Label(null, EnumDishLabel.MEAL_OF_THE_DAY ),
            new Label(null, EnumDishLabel.MEAT ),
            new Label(null, EnumDishLabel.PERSIAN ),
            new Label(null, EnumDishLabel.PIE ),
            new Label(null, EnumDishLabel.PIZZA ),
            new Label(null, EnumDishLabel.PLAIN ),
            new Label(null, EnumDishLabel.PORK ),
            new Label(null, EnumDishLabel.POULTRY ),
            new Label(null, EnumDishLabel.SALAD ),
            new Label(null, EnumDishLabel.SANDWICH ),
            new Label(null, EnumDishLabel.SMOOTHIE ),
            new Label(null, EnumDishLabel.SNACK ),
            new Label(null, EnumDishLabel.SNACKS ),
            new Label(null, EnumDishLabel.SOUP ),
            new Label(null, EnumDishLabel.STARTER ),
            new Label(null, EnumDishLabel.SUPPER ),
            new Label(null, EnumDishLabel.THAI ),
            new Label(null, EnumDishLabel.VEGETARIAN ),
        ];

        return labels;
    }

    get weekDays(): WeekDay[] {

        const weekDays = [
            new WeekDay(null, EnumWeekDay.MONDAY ),
            new WeekDay(null, EnumWeekDay.TUESDAY ),
            new WeekDay(null, EnumWeekDay.WEDNESDAY ),
            new WeekDay(null, EnumWeekDay.THURSDAY ),
            new WeekDay(null, EnumWeekDay.FRIDAY ),

            new WeekDay(null, EnumWeekDay.SATURDAY ),
            new WeekDay(null, EnumWeekDay.SUNDAY ),
         ];

        return weekDays;
    }

    public async initializeAndSetupDb(): Promise<void> {

        const dbManager = getConnection().manager;

        const areaSaves = this.areas.map(
            (a) => dbManager.save(a) );

        const dishLabelSaves = this.dishLabels.map(
            (dLS) => dbManager.save(dLS) );

        const weekDaySaves = this.weekDays.map(
                (wD) => dbManager.save(wD) );

        try {
            await Promise.all(areaSaves);
            await Promise.all(dishLabelSaves);
            await Promise.all(weekDaySaves);

        } catch (e) {
            throw new Error(`Couldn't initialize database: ${e}`);
        }
    }

    public async getAllAreas(): Promise<Area[]> {

        const dbManager = getConnection().manager;

        try {
            const areas: Area[] = await dbManager.find(Area);
            return areas;
        } catch (e) {
            throw new Error(`Couldn't initialize database: ${e}`);
        }
    }

    public async saveToDb(webMeals: IWebMealResult[]): Promise<void> {

        const dbManager = getConnection().manager;
        const rawData = await dbManager.query(`SELECT * FROM USERS`);
    }

}
