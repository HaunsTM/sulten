import { LabelDishPriceDay } from "./LabelDishPriceDay";

export class RestaurantMealDay {

    public RestaurantName: string;
    public LabelDishPrices: LabelDishPriceDay[];

    constructor(
        restaurantName: string,
        labelDishPrices: LabelDishPriceDay[]) {

            this.RestaurantName = restaurantName;
            this.LabelDishPrices = labelDishPrices;
    }
}
