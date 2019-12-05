import { LabelName } from "../../enum/LabelName";
import { WeekDayJavascriptDayIndex } from "../../enum/WeekDayJavascriptDayIndex";
import { IHtmlFetcherHelper } from "../../interfaces/IHtmlFetcherHelper";
import { IWebMealDealer } from "../../interfaces/IWebMealDealer";
import { IWebMealResult } from "../../interfaces/IWebMealResult";
import { IXPathDishProviderResult } from "../../interfaces/IXpathDishProviderResult";
import { DishPriceWeekNumber } from "./DishPriceWeekNumber";
import { WebMealResult } from "./WebMealResult";

export class RestaurangVariationDealer implements IWebMealDealer {


    private _htmlFetcherHelper: IHtmlFetcherHelper = null;
    private _weekYear: string = "";
    private _weekNumberExpected: string = "";

    constructor(
        htmlFetcherHelper: IHtmlFetcherHelper,
        weekYear: string,
        weekNumberExpected: string) {

        this._htmlFetcherHelper = htmlFetcherHelper;
        this._weekYear = weekYear;
        this._weekNumberExpected = weekNumberExpected;

        this.initialize();
    }

    get initialBaseMenuUrl(): string {
        return this._htmlFetcherHelper.initialBaseMenuUrl;
    }

    get actualRestaurantMenuUrl(): string {
        return this._htmlFetcherHelper.actualRestaurantMenuUrl;
    }

    private updateCurrentHtmlFetcherHelperUrl() {

        const updatedHtmlFetcherHelperUrl =
            this._htmlFetcherHelper.initialBaseMenuUrl + `${this._weekYear}/v-${this._weekNumberExpected}-rest.pdf`;

        this._htmlFetcherHelper.actualRestaurantMenuUrl = updatedHtmlFetcherHelperUrl;
    }

    private initialize(): void {
        this.updateCurrentHtmlFetcherHelperUrl();
    }

    mealsFromWeb(): Promise<IWebMealResult[]> {
        throw new Error("Method not implemented.");
    }

}
