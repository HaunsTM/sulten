import { LabelName } from "../../enum/LabelName";
import { WeekDayJavascriptDayIndex } from "../../enum/WeekDayJavascriptDayIndex";
import { IHtmlFetcherHelper } from "../../interfaces/IHtmlFetcherHelper";
import { IWebMealDealer } from "../../interfaces/IWebMealDealer";
import { IWebMealResult } from "../../interfaces/IWebMealResult";
import { IXPathDishProviderResult } from "../../interfaces/IXpathDishProviderResult";
import { DishPriceWeekNumber } from "./DishPriceWeekNumber";
import { WebMealResult } from "./WebMealResult";

export class GlasklartDealer implements IWebMealDealer {

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

    get restaurantMenuUrl(): string {
        return this._htmlFetcherHelper.url;
    }

    public async mealsFromWeb(): Promise<IWebMealResult[]> {

        const htmlDocumentFromWeb = await this._htmlFetcherHelper.htmlDocumentFromWeb();
        const mealsForAWeekPromise =  this.getWebMealResultAForAWeek( htmlDocumentFromWeb );
        const mealsForAWeek = await Promise.all(mealsForAWeekPromise);
        return mealsForAWeek;
    }

    private getWebMealResultAForAWeek( htmlDocumentFromWeb: Document ): Array<Promise<IWebMealResult>> {

        const mealsForAWeek: Array<Promise<IWebMealResult>>  = [
            this.webMealResult( htmlDocumentFromWeb, WeekDayJavascriptDayIndex.MONDAY, LabelName.MEAL_OF_THE_DAY),
            this.webMealResult( htmlDocumentFromWeb, WeekDayJavascriptDayIndex.MONDAY, LabelName.VEGETARIAN),

            this.webMealResult( htmlDocumentFromWeb, WeekDayJavascriptDayIndex.TUESDAY, LabelName.MEAL_OF_THE_DAY),
            this.webMealResult( htmlDocumentFromWeb, WeekDayJavascriptDayIndex.TUESDAY, LabelName.VEGETARIAN),

            this.webMealResult( htmlDocumentFromWeb, WeekDayJavascriptDayIndex.WEDNESDAY, LabelName.MEAL_OF_THE_DAY),
            this.webMealResult( htmlDocumentFromWeb, WeekDayJavascriptDayIndex.WEDNESDAY, LabelName.VEGETARIAN),

            this.webMealResult( htmlDocumentFromWeb, WeekDayJavascriptDayIndex.THURSDAY, LabelName.MEAL_OF_THE_DAY),
            this.webMealResult( htmlDocumentFromWeb, WeekDayJavascriptDayIndex.THURSDAY, LabelName.VEGETARIAN),

            this.webMealResult( htmlDocumentFromWeb, WeekDayJavascriptDayIndex.FRIDAY, LabelName.MEAL_OF_THE_DAY),
            this.webMealResult( htmlDocumentFromWeb, WeekDayJavascriptDayIndex.FRIDAY, LabelName.VEGETARIAN),
        ];

        return mealsForAWeek;
    }

    private async webMealResult(
        htmlDocumentFromWeb: Document, weekDayJavascriptDayIndex: WeekDayJavascriptDayIndex,
        label: LabelName ): Promise<IWebMealResult> {

        let dishPriceWeekNumber: DishPriceWeekNumber = null;
        let webMealResult: WebMealResult = null;

        const swedishWeekDayName = this.getSwedishWeekDayNameOnGlasklart( weekDayJavascriptDayIndex );
        const xPath = this.xpathProvider(swedishWeekDayName, label);

        try {
            dishPriceWeekNumber =
                await this.getDishPriceWeekNumber(
                    htmlDocumentFromWeb, xPath);

            if ( dishPriceWeekNumber.FetchError ) {
                throw dishPriceWeekNumber.FetchError;
            }

            if ( this._weekNumberExpected !== dishPriceWeekNumber.WeekIndexWeekNumber) {
                throw new Error(`Expected to see menu for week ${this._weekNumberExpected}, but found week ${ dishPriceWeekNumber.WeekIndexWeekNumber}`);
            }

            webMealResult =
                new WebMealResult(
                    this._htmlFetcherHelper.url, dishPriceWeekNumber.DishDescription,
                    dishPriceWeekNumber.PriceSEK, label, weekDayJavascriptDayIndex,
                    dishPriceWeekNumber.WeekIndexWeekNumber, this._weekYear, null);

        } catch ( e ) {
            webMealResult =
                new WebMealResult( this._htmlFetcherHelper.url, "", "", label,
                    weekDayJavascriptDayIndex, this._weekNumberExpected, this._weekYear, e);
        }

        return webMealResult;

    }

