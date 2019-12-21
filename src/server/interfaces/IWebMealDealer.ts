import { IWebMealResult } from "./IWebMealResult";

export interface IWebMealDealer {

    mealsFromWeb(): Promise<IWebMealResult[]>;

}
