import { LabelDishPriceDay } from "./LabelDishPriceDay";

export class RestaurantMealDay {

    public restaurantName: string;
    public restaurantMenuUrl: string;
    public labelDishPrices: LabelDishPriceDay[];

    constructor(
        restaurantName: string,
        restaurantMenuUrl: string,
        labelDishPrices: LabelDishPriceDay[]) {

            this.restaurantName = restaurantName;
            this.restaurantMenuUrl = restaurantMenuUrl;
            this.labelDishPrices = labelDishPrices;
    }
}
