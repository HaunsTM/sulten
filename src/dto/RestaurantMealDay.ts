import { LabelDishPriceDay } from "./LabelDishPriceDay";

export class RestaurantMealDay {

    public RestaurantName: string;
    public RestaurantMenuUrl: string;
    public LabelDishPrices: LabelDishPriceDay[];

    constructor(
        restaurantName: string,
        restaurantMenuUrl: string,
        labelDishPrices: LabelDishPriceDay[]) {

            this.RestaurantName = restaurantName;
            this.RestaurantMenuUrl = restaurantMenuUrl;
            this.LabelDishPrices = labelDishPrices;
    }
}
