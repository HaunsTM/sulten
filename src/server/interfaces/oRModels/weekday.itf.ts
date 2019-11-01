import { EnumWeekDay } from "../../enum/weekday.enum";
import { IEntity } from "./entity.itf";
import { IOccurence } from "./occurence.itf";

export interface IWeekDay extends IEntity {

    id: number;

    javascriptDayIndex: EnumWeekDay;

    // navigation properties
    occurences: IOccurence[];

}
