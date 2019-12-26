import { WeekDayIndex } from "../../enum/WeekDayIndex";

export class WeekDay {

    public id: number;

    public dayIndex: number;

    constructor(dayIndex: WeekDayIndex) {

        this.dayIndex = dayIndex;

    }

}
