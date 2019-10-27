import { IWebMealResult } from "./webMealResult.itf";

export interface IWebMenuDealer {

  // fetchMealsFromWeb: any;
  mealsFromWeb(): Promise<IWebMealResult[]>;
  // saveWebMenuToDb: Promise<boolean>;

}