    private getSwedishWeekDayNameOnGlasklart( weekDay: WeekDayJavascriptDayIndex ): string {
        let swedishWeekDayName = "";

        switch ( weekDay ) {
            case WeekDayJavascriptDayIndex.MONDAY :
                swedishWeekDayName = "Måndag";
                break;
            case WeekDayJavascriptDayIndex.TUESDAY :
                swedishWeekDayName = "Tisdag";
                break;
            case WeekDayJavascriptDayIndex.WEDNESDAY :
                swedishWeekDayName = "Onsdag";
                break;
            case WeekDayJavascriptDayIndex.THURSDAY :
                swedishWeekDayName = "Torsdag";
                break;
            case WeekDayJavascriptDayIndex.FRIDAY :
                swedishWeekDayName = "Fredag";
                break;
        }
        return swedishWeekDayName;
    }

    private async getDishPriceWeekNumber(
        htmlDocumentFromWeb: Document, xPath: IXPathDishProviderResult ): Promise<DishPriceWeekNumber> {

        let dishDescription: string;
        let priceSEK: string;
        let weekIndexWeekNumber: string;
        let fetchError: Error;

        let dishPriceWeekNumber: DishPriceWeekNumber = null;

        try {
            dishDescription =
                this._htmlFetcherHelper.textContentFromHtmlDocument( htmlDocumentFromWeb, xPath.descriptionXPath);

            priceSEK =
                ( this._htmlFetcherHelper.textContentFromHtmlDocument( htmlDocumentFromWeb, xPath.price_SEKXPath ))
                .match(/\d+(?=\s?kr)/)[0];

            weekIndexWeekNumber =
                (this._htmlFetcherHelper.textContentFromHtmlDocument( htmlDocumentFromWeb, xPath.weekNumberXPath ))
                .match(/(?<=[Vv.]+\s?)\d+/)[0];
        } catch ( error ) {
            fetchError = error;
        }

        dishPriceWeekNumber = new DishPriceWeekNumber(dishDescription, priceSEK, weekIndexWeekNumber, fetchError );

        return dishPriceWeekNumber;
    }

    private xpathProvider(weekDay: string, label: LabelName): IXPathDishProviderResult {

        let result: IXPathDishProviderResult;

        switch (label) {
            case LabelName.MEAL_OF_THE_DAY:
                result = {
                    price_SEKXPath: `//p/span[contains(.,'11.45 - 12.45')]/following-sibling::text()[1]`,
                    descriptionXPath: `//li[@id='glasklartlunchwidget-2']/h4[contains(.,'${weekDay}')]/following-sibling::p[1]`,
                    weekNumberXPath: `//h2/text()[contains(.,'Lunch v.')]`,
                };
                break;
            case LabelName.VEGETARIAN:
                result = {
                    price_SEKXPath: `//p/span[contains(.,'11.45 - 12.45')]/following-sibling::text()[1]`,
                    descriptionXPath: `//li[@id='glasklartlunchwidget-2']/h4[contains(.,'Veckans vegetariska')]/following-sibling::p[1]`,
                    weekNumberXPath: `//h2/text()[contains(.,'Lunch v.')]`,
                };
                break;
            default:
                throw new Error(`No xpath-implementation for label: ${label}`);
        }

        return result;
    }
}
