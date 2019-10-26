import { getConnection } from "typeorm";
import { EnumArea } from "../enum/area.enum";
import { EnumDishLabel } from "../enum/dishLabel.enu";
import { EnumWeekDay } from "../enum/weekDay.enum";
import { Area } from "../oRModels/area.mdl";
import { WeekDay } from "../oRModels/weekDay.mdl";
import { Label } from "../oRModels/label.mdl";

export default class DatabaseHelper {

    get areas(): Area[] {

        const areas = [ Object.assign( new Area(), {id: null, name: EnumArea.MALMO__VASTRA_HAMNEN}) ];

        return areas;
    }

    get dishLabels(): Label[] {

        const labels = [
            Object.assign( new Label(), {id: null, name: EnumDishLabel.ARABIC } ),
            Object.assign( new Label(), {id: null, name: EnumDishLabel.BIRD } ),
            Object.assign( new Label(), {id: null, name: EnumDishLabel.BREAD } ),
            Object.assign( new Label(), {id: null, name: EnumDishLabel.BREAKFAST } ),
            Object.assign( new Label(), {id: null, name: EnumDishLabel.CAKE } ),
            Object.assign( new Label(), {id: null, name: EnumDishLabel.COFFEE } ),
            Object.assign( new Label(), {id: null, name: EnumDishLabel.DESSERT } ),
            Object.assign( new Label(), {id: null, name: EnumDishLabel.DRINK } ),
            Object.assign( new Label(), {id: null, name: EnumDishLabel.FALAFEL } ),
            Object.assign( new Label(), {id: null, name: EnumDishLabel.FAST_FOOD } ),
            Object.assign( new Label(), {id: null, name: EnumDishLabel.FISH_AND_SEAFOOD } ),
            Object.assign( new Label(), {id: null, name: EnumDishLabel.GRATIN } ),
            Object.assign( new Label(), {id: null, name: EnumDishLabel.HOTPOT } ),
            Object.assign( new Label(), {id: null, name: EnumDishLabel.INDIAN } ),
            Object.assign( new Label(), {id: null, name: EnumDishLabel.MAIN } ),
            Object.assign( new Label(), {id: null, name: EnumDishLabel.MEAL_OF_THE_DAY } ),
            Object.assign( new Label(), {id: null, name: EnumDishLabel.MEAT } ),
            Object.assign( new Label(), {id: null, name: EnumDishLabel.PERSIAN } ),
            Object.assign( new Label(), {id: null, name: EnumDishLabel.PIE } ),
            Object.assign( new Label(), {id: null, name: EnumDishLabel.PIZZA } ),
            Object.assign( new Label(), {id: null, name: EnumDishLabel.PLAIN } ),
            Object.assign( new Label(), {id: null, name: EnumDishLabel.SALAD } ),
            Object.assign( new Label(), {id: null, name: EnumDishLabel.SANDWICH } ),
            Object.assign( new Label(), {id: null, name: EnumDishLabel.SMOOTHIE } ),
            Object.assign( new Label(), {id: null, name: EnumDishLabel.SNACK } ),
            Object.assign( new Label(), {id: null, name: EnumDishLabel.SNACKS } ),
            Object.assign( new Label(), {id: null, name: EnumDishLabel.SOUP } ),
            Object.assign( new Label(), {id: null, name: EnumDishLabel.STARTER } ),
            Object.assign( new Label(), {id: null, name: EnumDishLabel.SUPPER } ),
            Object.assign( new Label(), {id: null, name: EnumDishLabel.THAI } ),
            Object.assign( new Label(), {id: null, name: EnumDishLabel.VEGETARIAN } ),
        ];

        return labels;
    }

    get weekDays(): WeekDay[] {

        const weekDays = [
            Object.assign( new WeekDay(), { id: null, javascriptDayIndex: EnumWeekDay.MONDAY } ),
            Object.assign( new WeekDay(), { id: null, javascriptDayIndex: EnumWeekDay.TUESDAY } ),
            Object.assign( new WeekDay(), { id: null, javascriptDayIndex: EnumWeekDay.WEDNESDAY } ),
            Object.assign( new WeekDay(), { id: null, javascriptDayIndex: EnumWeekDay.THURSDAY } ),
            Object.assign( new WeekDay(), { id: null, javascriptDayIndex: EnumWeekDay.FRIDAY } ),

            Object.assign( new WeekDay(), { id: null, javascriptDayIndex: EnumWeekDay.SATURDAY } ),
            Object.assign( new WeekDay(), { id: null, javascriptDayIndex: EnumWeekDay.SUNDAY } ),
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

}
