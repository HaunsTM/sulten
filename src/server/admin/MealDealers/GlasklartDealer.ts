import { AlternativeIndex } from "../../enum/AlternativeIndex";
import { FetcherType } from "../../enum/FetcherType";
import { LabelName } from "../../enum/LabelName";
import { WeekDayJavascriptDayIndex } from "../../enum/WeekDayJavascriptDayIndex";
import { IHtmlDocumentParser } from "../../interfaces/IHtmlDocumentParser";
import { IWebMealDealerStatic } from "../../interfaces/IWebMealDealerStatic";
import { IWebMealResult } from "../../interfaces/IWebMealResult";
import { IXPathDishProviderResult } from "../../interfaces/IXpathDishProviderResult";
import { DishPriceWeekNumber } from "./DishPriceWeekNumber";
import { WebMealResult } from "./WebMealResult";

export const GlasklartDealer: IWebMealDealerStatic =  class GlasklartDealer {

    public static get baseUrlStatic(): string {
        const baseUrl = "https://glasklart.eu/sv/lunch/";
        return baseUrl;
    }

    public static get fetcherTypeNeededStatic(): FetcherType {
        return FetcherType.HTML;
    }

    public static async menuUrlStatic(pageWhereToFindMenuUrl: IHtmlDocumentParser): Promise<string> {
        return pageWhereToFindMenuUrl.htmlDocument.URL;
    }
    private baseUrl: string;
    private dealerData: IHtmlDocumentParser = null;
    private weekNumberExpected: string = "";
    private weekYear: string = "";

    constructor(
        dealerData: IHtmlDocumentParser,
        baseUrl: string,
        weekYear: string,
        weekNumberExpected: string) {

        this.baseUrl = baseUrl;
        this.dealerData = dealerData;
        this.weekYear = weekYear;
        this.weekNumberExpected = weekNumberExpected;
    }

    public async mealsFromWeb(): Promise<IWebMealResult[]> {

        const mealsForAWeekPromise =  this.getWebMealResultAForAWeek();
        const mealsForAWeek = await Promise.all(mealsForAWeekPromise);

        return mealsForAWeek;
    }

    private getWebMealResultAForAWeek( ): Array<Promise<IWebMealResult>> {

        const mealsForAWeek: Array<Promise<IWebMealResult>>  = [
            this.webMealResult( WeekDayJavascriptDayIndex.MONDAY, LabelName.MEAL_OF_THE_DAY, AlternativeIndex.ONE),
            this.webMealResult( WeekDayJavascriptDayIndex.MONDAY, LabelName.VEGETARIAN, AlternativeIndex.ONE),

            this.webMealResult( WeekDayJavascriptDayIndex.TUESDAY, LabelName.MEAL_OF_THE_DAY, AlternativeIndex.ONE),
            this.webMealResult( WeekDayJavascriptDayIndex.TUESDAY, LabelName.VEGETARIAN, AlternativeIndex.ONE),

            this.webMealResult( WeekDayJavascriptDayIndex.WEDNESDAY, LabelName.MEAL_OF_THE_DAY, AlternativeIndex.ONE),
            this.webMealResult( WeekDayJavascriptDayIndex.WEDNESDAY, LabelName.VEGETARIAN, AlternativeIndex.ONE),

            this.webMealResult( WeekDayJavascriptDayIndex.THURSDAY, LabelName.MEAL_OF_THE_DAY, AlternativeIndex.ONE),
            this.webMealResult( WeekDayJavascriptDayIndex.THURSDAY, LabelName.VEGETARIAN, AlternativeIndex.ONE),

            this.webMealResult( WeekDayJavascriptDayIndex.FRIDAY, LabelName.MEAL_OF_THE_DAY, AlternativeIndex.ONE),
            this.webMealResult( WeekDayJavascriptDayIndex.FRIDAY, LabelName.VEGETARIAN, AlternativeIndex.ONE),
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

            if ( this.weekNumberExpected !== dishPriceWeekNumber.weekIndexWeekNumber) {
                throw new Error(`Expected to see menu for week ${this.weekNumberExpected}, but found week ${ dishPriceWeekNumber.weekIndexWeekNumber}`);
            }

            webMealResult =
                new WebMealResult(
                    this.baseUrl, dishPriceWeekNumber.dishDescription,
                    dishPriceWeekNumber.priceSEK, alternativeIndex, label, weekDayJavascriptDayIndex,
                    dishPriceWeekNumber.weekIndexWeekNumber, this.weekYear, null);

        } catch ( e ) {
            webMealResult =
                new WebMealResult( this.baseUrl, "", "", alternativeIndex, label,
                    weekDayJavascriptDayIndex, this.weekNumberExpected, this.weekYear, e);
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
                await this.dealerData.textContentFromHtmlDocument(xPath.descriptionXPath);

            priceSEK =
                ( await this.dealerData.textContentFromHtmlDocument(xPath.price_SEKXPath ))
                .match(/\d+(?=\s?kr)/)[0];

            weekIndexWeekNumber =
                ( await this.dealerData.textContentFromHtmlDocument(xPath.weekNumberXPath ))
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
};
