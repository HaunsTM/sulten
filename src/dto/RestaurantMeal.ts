import { AlternativeLabelDishPrice } from "./AlternativeLabelDishPrice";

export class RestaurantMeal {

    public restaurantName: string;
    public restaurantMenuUrl: string;
    public javaScriptDayIndex: number;
    public alternativeLabelDishPrices: AlternativeLabelDishPrice[];

    constructor(
        restaurantName: string,
        restaurantMenuUrl: string,
        javaScriptDayIndex: number,
        alternativeLabelDishPrices: AlternativeLabelDishPrice[]) {

            this.javaScriptDayIndex = javaScriptDayIndex;
            this.restaurantName = restaurantName;
            this.restaurantMenuUrl = restaurantMenuUrl;
            this.alternativeLabelDishPrices = alternativeLabelDishPrices;
    }
}
