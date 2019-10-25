import {createConnection} from "typeorm";
import {EnumArea} from "../enum/area.enum";
import {EnumWeekDay} from "../enum/weekDay.enum";
import {Area} from "../oRModels/Area";
import {WeekDay} from "../oRModels/WeekDay";

export default class DatabaseHelper {

    get initialAreas(): Area[] {

        const areas = [ Object.assign( new Area(), {id: null, name: EnumArea.MALMO__VASTRA_HAMNEN}) ];

        return areas;
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

    public async initializeAndSetupDb() {

        const connection = await createConnection();

        const areaSavePromises = this.initialAreas.map(
            (a) => connection.manager.save(a) );

        const weekDaySavePromises = this.weekDays.map(
                (a) => connection.manager.save(a) );

        try {
            await Promise.all(areaSavePromises);
            await Promise.all(weekDaySavePromises);

        } catch (e) {
            throw new Error(`Couldn't initialize database: ${e}`);
        }
    }
  }
