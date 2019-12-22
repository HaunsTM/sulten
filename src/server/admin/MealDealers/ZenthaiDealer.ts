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

export const ZenthaiDealer: IWebMealDealerStatic =  class ZenthaiDealer {

    public static get baseUrlStatic(): string {
        const baseUrl = "http://www.zenthai.se/";
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
            this.webMealResult( WeekDayJavascriptDayIndex.MONDAY, LabelName.THAI, AlternativeIndex.ONE),
            this.webMealResult( WeekDayJavascriptDayIndex.MONDAY, LabelName.THAI, AlternativeIndex.TWO),
            this.webMealResult( WeekDayJavascriptDayIndex.MONDAY, LabelName.THAI, AlternativeIndex.THREE),
            this.webMealResult( WeekDayJavascriptDayIndex.MONDAY, LabelName.THAI, AlternativeIndex.FOUR),
            this.webMealResult( WeekDayJavascriptDayIndex.MONDAY, LabelName.THAI, AlternativeIndex.FIVE),
            this.webMealResult( WeekDayJavascriptDayIndex.MONDAY, LabelName.VEGETARIAN, AlternativeIndex.SIX),
            this.webMealResult( WeekDayJavascriptDayIndex.MONDAY, LabelName.THAI, AlternativeIndex.SEVEN),
            this.webMealResult( WeekDayJavascriptDayIndex.MONDAY, LabelName.VEGETARIAN, AlternativeIndex.EIGHT),

            this.webMealResult( WeekDayJavascriptDayIndex.TUESDAY, LabelName.THAI, AlternativeIndex.ONE),
            this.webMealResult( WeekDayJavascriptDayIndex.TUESDAY, LabelName.THAI, AlternativeIndex.TWO),
            this.webMealResult( WeekDayJavascriptDayIndex.TUESDAY, LabelName.THAI, AlternativeIndex.THREE),
            this.webMealResult( WeekDayJavascriptDayIndex.TUESDAY, LabelName.THAI, AlternativeIndex.FOUR),
            this.webMealResult( WeekDayJavascriptDayIndex.TUESDAY, LabelName.THAI, AlternativeIndex.FIVE),
            this.webMealResult( WeekDayJavascriptDayIndex.TUESDAY, LabelName.VEGETARIAN, AlternativeIndex.SIX),
            this.webMealResult( WeekDayJavascriptDayIndex.TUESDAY, LabelName.THAI, AlternativeIndex.SEVEN),
            this.webMealResult( WeekDayJavascriptDayIndex.TUESDAY, LabelName.VEGETARIAN, AlternativeIndex.EIGHT),

            this.webMealResult( WeekDayJavascriptDayIndex.WEDNESDAY, LabelName.THAI, AlternativeIndex.ONE),
            this.webMealResult( WeekDayJavascriptDayIndex.WEDNESDAY, LabelName.THAI, AlternativeIndex.TWO),
            this.webMealResult( WeekDayJavascriptDayIndex.WEDNESDAY, LabelName.THAI, AlternativeIndex.THREE),
            this.webMealResult( WeekDayJavascriptDayIndex.WEDNESDAY, LabelName.THAI, AlternativeIndex.FOUR),
            this.webMealResult( WeekDayJavascriptDayIndex.WEDNESDAY, LabelName.THAI, AlternativeIndex.FIVE),
            this.webMealResult( WeekDayJavascriptDayIndex.WEDNESDAY, LabelName.VEGETARIAN, AlternativeIndex.SIX),
            this.webMealResult( WeekDayJavascriptDayIndex.WEDNESDAY, LabelName.THAI, AlternativeIndex.SEVEN),
            this.webMealResult( WeekDayJavascriptDayIndex.WEDNESDAY, LabelName.VEGETARIAN, AlternativeIndex.EIGHT),

            this.webMealResult( WeekDayJavascriptDayIndex.THURSDAY, LabelName.THAI, AlternativeIndex.ONE),
            this.webMealResult( WeekDayJavascriptDayIndex.THURSDAY, LabelName.THAI, AlternativeIndex.TWO),
            this.webMealResult( WeekDayJavascriptDayIndex.THURSDAY, LabelName.THAI, AlternativeIndex.THREE),
            this.webMealResult( WeekDayJavascriptDayIndex.THURSDAY, LabelName.THAI, AlternativeIndex.FOUR),
            this.webMealResult( WeekDayJavascriptDayIndex.THURSDAY, LabelName.THAI, AlternativeIndex.FIVE),
            this.webMealResult( WeekDayJavascriptDayIndex.THURSDAY, LabelName.VEGETARIAN, AlternativeIndex.SIX),
            this.webMealResult( WeekDayJavascriptDayIndex.THURSDAY, LabelName.THAI, AlternativeIndex.SEVEN),
            this.webMealResult( WeekDayJavascriptDayIndex.THURSDAY, LabelName.VEGETARIAN, AlternativeIndex.EIGHT),

            this.webMealResult( WeekDayJavascriptDayIndex.FRIDAY, LabelName.THAI, AlternativeIndex.ONE),
            this.webMealResult( WeekDayJavascriptDayIndex.FRIDAY, LabelName.THAI, AlternativeIndex.TWO),
            this.webMealResult( WeekDayJavascriptDayIndex.FRIDAY, LabelName.THAI, AlternativeIndex.THREE),
            this.webMealResult( WeekDayJavascriptDayIndex.FRIDAY, LabelName.THAI, AlternativeIndex.FOUR),
            this.webMealResult( WeekDayJavascriptDayIndex.FRIDAY, LabelName.THAI, AlternativeIndex.FIVE),
            this.webMealResult( WeekDayJavascriptDayIndex.FRIDAY, LabelName.VEGETARIAN, AlternativeIndex.SIX),
            this.webMealResult( WeekDayJavascriptDayIndex.FRIDAY, LabelName.THAI, AlternativeIndex.SEVEN),
            this.webMealResult( WeekDayJavascriptDayIndex.FRIDAY, LabelName.VEGETARIAN, AlternativeIndex.EIGHT),
        ];

        return mealsForAWeek;
    }

    private async webMealResult(
        weekDayJavascriptDayIndex: WeekDayJavascriptDayIndex,
        label: LabelName, alternativeIndex: AlternativeIndex ): Promise<IWebMealResult> {

        let dishPriceWeekNumber: DishPriceWeekNumber = null;
        let webMealResult: WebMealResult = null;

        const xPath = this.xpathProvider(alternativeIndex);

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

    private async getDishPriceWeekNumber( xPath: IXPathDishProviderResult ): Promise<DishPriceWeekNumber> {

        let dishDescription: string;
        let priceSEK: string;
        let weekIndexWeekNumber: string;
        let fetchError: Error;

        let dishPriceWeekNumber: DishPriceWeekNumber = null;

        try {
            dishDescription =
                (await this.dealerData.textContentFromHtmlDocument(xPath.descriptionXPath))
                .replace(/^\d+[.]\s/g, "")
                .replace(/[*].*[*]/g, "-");

            priceSEK =
                ( await this.dealerData.textContentFromHtmlDocument(xPath.price_SEKXPath ))
                .match(/\d+/)[0];

            weekIndexWeekNumber =
                ( await this.dealerData.textContentFromHtmlDocument(xPath.weekNumberXPath ))
                .match(/\d+/)[0];
        } catch ( error ) {
            fetchError = error;
        }

        dishPriceWeekNumber = new DishPriceWeekNumber(dishDescription, priceSEK, weekIndexWeekNumber, fetchError );

        return dishPriceWeekNumber;
    }

    private xpathProvider(alternativeIndex: AlternativeIndex): IXPathDishProviderResult {

        let result: IXPathDishProviderResult;

        result = {
            descriptionXPath: `//div[@id='page-zones__main-widgets__content']//p[//strong][${alternativeIndex}]`,
            price_SEKXPath: `//td/span[//following-sibling::text()[contains(.,'äta här')]]`,
            weekNumberXPath: `//h1[contains(.,'vecka')]`,
        };

        return result;
    }
};
