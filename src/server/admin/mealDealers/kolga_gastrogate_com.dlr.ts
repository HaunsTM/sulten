import { EnumDishLabel } from "../../enum/dishLabel.enu";
import { EnumWeekDay } from "../../enum/weekday.enum";
import { IHtmlFetcherHelper } from "../../interfaces/htmlFetcherHelper.itf";
import { IRestaurant } from "../../interfaces/oRModels/restaurant.itf";
import { IWeekIndex } from "../../interfaces/oRModels/weekIndex.itf";
import { IWebMealResult } from "../../interfaces/webMealResult.itf";
import { IWebMenuDealer } from "../../interfaces/webMenuDealer.itf";
import { IXPathDishProviderResult } from "../../interfaces/xpathDishProviderResult.itf";
import { Dish } from "../../oRModels/dish.mdl";
import { Label } from "../../oRModels/label.mdl";
import { Meal } from "../../oRModels/meal.mdl";
import { Occurence } from "../../oRModels/occurence.mdl";
import { Restaurant } from "../../oRModels/restaurant.mdl";
import { WeekDay } from "../../oRModels/weekDay.mdl";
import { WebMealResult } from "./webMealResult";
import { WeekIndex } from "../../oRModels/weekIndex.mdl";

export class KolgaGastroGate implements IWebMenuDealer {

    private _htmlFetcherHelper: IHtmlFetcherHelper = null;
    private _weekIndex: WeekIndex = null;

    constructor(htmlFetcherHelper: IHtmlFetcherHelper,
                weekIndex: WeekIndex) {

        this._htmlFetcherHelper = htmlFetcherHelper;

        this._weekIndex = weekIndex;
    }

    public async mealsFromWeb(): Promise<IWebMealResult[]> {

        const mealsForAWeekPromise =  this.getWebMealResultAForAWeek();
        const mealsForAWeek = await Promise.all(mealsForAWeekPromise);
        return mealsForAWeek;
    }

    private getWebMealResultAForAWeek(): Array<Promise<IWebMealResult>> {

        const mealsForAWeek: Array<Promise<IWebMealResult>>  = [
            this.webMealResult("måndag", 1),
            this.webMealResult("måndag", 2),
            this.webMealResult("tisdag", 1),
            this.webMealResult("tisdag", 2),
            this.webMealResult("onsdag", 1),
            this.webMealResult("onsdag", 2),
            this.webMealResult("torsdag", 1),
            this.webMealResult("torsdag", 2),
            this.webMealResult("fredag", 1),
            this.webMealResult("fredag", 2),
        ];

        return mealsForAWeek;
    }

    private async webMealResult(weekDay: string, menuAlternativeIndex: number): Promise<IWebMealResult> {

        const label = new Label( null, EnumDishLabel.PLAIN );
        let dish: Dish = null;
        let fetchError: Error = null;

        try {
                dish = await this.getDish( weekDay, menuAlternativeIndex );
        } catch (e) {
                fetchError = e;
        }

        const idMeal: number = null;

        const restaurant = new Restaurant(null, null, null, "https://kolga.gastrogate.com/lunch/");
        const occurence = this.getOccurence(weekDay);
        const meal = new Meal( idMeal, dish, occurence, restaurant);

        const webMealResult =
            new WebMealResult(dish, label, meal, restaurant, occurence, fetchError);

        return webMealResult;
    }

    private getOccurence(weekDayName: string): Occurence {
        let weekDay: WeekDay = null;
        switch (weekDayName) {
            case "måndag":
                    weekDay = new WeekDay( null, EnumWeekDay.MONDAY );
                    break;
            case "tisdag":
                    weekDay = new WeekDay( null, EnumWeekDay.TUESDAY );
                    break;
            case "onsdag":
                    weekDay = new WeekDay( null, EnumWeekDay.WEDNESDAY );
                    break;
            case "torsdag":
                    weekDay = new WeekDay( null, EnumWeekDay.THURSDAY );
                    break;
            case "fredag":
                    weekDay = new WeekDay( null, EnumWeekDay.FRIDAY );
                    break;
        }

        const occurence = new Occurence( null, weekDay, this._weekIndex );

        return occurence;
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
            descriptionXPath: `(//table/thead[tr/th/h3[contains(.,'${weekday}')]]/following-sibling::tbody[1]//td[@class='td_title'])[${menuAlternativeIndex}]`,
            price_SEKXPath: `(//table/thead[tr/th/h3[contains(.,'${weekday}')]]/following-sibling::tbody[1]//td[@class='td_price'])[${menuAlternativeIndex}]`,
        };

        return result;
    }

}
