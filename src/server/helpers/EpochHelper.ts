import moment from "moment";
import { WeekDayIndex } from "../enum/WeekDayIndex";
import { IEpochHelper } from "../interfaces/IEpochHelper";

export class EpochHelper implements IEpochHelper {

    public getDateOfMonday(anotherDayInTheWeek: Date): Date {

        const day = anotherDayInTheWeek.getDay();
        const diff = anotherDayInTheWeek.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
        return new Date(anotherDayInTheWeek.setDate(diff));
    }

    public getMonthThatStartedTheWeek(): number;
    public getMonthThatStartedTheWeek(weekYear: number, weekNumber: number): number;

    public getMonthThatStartedTheWeek(arg1?: number, arg2?: number): number {

        const monthIndexCompensation = 1;
        let currentWeekYear = -1;
        let currentWeekNumber = -1;

        if ( arg1 !== undefined && arg1 !== undefined ) {
            currentWeekYear = arg1;
            currentWeekNumber = arg2;
        } else {
            const today = new Date();

            currentWeekYear = moment().year();
            currentWeekNumber = moment().isoWeek();
        }

        const startOfWeek = moment().year(currentWeekYear).week(currentWeekNumber).startOf("isoWeek");
        const monthThatStartedTheWeek1to12 = startOfWeek.month() + monthIndexCompensation;

        return monthThatStartedTheWeek1to12;
    }

    public getDate(javascriptDayIndex: number, weekIndex: number, weekYear: number): Date {
        const date = moment().year(weekYear).week(weekIndex).day(javascriptDayIndex).toDate();
        return date;
    }

    public getCurrentUTCTimestamp(): string {

        const utcTime = moment().utc().format("YYYY-MM-DD HH:mm:ss");

        return utcTime;
    }
    public getDayNameDateMonthName(
        javascriptDayIndex: WeekDayIndex,  weekYear: string, weekIndex: string ): string {

        const swedishWeekDayName = this.getSwedishWeekDayName( javascriptDayIndex );
        const date = this.getDate( javascriptDayIndex, parseInt( weekIndex, 10 ), parseInt( weekYear, 10 ) );
        const monthName = this.getSwedishMonthName( date.getMonth() );

        const dayNameDateMonthName = `${swedishWeekDayName} ${date.getDate().toString()} ${monthName}`;

        return dayNameDateMonthName;
    }

    private getSwedishWeekDayName( weekDayJavascriptDayIndex: WeekDayIndex ): string {
        let swedishWeekDayName = "";

        switch ( weekDayJavascriptDayIndex ) {
            case WeekDayIndex.MONDAY :
                swedishWeekDayName = "måndag";
                break;
            case WeekDayIndex.TUESDAY :
                swedishWeekDayName = "tisdag";
                break;
            case WeekDayIndex.WEDNESDAY :
                swedishWeekDayName = "onsdag";
                break;
            case WeekDayIndex.THURSDAY :
                swedishWeekDayName = "torsdag";
                break;
            case WeekDayIndex.FRIDAY :
                swedishWeekDayName = "fredag";
                break;
        }
        return swedishWeekDayName;
    }

    private getSwedishMonthName( monthIndex: number ): string {
        let month = "";

        switch ( monthIndex ) {
            case 0:
                month = "januari";
                break;
            case 1:
                month = "februari";
                break;
            case 2:
                month = "mars";
                break;
            case 3:
                month = "april";
                break;
            case 4:
                month = "maj";
                break;
            case 5:
                month = "juni";
                break;
            case 6:
                month = "juli";
                break;
            case 7:
                month = "augusti";
                break;
            case 8:
                month = "september";
                break;
            case 9:
                month = "oktober";
                break;
            case 10:
                month = "november";
                break;
            case 11:
                month = "december";
                break;
            default :
                throw new Error(`monthIndex = ${monthIndex} is not a valid index for a month!`);
                break;
        }
        return month;
    }

}
