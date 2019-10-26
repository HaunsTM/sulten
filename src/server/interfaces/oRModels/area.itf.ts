import { IEntity } from "./entity.itf";
import { IRestaurant } from "./restaurant.itf";

export interface IArea extends IEntity {

    id: number;

    name: string;

    // navigation properties
    restaurants: IRestaurant[];

}
