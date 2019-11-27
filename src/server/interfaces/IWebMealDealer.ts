import { IWebMealResult } from "./IWebMealResult";

export interface IWebMealDealer {

    restaurantMenuUrl: string;
    mealsFromWeb(): Promise<IWebMealResult[]>;

}
