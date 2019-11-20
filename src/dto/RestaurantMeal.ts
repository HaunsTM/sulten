import { LabelDishPrice } from "./LabelDishPrice";

export class RestaurantMeal {

    public RestaurantName: string;
    public JavaScriptDayIndex: number;
    public LabelDishPrices: LabelDishPrice[];

    constructor(
        restaurantName: string,
        javaScriptDayIndex: number,
        labelDishPrices: LabelDishPrice[]) {
            this.JavaScriptDayIndex = javaScriptDayIndex;
            this.RestaurantName = restaurantName;
            this.LabelDishPrices = labelDishPrices;
    }
}
