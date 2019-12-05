import { IWebMealResult } from "./IWebMealResult";
import { IWebMenuUrl } from "./IWebMenuUrl";

export interface IWebMealDealer extends IWebMenuUrl {

    mealsFromWeb(): Promise<IWebMealResult[]>;

}
