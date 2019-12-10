

export class EpochHelper {


    public getDateOfMonday(anotherDayInTheWeek: Date): Date {

        const day = anotherDayInTheWeek.getDay();
        const diff = anotherDayInTheWeek.getDate() - day + (day == 0 ? -6:1); // adjust when day is sunday
        return new Date(anotherDayInTheWeek.setDate(diff));
      }

}
