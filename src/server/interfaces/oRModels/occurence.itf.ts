import { IEntity } from "./entity.itf";
import { IMeal } from "./meal.itf";
import { IWeekDay } from "./weekday.itf";
import { IWeekIndex } from "./weekIndex.itf";

export interface IOccurence extends IEntity {

    id: number;

    // navigation properties
    meals: IMeal[];
    weekDay: IWeekDay;
    weekIndex: IWeekIndex;

}
