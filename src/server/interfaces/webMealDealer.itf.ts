import { IWebMealResult } from "./webMealResult.itf";

export interface IWebMealDealer {

  mealsFromWeb(): Promise<IWebMealResult[]>;

}
