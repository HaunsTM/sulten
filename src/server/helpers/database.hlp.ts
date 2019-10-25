import {createConnection} from "typeorm";
import {EnumArea} from "../enum/area.enum";
import {EnumWeekday} from "../enum/weekday.enum";
import {Area} from "../oRModels/Area";
import {WeekDay} from "../oRModels/WeekDay";

export default class DatabaseHelper {

    get initialAreas(): Area[] {

        const areas = [ Object.assign( new Area(), {name: EnumArea.MALMO__VASTRA_HAMNEN}) ];

        return areas;
    }

    get weekDays(): WeekDay[] {

        const weekDays = [
            Object.assign( new WeekDay(), {Name_ENG: EnumWeekday.ENG_MONDAY, Name_SE: EnumWeekday.SE_MANDAG} ),
            Object.assign( new WeekDay(), {Name_ENG: EnumWeekday.ENG_TUESDAY, Name_SE: EnumWeekday.SE_TISDAG} ),
            Object.assign( new WeekDay(), {Name_ENG: EnumWeekday.ENG_WEDNESDAY, Name_SE: EnumWeekday.SE_ONSDAG} ),
            Object.assign( new WeekDay(), {Name_ENG: EnumWeekday.ENG_THURSDAY, Name_SE: EnumWeekday.SE_TORSDAG} ),
            Object.assign( new WeekDay(), {Name_ENG: EnumWeekday.ENG_FRIDAY, Name_SE: EnumWeekday.SE_FREDAG} ),

            Object.assign( new WeekDay(), {Name_ENG: EnumWeekday.ENG_SATURDAY, Name_SE: EnumWeekday.SE_LORDAG} ),
            Object.assign( new WeekDay(), {Name_ENG: EnumWeekday.ENG_SUNDAY, Name_SE: EnumWeekday.SE_SONDAG} ),
         ];

        return weekDays;
    }

    public async initializeAndSetupDb() {

        const connection = await createConnection();


        this.initialAreas.forEach(
            async (a) => await connection.manager.save(a) );
return;
        this.weekDays.forEach(
            async (a) => await connection.manager.save(a) );


return;
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
