import { IDish } from "./dish.itf";
import { IEntity } from "./entity.itf";
import { IOccurence } from "./occurence.itf";
import { IRestaurant } from "./restaurant.itf";

export interface IMeal extends IEntity {

    id: number;

    // navigation properties
    dish: IDish;
    occurence: IOccurence;
    restaurant: IRestaurant;

}
