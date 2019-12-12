import { IEpochHelper } from "../interfaces/IEpochHelper";

export class EpochHelper implements IEpochHelper {

  public getDateOfMonday(anotherDayInTheWeek: Date): Date {

    const day = anotherDayInTheWeek.getDay();
    const diff = anotherDayInTheWeek.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
    return new Date(anotherDayInTheWeek.setDate(diff));
  }

  private getMonth1_12(date: Date): number {
    const month1_12 = date.getMonth() + 1;
    return month1_12;
  }
  private getCurrentWeekNumber(): number {
    return -1;
  }

}
