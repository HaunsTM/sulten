import { IArea } from "./area.itf";
import { IEntity } from "./entity.itf";
import { IMeal } from "./meal.itf";

export interface IRestaurant extends IEntity {

    id: number;

    active: number;
    name: string;
    menuUrl: string;

    // navigation properties
    area: IArea;
    meals: IMeal[];

}
