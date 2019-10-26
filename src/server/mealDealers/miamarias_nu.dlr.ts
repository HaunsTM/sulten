
import { IWebMealResult } from "../interfaces/webMealResult.itf";
import { IWebMenuDealer } from "../interfaces/webMenuDealer.itf";

export default class MiaMariasNu implements IWebMenuDealer {

    fetchMealsFromWeb: Promise<void>;
    mealsFromWeb: Promise<IWebMealResult[]>;
    saveWebMenuToDb: Promise<boolean>;
    
}
