import { Area } from "../server/repository/entities/Area";
import { Restaurant } from "../server/repository/entities/Restaurant";

export class AreaRestaurants {

    public area: Area;

    public restaurants: Restaurant[];

    constructor(
        area: Area,
        restaurants: Restaurant[]) {

            this.area = area;
            this.restaurants = restaurants;
    }

}
