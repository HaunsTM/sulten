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

        let currentWeekYear = -1;
        let currentWeekNumber = -1;

        if ( arg1 !== undefined && arg1 !== undefined ) {
            currentWeekYear = arg1;
            currentWeekNumber = arg2;
        } else {
            const today = new Date();

            currentWeekYear = today.getFullYear();
            currentWeekNumber = this.getISO8601WeekNumber(today);
        }

        const currentDatesAndWeeks = this.datesAndWeeksArray(currentWeekYear);

        const dateInCurrentWeek = currentDatesAndWeeks.find( (p) => p.weekNumber === currentWeekNumber ).date;
        const firstDayInCurrentWeek = this.getDateOfMonday(dateInCurrentWeek);

        const monthThatStartedTheWeek1to12 = firstDayInCurrentWeek.getMonth() + 1;
        return monthThatStartedTheWeek1to12;
    }

    private datesAndWeeksArray(weekYear: number): Array<{date: Date, weekNumber: number}> {
        const firstDateOfTheYear = new Date(weekYear, 0, 1);
        let mondayInFirstWeek = this.getDateOfMonday(firstDateOfTheYear);
        let tempDate = mondayInFirstWeek;

        let tempYear = weekYear;
        let datesAndWeeks = new Array<{date: Date, weekNumber: number}>();

        while (tempYear <= weekYear ) {
            let weekNumber = this.getISO8601WeekNumber(tempDate);

            datesAndWeeks.push( { date: tempDate, weekNumber } );

            const futureDate = this.addDays(tempDate, 1);

            tempYear = futureDate.getFullYear();
            tempDate = futureDate;
        }
        const datesAndWeeksArray = Array.from(datesAndWeeks);
        return datesAndWeeksArray;
    }

    private addDays(date: Date, days: number): Date {
        const copy = new Date(Number(date));
        copy.setDate(date.getDate() + days);
        return copy
      }

    private getISO8601WeekNumber(initialDate: Date): number {
        initialDate.setHours(0, 0, 0, 0);

        // https://weeknumber.net/how-to/javascript

        // Thursday in current week decides the year.
        initialDate.setDate(initialDate.getDate() + 3 - (initialDate.getDay() + 6) % 7);

        // January 4 is always in week 1.
        const week1 = new Date(initialDate.getFullYear(), 0, 4);

        // Adjust to Thursday in week 1 and count number of weeks from date to week1.
        return 1 +
            Math.round(((initialDate.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
    }

}
