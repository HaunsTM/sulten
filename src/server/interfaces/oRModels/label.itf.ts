import { EnumDishLabel } from "../../enum/dishLabel.enu";
import { IDish } from "./dish.itf";
import { IEntity } from "./entity.itf";

export interface ILabel extends IEntity {

    id: number;
    name: EnumDishLabel;

    // navigation properties
    dishes: IDish[];

}
