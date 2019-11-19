import { LabelDishPrice } from "./LabelDishPrice";

export class RestaurantMeal {

    public RestaurantName: string;
    public LabelDishPrices: LabelDishPrice[];

    constructor(
        restaurantName: string,
        labelDishPrices: LabelDishPrice[]) {

            this.RestaurantName = restaurantName;
            this.LabelDishPrices = labelDishPrices;
    }
}
