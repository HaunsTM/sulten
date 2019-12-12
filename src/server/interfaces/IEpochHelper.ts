
export interface IEpochHelper {

    getDateOfMonday(anotherDayInTheWeek: Date): Date;

    getMonthThatStartedTheWeek(): number;
    getMonthThatStartedTheWeek(weekYear: number, weekNumber: number): number;
}
