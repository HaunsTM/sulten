import { IWebMealResult } from "./webMealResult.itf";

export interface IWebMenuDealer {

  fetchMealsFromWeb: Promise<void>;
  mealsFromWeb: Promise<IWebMealResult[]>;
  saveWebMenuToDb: Promise<boolean>;

}
