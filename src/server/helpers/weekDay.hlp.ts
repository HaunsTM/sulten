import { EnumWeekDay } from "../enum/weekDay.enum";
import { IWeekDay } from "../interfaces/oRModels/weekDay.itf";
import { IWeekDayHelper } from "../interfaces/weekDayHelper.itf";
import { WeekDay } from "../oRModels/weekDay.mdl";

export class WeekDayHelper implements IWeekDayHelper {

 
    public getWeekDay(weekDayName: string): IWeekDay {
        let weekDay: WeekDay = null;
        switch (weekDayName) {
            case "måndag":
                    weekDay = new WeekDay( null, EnumWeekDay.MONDAY );
                    break;
            case "tisdag":
                    weekDay = new WeekDay( null, EnumWeekDay.TUESDAY );
                    break;
            case "onsdag":
                    weekDay = new WeekDay( null, EnumWeekDay.WEDNESDAY );
                    break;
            case "torsdag":
                    weekDay = new WeekDay( null, EnumWeekDay.THURSDAY );
                    break;
            case "fredag":
                    weekDay = new WeekDay( null, EnumWeekDay.FRIDAY );
                    break;
        }

        return weekDay;
    }

}
