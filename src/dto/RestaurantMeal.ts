import { LabelDishPrice } from "./LabelDishPrice";

export class RestaurantMeal {

    public restaurantName: string;
    public restaurantMenuUrl: string;
    public javaScriptDayIndex: number;
    public labelDishPrices: LabelDishPrice[];

    constructor(
        restaurantName: string,
        restaurantMenuUrl: string,
        javaScriptDayIndex: number,
        labelDishPrices: LabelDishPrice[]) {

            this.javaScriptDayIndex = javaScriptDayIndex;
            this.restaurantName = restaurantName;
            this.restaurantMenuUrl = restaurantMenuUrl;
            this.labelDishPrices = labelDishPrices;
    }
}
