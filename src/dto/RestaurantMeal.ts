import { LabelDishPrice } from "./LabelDishPrice";

export class RestaurantMeal {

    public RestaurantName: string;
    public RestaurantMenuUrl: string;
    public JavaScriptDayIndex: number;
    public LabelDishPrices: LabelDishPrice[];

    constructor(
        restaurantName: string,
        restaurantMenuUrl: string,
        javaScriptDayIndex: number,
        labelDishPrices: LabelDishPrice[]) {

            this.JavaScriptDayIndex = javaScriptDayIndex;
            this.RestaurantName = restaurantName;
            this.RestaurantMenuUrl = restaurantMenuUrl;
            this.LabelDishPrices = labelDishPrices;
    }
}
