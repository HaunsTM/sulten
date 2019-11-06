import { IEntity } from "./entity.itf";
import { IOccurence } from "./occurence.itf";

export interface IWeekIndex extends IEntity {

    id: number;

    weekNumber: number;
    weekYear: number;

    // navigation properties
    occurences: IOccurence[];

}
