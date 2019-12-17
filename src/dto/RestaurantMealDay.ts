import { AlternativeLabelDishPriceDay } from "./AlternativeLabelDishPriceDay";

export class RestaurantMealDay {

    public restaurantName: string;
    public restaurantMenuUrl: string;
    public alternativeLabelDishPrices: AlternativeLabelDishPriceDay[];

    constructor(
        restaurantName: string,
        restaurantMenuUrl: string,
        alternativeLabelDishPrices: AlternativeLabelDishPriceDay[]) {

            this.restaurantName = restaurantName;
            this.restaurantMenuUrl = restaurantMenuUrl;
            this.alternativeLabelDishPrices = alternativeLabelDishPrices;
    }
}
