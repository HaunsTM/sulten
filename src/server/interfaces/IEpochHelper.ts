
export interface IEpochHelper {

    getDateOfMonday(anotherDayInTheWeek: Date): Date;

    getMonthThatStartedTheWeek(): number;
    getMonthThatStartedTheWeek(weekYear: number, weekNumber: number): number;
    getDate(javascriptDayIndex: number, weekIndex: number, weekYear: number): Date;
}
