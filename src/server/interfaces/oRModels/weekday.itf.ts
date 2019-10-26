import { IEntity } from "./entity.itf";
import { IOccurence } from "./occurence.itf";

export interface IWeekDay extends IEntity {

    id: number;

    javascriptDayIndex: number;

    // navigation properties
    occurences: IOccurence[];

}
