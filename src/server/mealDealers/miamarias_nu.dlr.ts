
import { JSDOM } from "jsdom";
import { IWebMealResult } from "../interfaces/webMealResult.itf";
import { IWebMenuDealer } from "../interfaces/webMenuDealer.itf";

export default class MiaMariasNu implements IWebMenuDealer {

    public async fetchMealsFromWeb(): Promise<JSDOM> {
        const dom = await JSDOM.fromURL("http://www.miamarias.nu");
        return dom;
    }
    
    mealsFromWeb(): Promise<IWebMealResult[]> {

    };
  //  saveWebMenuToDb: Promise<boolean>;
    
}
