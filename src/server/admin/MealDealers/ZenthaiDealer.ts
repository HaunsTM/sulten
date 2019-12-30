import { IndexNumber } from "../../enum/IndexNumber";
import { FetcherType } from "../../enum/FetcherType";
import { LabelName } from "../../enum/LabelName";
import { WeekDayIndex } from "../../enum/WeekDayIndex";
import { IHtmlDocumentParser } from "../../interfaces/IHtmlDocumentParser";
import { IWebMealDealerStatic } from "../../interfaces/IWebMealDealerStatic";
import { IWebMealResult } from "../../interfaces/IWebMealResult";
import { IXPathDishProviderResult } from "../../interfaces/IXpathDishProviderResult";
import { DishPriceWeekNumber } from "./DishPriceWeekNumber";
import { WebMealResult } from "./WebMealResult";

export const ZenthaiDealer: IWebMealDealerStatic =  class ZenthaiDealerLocal {

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
            this.webMealResult( WeekDayIndex.MONDAY, LabelName.THAI, IndexNumber.ONE),
            this.webMealResult( WeekDayIndex.MONDAY, LabelName.THAI, IndexNumber.TWO),
            this.webMealResult( WeekDayIndex.MONDAY, LabelName.THAI, IndexNumber.THREE),
            this.webMealResult( WeekDayIndex.MONDAY, LabelName.THAI, IndexNumber.FOUR),
            this.webMealResult( WeekDayIndex.MONDAY, LabelName.THAI, IndexNumber.FIVE),
            this.webMealResult( WeekDayIndex.MONDAY, LabelName.VEGETARIAN, IndexNumber.SIX),
            this.webMealResult( WeekDayIndex.MONDAY, LabelName.THAI, IndexNumber.SEVEN),
            this.webMealResult( WeekDayIndex.MONDAY, LabelName.VEGETARIAN, IndexNumber.EIGHT),

            this.webMealResult( WeekDayIndex.TUESDAY, LabelName.THAI, IndexNumber.ONE),
            this.webMealResult( WeekDayIndex.TUESDAY, LabelName.THAI, IndexNumber.TWO),
            this.webMealResult( WeekDayIndex.TUESDAY, LabelName.THAI, IndexNumber.THREE),
            this.webMealResult( WeekDayIndex.TUESDAY, LabelName.THAI, IndexNumber.FOUR),
            this.webMealResult( WeekDayIndex.TUESDAY, LabelName.THAI, IndexNumber.FIVE),
            this.webMealResult( WeekDayIndex.TUESDAY, LabelName.VEGETARIAN, IndexNumber.SIX),
            this.webMealResult( WeekDayIndex.TUESDAY, LabelName.THAI, IndexNumber.SEVEN),
            this.webMealResult( WeekDayIndex.TUESDAY, LabelName.VEGETARIAN, IndexNumber.EIGHT),

            this.webMealResult( WeekDayIndex.WEDNESDAY, LabelName.THAI, IndexNumber.ONE),
            this.webMealResult( WeekDayIndex.WEDNESDAY, LabelName.THAI, IndexNumber.TWO),
            this.webMealResult( WeekDayIndex.WEDNESDAY, LabelName.THAI, IndexNumber.THREE),
            this.webMealResult( WeekDayIndex.WEDNESDAY, LabelName.THAI, IndexNumber.FOUR),
            this.webMealResult( WeekDayIndex.WEDNESDAY, LabelName.THAI, IndexNumber.FIVE),
            this.webMealResult( WeekDayIndex.WEDNESDAY, LabelName.VEGETARIAN, IndexNumber.SIX),
            this.webMealResult( WeekDayIndex.WEDNESDAY, LabelName.THAI, IndexNumber.SEVEN),
            this.webMealResult( WeekDayIndex.WEDNESDAY, LabelName.VEGETARIAN, IndexNumber.EIGHT),

            this.webMealResult( WeekDayIndex.THURSDAY, LabelName.THAI, IndexNumber.ONE),
            this.webMealResult( WeekDayIndex.THURSDAY, LabelName.THAI, IndexNumber.TWO),
            this.webMealResult( WeekDayIndex.THURSDAY, LabelName.THAI, IndexNumber.THREE),
            this.webMealResult( WeekDayIndex.THURSDAY, LabelName.THAI, IndexNumber.FOUR),
            this.webMealResult( WeekDayIndex.THURSDAY, LabelName.THAI, IndexNumber.FIVE),
            this.webMealResult( WeekDayIndex.THURSDAY, LabelName.VEGETARIAN, IndexNumber.SIX),
            this.webMealResult( WeekDayIndex.THURSDAY, LabelName.THAI, IndexNumber.SEVEN),
            this.webMealResult( WeekDayIndex.THURSDAY, LabelName.VEGETARIAN, IndexNumber.EIGHT),

            this.webMealResult( WeekDayIndex.FRIDAY, LabelName.THAI, IndexNumber.ONE),
            this.webMealResult( WeekDayIndex.FRIDAY, LabelName.THAI, IndexNumber.TWO),
            this.webMealResult( WeekDayIndex.FRIDAY, LabelName.THAI, IndexNumber.THREE),
            this.webMealResult( WeekDayIndex.FRIDAY, LabelName.THAI, IndexNumber.FOUR),
            this.webMealResult( WeekDayIndex.FRIDAY, LabelName.THAI, IndexNumber.FIVE),
            this.webMealResult( WeekDayIndex.FRIDAY, LabelName.VEGETARIAN, IndexNumber.SIX),
            this.webMealResult( WeekDayIndex.FRIDAY, LabelName.THAI, IndexNumber.SEVEN),
            this.webMealResult( WeekDayIndex.FRIDAY, LabelName.VEGETARIAN, IndexNumber.EIGHT),
        ];

        return mealsForAWeek;
    }

    private async webMealResult(
        weekDayJavascriptDayIndex: WeekDayIndex,
        label: LabelName, indexNumber: IndexNumber ): Promise<IWebMealResult> {

        let dishPriceWeekNumber: DishPriceWeekNumber = null;
        let webMealResult: WebMealResult = null;

        const xPath = this.xpathProvider(indexNumber);

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
                    dishPriceWeekNumber.priceSEK, indexNumber, label, weekDayJavascriptDayIndex,
                    dishPriceWeekNumber.weekIndexWeekNumber, this.weekYear, null);

        } catch ( e ) {
            webMealResult =
                new WebMealResult( this.baseUrl, "", "", indexNumber, label,
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

    private xpathProvider(indexNumber: IndexNumber): IXPathDishProviderResult {

        let result: IXPathDishProviderResult;

        result = {
            descriptionXPath: `//div[@id='page-zones__main-widgets__content']//p[//strong][${indexNumber}]`,
            labelXPath: null,
            price_SEKXPath: `//td/span[//following-sibling::text()[contains(.,'äta här')]]`,
            weekNumberXPath: `//h1[contains(.,'vecka')]`,
        };

        return result;
    }
};
