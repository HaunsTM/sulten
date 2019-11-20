import { EnumWeekDay } from "../enum/WeekDayJavascriptDayIndex";
import { IWeekDayHelper } from "../interfaces/IWeekDayHelper";
import { WeekDay } from "../repository/entities/weekDay.mdl";
import { IWeekDay } from "../repository/interfaces/weekDay.itf";

export class WeekDayHelper implements IWeekDayHelper {

    public getWeekDay(swedishWeekDayName: string ): IWeekDay {
        let weekDay: WeekDay = null;

        switch ( swedishWeekDayName.toLowerCase() ) {
                case "mån" || "måndag":
                        weekDay = new WeekDay( null, EnumWeekDay.MONDAY );
                        break;
                case "tis" || "tisdag":
                        weekDay = new WeekDay( null, EnumWeekDay.TUESDAY );
                        break;
                case "ons" || "onsdag":
                        weekDay = new WeekDay( null, EnumWeekDay.WEDNESDAY );
                        break;
                case "tor" || "torsdag":
                        weekDay = new WeekDay( null, EnumWeekDay.THURSDAY );
                        break;
                case "fre" || "fredag":
                        weekDay = new WeekDay( null, EnumWeekDay.FRIDAY );
                        break;
                case "lör" || "lördag":
                        weekDay = new WeekDay( null, EnumWeekDay.SATURDAY );
                        break;
                case "sön" || "söndag":
                        weekDay = new WeekDay( null, EnumWeekDay.SUNDAY );
                        break;
        }

        return weekDay;
    }

}
