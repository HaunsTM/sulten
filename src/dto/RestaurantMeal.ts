import { AlternativeLabelDishPrice } from "./AlternativeLabelDishPrice";

export class RestaurantMeal {

    public restaurantName: string;
    public restaurantMenuUrl: string;
    public dayIndex: number;
    public alternativeLabelDishPrices: AlternativeLabelDishPrice[];

    constructor(
        restaurantName: string,
        restaurantMenuUrl: string,
        dayIndex: number,
        alternativeLabelDishPrices: AlternativeLabelDishPrice[]) {

            this.dayIndex = dayIndex;
            this.restaurantName = restaurantName;
            this.restaurantMenuUrl = restaurantMenuUrl;
            this.alternativeLabelDishPrices = alternativeLabelDishPrices;
    }
}
