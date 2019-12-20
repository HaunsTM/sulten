import { AlternativeIndex } from "../../enum/AlternativeIndex";
import { LabelName } from "../../enum/LabelName";
import { WeekDayJavascriptDayIndex } from "../../enum/WeekDayJavascriptDayIndex";
import { IHtmlFetcherHelper } from "../../interfaces/IHtmlFetcherHelper";
import { IWebMealDealer } from "../../interfaces/IWebMealDealer";
import { IWebMealResult } from "../../interfaces/IWebMealResult";
import { IXPathDishProviderResult } from "../../interfaces/IXpathDishProviderResult";
import { DishPriceWeekNumber } from "./DishPriceWeekNumber";
import { WebMealResult } from "./WebMealResult";

export class GlasklartDealer implements IWebMealDealer {

    private textContentFromHtmlDocument: string = "";

    constructor(
        textContentFromHtmlDocument: string) {
        this.textContentFromHtmlDocument = textContentFromHtmlDocument;
    }

    get initialBaseMenuUrl(): string {
        return this._htmlFetcherHelper.initialBaseMenuUrl;
    }

    get actualRestaurantMenuUrl(): string {
        return this._htmlFetcherHelper.actualRestaurantMenuUrl;
    }

    public async mealsFromWeb(): Promise<IWebMealResult[]> {

        const mealsForAWeekPromise =  this.getWebMealResultAForAWeek();
        const mealsForAWeek = await Promise.all(mealsForAWeekPromise);

        return mealsForAWeek;
    }

    private getWebMealResultAForAWeek( ): Array<Promise<IWebMealResult>> {

        const mealsForAWeek: Array<Promise<IWebMealResult>>  = [
            this.webMealResult( WeekDayJavascriptDayIndex.MONDAY,
                LabelName.MEAL_OF_THE_DAY, AlternativeIndex.ONE),
            this.webMealResult( WeekDayJavascriptDayIndex.MONDAY,
                LabelName.VEGETARIAN, AlternativeIndex.ONE),

            this.webMealResult( WeekDayJavascriptDayIndex.TUESDAY,
                LabelName.MEAL_OF_THE_DAY, AlternativeIndex.ONE),
            this.webMealResult( WeekDayJavascriptDayIndex.TUESDAY,
                LabelName.VEGETARIAN, AlternativeIndex.ONE),

            this.webMealResult( WeekDayJavascriptDayIndex.WEDNESDAY,
                LabelName.MEAL_OF_THE_DAY, AlternativeIndex.ONE),
            this.webMealResult( WeekDayJavascriptDayIndex.WEDNESDAY,
                LabelName.VEGETARIAN, AlternativeIndex.ONE),

            this.webMealResult( WeekDayJavascriptDayIndex.THURSDAY,
                LabelName.MEAL_OF_THE_DAY, AlternativeIndex.ONE),
            this.webMealResult( WeekDayJavascriptDayIndex.THURSDAY,
                LabelName.VEGETARIAN, AlternativeIndex.ONE),

            this.webMealResult( WeekDayJavascriptDayIndex.FRIDAY,
                LabelName.MEAL_OF_THE_DAY, AlternativeIndex.ONE),
            this.webMealResult( WeekDayJavascriptDayIndex.FRIDAY,
                LabelName.VEGETARIAN, AlternativeIndex.ONE),
        ];

        return mealsForAWeek;
    }

    private async webMealResult(
        weekDayJavascriptDayIndex: WeekDayJavascriptDayIndex,
        label: LabelName, alternativeIndex: AlternativeIndex ): Promise<IWebMealResult> {

        let dishPriceWeekNumber: DishPriceWeekNumber = null;
        let webMealResult: WebMealResult = null;

        const swedishWeekDayName = this.getSwedishWeekDayNameOnGlasklart( weekDayJavascriptDayIndex );
        const xPath = this.xpathProvider(swedishWeekDayName, label);

        try {
            dishPriceWeekNumber =
                await this.getDishPriceWeekNumber( xPath );

            if ( dishPriceWeekNumber.fetchError ) {
                throw dishPriceWeekNumber.fetchError;
            }

            if ( this._weekNumberExpected !== dishPriceWeekNumber.weekIndexWeekNumber) {
                throw new Error(`Expected to see menu for week ${this._weekNumberExpected}, but found week ${ dishPriceWeekNumber.weekIndexWeekNumber}`);
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

    private async getDishPriceWeekNumber( xPath: IXPathDishProviderResult ): Promise<DishPriceWeekNumber> {

        let dishDescription: string;
        let priceSEK: string;
        let weekIndexWeekNumber: string;
        let fetchError: Error;

        let dishPriceWeekNumber: DishPriceWeekNumber = null;

        try {
            dishDescription =
                await this._htmlFetcherHelper.textContentFromHtmlDocument(xPath.descriptionXPath);

            priceSEK =
                ( await this._htmlFetcherHelper.textContentFromHtmlDocument(xPath.price_SEKXPath ))
                .match(/\d+(?=\s?kr)/)[0];

            weekIndexWeekNumber =
                ( await this._htmlFetcherHelper.textContentFromHtmlDocument(xPath.weekNumberXPath ))
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
                    descriptionXPath: `//li[@id='glasklartlunchwidget-2']/h4[contains(.,'${weekDay}')]/following-sibling::p[1]`,
                    price_SEKXPath: `//p/span[contains(.,'11.45 - 12.45')]/following-sibling::text()[1]`,
                    weekNumberXPath: `//h2/text()[contains(.,'Lunch v.')]`,
                };
                break;
            case LabelName.VEGETARIAN:
                result = {
                    descriptionXPath: `//li[@id='glasklartlunchwidget-2']/h4[contains(.,'Veckans vegetariska')]/following-sibling::p[1]`,
                    price_SEKXPath: `//p/span[contains(.,'11.45 - 12.45')]/following-sibling::text()[1]`,
                    weekNumberXPath: `//h2/text()[contains(.,'Lunch v.')]`,
                };
                break;
            default:
                throw new Error(`No xpath-implementation for label: ${label}`);
        }

        return result;
    }
}
