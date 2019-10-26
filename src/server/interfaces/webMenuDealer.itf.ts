import { JSDOM } from "jsdom";
import { IWebMealResult } from "./webMealResult.itf";

export interface IWebMenuDealer {

  fetchMealsFromWeb: Promise<JSDOM>;
  mealsFromWeb: Promise<IWebMealResult[]>;
  saveWebMenuToDb: Promise<boolean>;

}
