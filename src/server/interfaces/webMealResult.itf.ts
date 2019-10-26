import { IMeal } from "./oRModels/meal.itf";

export interface IWebMealResult {

  meal: IMeal;
  fetchError: Error;

}
