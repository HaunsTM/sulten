import { IWebMealResult } from "./webMealResult.itf";

export interface IWebMenuDealer {

  mealsFromWeb(): Promise<IWebMealResult[]>;

}
