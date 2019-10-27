
import { JSDOM } from "jsdom";
import { IWebMenuDealer } from "../../interfaces/webMenuDealer.itf";
import { IWebMealResult } from "../../interfaces/webMealResult.itf";
import { WebMealResult } from "./webMealResult";

export class MiaMariasNu implements IWebMenuDealer {

    public async mealsFromWeb(): Promise<IWebMealResult[]> {
        let result: WebMealResult[];
        const dom = await JSDOM.fromURL("http://www.miamarias.nu");

        const webMealResult =  new WebMealResult(null,null,null,null,null,null,null,null,)
        result.push(webMealResult);
        return result;
    }
}
