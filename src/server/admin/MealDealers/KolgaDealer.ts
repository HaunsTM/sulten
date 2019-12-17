import { AlternativeIndex } from "../../enum/AlternativeIndex";
import { LabelName } from "../../enum/LabelName";
import { WeekDayJavascriptDayIndex } from "../../enum/WeekDayJavascriptDayIndex";
import { IHtmlFetcherHelper } from "../../interfaces/IHtmlFetcherHelper";
import { IWebMealDealer } from "../../interfaces/IWebMealDealer";
import { IWebMealResult } from "../../interfaces/IWebMealResult";
import { IXPathDishProviderResult } from "../../interfaces/IXpathDishProviderResult";
import { DishPriceWeekNumber } from "./DishPriceWeekNumber";
import { WebMealResult } from "./WebMealResult";

export class KolgaDealer implements IWebMealDealer {

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
    }

    get initialBaseMenuUrl(): string {
        return this._htmlFetcherHelper.initialBaseMenuUrl;
    }

    get actualRestaurantMenuUrl(): string {
        return this._htmlFetcherHelper.actualRestaurantMenuUrl;
    }

    public async mealsFromWeb(): Promise<IWebMealResult[]> {

        const htmlDocumentFromWeb = await this._htmlFetcherHelper.htmlDocumentFromWeb();
        const mealsForAWeekPromise =  this.getWebMealResultAForAWeek( htmlDocumentFromWeb );
        const mealsForAWeek = await Promise.all(mealsForAWeekPromise);
        return mealsForAWeek;
    }

    private getWebMealResultAForAWeek( htmlDocumentFromWeb: Document ): Array<Promise<IWebMealResult>> {

        const mealsForAWeek: Array<Promise<IWebMealResult>>  = [
            this.webMealResult(
                htmlDocumentFromWeb, WeekDayJavascriptDayIndex.MONDAY,
                LabelName.MEAL_OF_THE_DAY, AlternativeIndex.ONE),
            this.webMealResult(
                htmlDocumentFromWeb, WeekDayJavascriptDayIndex.MONDAY,
                LabelName.MEAL_OF_THE_DAY, AlternativeIndex.TWO),

            this.webMealResult(
                htmlDocumentFromWeb, WeekDayJavascriptDayIndex.TUESDAY,
                LabelName.MEAL_OF_THE_DAY, AlternativeIndex.ONE),
            this.webMealResult(
                htmlDocumentFromWeb, WeekDayJavascriptDayIndex.TUESDAY,
                LabelName.MEAL_OF_THE_DAY, AlternativeIndex.TWO),

            this.webMealResult(
                htmlDocumentFromWeb, WeekDayJavascriptDayIndex.WEDNESDAY,
                LabelName.MEAL_OF_THE_DAY, AlternativeIndex.ONE),
            this.webMealResult(
                htmlDocumentFromWeb, WeekDayJavascriptDayIndex.WEDNESDAY,
                LabelName.MEAL_OF_THE_DAY, AlternativeIndex.TWO),

            this.webMealResult(
                htmlDocumentFromWeb, WeekDayJavascriptDayIndex.THURSDAY,
                LabelName.MEAL_OF_THE_DAY, AlternativeIndex.ONE),
            this.webMealResult(
                htmlDocumentFromWeb, WeekDayJavascriptDayIndex.THURSDAY,
                LabelName.MEAL_OF_THE_DAY, AlternativeIndex.TWO),

            this.webMealResult(
                htmlDocumentFromWeb, WeekDayJavascriptDayIndex.FRIDAY,
                LabelName.MEAL_OF_THE_DAY, AlternativeIndex.ONE),
            this.webMealResult(
                htmlDocumentFromWeb, WeekDayJavascriptDayIndex.FRIDAY,
                LabelName.MEAL_OF_THE_DAY, AlternativeIndex.TWO),
        ];

        return mealsForAWeek;
    }

    private async webMealResult(
        htmlDocumentFromWeb: Document, weekDayJavascriptDayIndex: WeekDayJavascriptDayIndex,
        label: LabelName, alternativeIndex: AlternativeIndex): Promise<IWebMealResult> {

        let dishPriceWeekNumber: DishPriceWeekNumber = null;
        let webMealResult: WebMealResult = null;

        const swedishWeekDayNameOnKolga = this.getSwedishWeekDayNameOnKolga( weekDayJavascriptDayIndex );

        try {
            dishPriceWeekNumber =
                await this.getDishPriceWeekNumber(
                    htmlDocumentFromWeb, swedishWeekDayNameOnKolga, alternativeIndex );

            if ( dishPriceWeekNumber.fetchError ) {
                throw dishPriceWeekNumber.fetchError;
            }

            if ( this._weekNumberExpected !== dishPriceWeekNumber.weekIndexWeekNumber) {
                throw new Error(`Expected to see menu for week ${this._weekNumberExpected}, but found week ${dishPriceWeekNumber.weekIndexWeekNumber}`);
            }

            webMealResult =
                new WebMealResult(
                    this.initialBaseMenuUrl, dishPriceWeekNumber.dishDescription,
                    dishPriceWeekNumber.priceSEK, alternativeIndex, label, weekDayJavascriptDayIndex,
                    dishPriceWeekNumber.weekIndexWeekNumber, this._weekYear, null);

        } catch ( e ) {
            webMealResult =
                new WebMealResult( this.initialBaseMenuUrl, "", "", alternativeIndex, label,
                    weekDayJavascriptDayIndex, this._weekNumberExpected, this._weekYear, e);
        }

        return webMealResult;
    }

    private getSwedishWeekDayNameOnKolga( weekDayJavascriptDayIndex: WeekDayJavascriptDayIndex ): string {
        let swedishWeekDayName = "";

        switch ( weekDayJavascriptDayIndex ) {
            case WeekDayJavascriptDayIndex.MONDAY :
                swedishWeekDayName = "måndag";
                break;
            case WeekDayJavascriptDayIndex.TUESDAY :
                swedishWeekDayName = "tisdag";
                break;
            case WeekDayJavascriptDayIndex.WEDNESDAY :
                swedishWeekDayName = "onsdag";
                break;
            case WeekDayJavascriptDayIndex.THURSDAY :
                swedishWeekDayName = "torsdag";
                break;
            case WeekDayJavascriptDayIndex.FRIDAY :
                swedishWeekDayName = "fredag";
                break;
        }
        return swedishWeekDayName;
    }

    private async getDishPriceWeekNumber(
        htmlDocumentFromWeb: Document, weekDayName: string,
        menuAlternativeIndex: number): Promise<DishPriceWeekNumber> {

        let dishDescription: string;
        let priceSEK: string;
        let weekIndexWeekNumber: string;
        let fetchError: Error;

        let dishPriceWeekNumber: DishPriceWeekNumber = null;

        const xpath = this.xpathProvider(weekDayName, menuAlternativeIndex);

        try {
            dishDescription =
                this._htmlFetcherHelper.textContentFromHtmlDocument( htmlDocumentFromWeb, xpath.descriptionXPath);

            priceSEK =
                ( this._htmlFetcherHelper.textContentFromHtmlDocument( htmlDocumentFromWeb, xpath.price_SEKXPath ))
                .match(/\d+(?=\s?kr)/)[0];

            weekIndexWeekNumber =
                (this._htmlFetcherHelper.textContentFromHtmlDocument( htmlDocumentFromWeb, xpath.weekNumberXPath))
                .match(/(?<=\s*Vecka\s*)\d+/)[0];

        } catch ( error ) {
            fetchError = error;
        }

        dishPriceWeekNumber = new DishPriceWeekNumber(dishDescription, priceSEK, weekIndexWeekNumber, fetchError );

        return dishPriceWeekNumber;
    }

    private xpathProvider(weekDayName: string, alternativeIndex: AlternativeIndex): IXPathDishProviderResult {

        const result: IXPathDishProviderResult = {
            descriptionXPath: `(//table/thead[tr/th/h3[contains(.,'${weekDayName}')]]/following-sibling::tbody[1]//td[@class='td_title'])[${alternativeIndex}]`,
            price_SEKXPath: `(//table/thead[tr/th/h3[contains(.,'${weekDayName}')]]/following-sibling::tbody[1]//td[@class='td_price'])[${alternativeIndex}]`,
            weekNumberXPath: `//a[contains(@class,'btn btn-info dropdown-toggle')]/text()[contains(.,'Vecka ')]`,
        };

        return result;
    }

}
