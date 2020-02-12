import moment from "moment";
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

}
