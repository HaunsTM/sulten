
import { IHtmlFetcherHelper } from "../../interfaces/htmlFetcherHelper.itf";
import { IWebMealResult } from "../../interfaces/webMealResult.itf";
import { IWebMenuDealer } from "../../interfaces/webMenuDealer.itf";
import { IXPathDishProviderResult } from "../../interfaces/xpathDishProviderResult.itf";
import { Dish } from "../../oRModels/dish.mdl";
import { WebMealResult } from "./webMealResult";

import { Label } from "../../oRModels/label.mdl";

import { EnumDishLabel } from "../../enum/dishLabel.enu";
import { IOccurence } from "../../interfaces/oRModels/occurence.itf";
import { IRestaurant } from "../../interfaces/oRModels/restaurant.itf";
import { Meal } from "../../oRModels/meal.mdl";
import { Restaurant } from "src/server/oRModels/restaurant.mdl";

export class KolgaGastroGate implements IWebMenuDealer {

    private _htmlFetcherHelper: IHtmlFetcherHelper = null;
    private _occurence: IOccurence = null;
    private _restaurant: IRestaurant = null;
    private _fetchError: Error = null;

    constructor(htmlFetcherHelper: IHtmlFetcherHelper,
                occurence: IOccurence, restaurant: IRestaurant) {

        this._htmlFetcherHelper = htmlFetcherHelper;

        this._occurence = occurence;
        this._restaurant = restaurant;
    }

    public async mealsFromWeb(): Promise<IWebMealResult[]> {

        const webMealResult =  new WebMealResult(null, null, null, null, null, null, null, null);
        result.push(webMealResult);
        return result;
    }

    private async webMealResult(weekday: string, menuAlternativeIndex: number): Promise<IWebMealResult> {

        const label = new Label( null, EnumDishLabel.PLAIN );
        let dish: Dish = null;

        try {
                dish = await this.getDish( weekday, menuAlternativeIndex );
        } catch (e) {
                this._fetchError = e;
        }

        const idMeal: number = null;
        const meal = new Meal( idMeal, dish, this._occurence, this._restaurant);

        const webMealResult =  new WebMealResult(dish, label, meal, this._restaurant, this._occurence, this._fetchError);
    }

    private async getDish(weekday: string, menuAlternativeIndex: number): Promise<Dish> {
        const xpath = this.xpathProvider(weekday, menuAlternativeIndex);

        const idDish: number = null;
        const descriptionDish = await this._htmlFetcherHelper.textContentFromHtmlDocument(xpath.descriptionXPath);
        const price_SEKDish = await this._htmlFetcherHelper.textContentFromHtmlDocument(xpath.price_SEKXPath);

        return new Dish( idDish, descriptionDish, price_SEKDish);
    }

    private xpathProvider(weekday: string, menuAlternativeIndex: number): IXPathDishProviderResult {

        const result: IXPathDishProviderResult = {
            descriptionXPath: `(//table/thead[tr/th/h3[contains(.,'${weekday}')]]/following-sibling::tbody[1]//td[@class='td_title'])[${menuAlternativeIndex}']`,
            price_SEKXPath: `(//table/thead[tr/th/h3[contains(.,'${weekday}')]]/following-sibling::tbody[1]//td[@class='td_price'])[${menuAlternativeIndex}']`,
        };

        return result;
    }

}
