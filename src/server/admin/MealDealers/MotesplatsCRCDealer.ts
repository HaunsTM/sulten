import { FetcherType } from "../../enum/FetcherType";
import { IndexNumber } from "../../enum/IndexNumber";
import { LabelName } from "../../enum/LabelName";
import { WeekDayIndex } from "../../enum/WeekDayIndex";
import { IHtmlDocumentParser } from "../../interfaces/IHtmlDocumentParser";
import { IMenuUrlDynamicData } from "../../interfaces/IMenuUrlDynamicData";
import { IWebMealDealerStatic } from "../../interfaces/IWebMealDealerStatic";
import { IWebMealResult } from "../../interfaces/IWebMealResult";
import { IXPathDishProviderResult } from "../../interfaces/IXpathDishProviderResult";
import { WebMealResult } from "../WebMealResult";
import { DishPriceWeekNumber } from "./DishPriceWeekNumber";

export const MotesplatsCRCDealer: IWebMealDealerStatic =  class MotesplatsCRCDealerLocal {

    public static get baseUrlStatic(): string {
        const baseUrl = "https://motesplatscrc.se/veckans-lunch/";
        return baseUrl;
    }

    public static get fetcherTypeNeededStatic(): FetcherType {
        return FetcherType.HTML;
    }

    public static async menuUrlStatic(
        pageWhereToFindMenuUrl: IHtmlDocumentParser, menuUrlDynamicData: IMenuUrlDynamicData): Promise<string> {
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
            this.webMealResult( WeekDayIndex.MONDAY, LabelName.MEAL_OF_THE_DAY, IndexNumber.ONE),
            this.webMealResult( WeekDayIndex.MONDAY, LabelName.VEGETARIAN, IndexNumber.ONE),

            this.webMealResult( WeekDayIndex.TUESDAY, LabelName.MEAL_OF_THE_DAY, IndexNumber.ONE),
            this.webMealResult( WeekDayIndex.TUESDAY, LabelName.VEGETARIAN, IndexNumber.ONE),

            this.webMealResult( WeekDayIndex.WEDNESDAY, LabelName.MEAL_OF_THE_DAY, IndexNumber.ONE),
            this.webMealResult( WeekDayIndex.WEDNESDAY, LabelName.VEGETARIAN, IndexNumber.ONE),

            this.webMealResult( WeekDayIndex.THURSDAY, LabelName.MEAL_OF_THE_DAY, IndexNumber.ONE),
            this.webMealResult( WeekDayIndex.THURSDAY, LabelName.VEGETARIAN, IndexNumber.ONE),

            this.webMealResult( WeekDayIndex.FRIDAY, LabelName.MEAL_OF_THE_DAY, IndexNumber.ONE),
            this.webMealResult( WeekDayIndex.FRIDAY, LabelName.VEGETARIAN, IndexNumber.ONE),
        ];

        return mealsForAWeek;
    }

    private async webMealResult(
        weekDayJavascriptDayIndex: WeekDayIndex,
        label: LabelName, indexNumber: IndexNumber ): Promise<IWebMealResult> {

        let dishPriceWeekNumber: DishPriceWeekNumber = null;
        let webMealResult: WebMealResult = null;

        const swedishWeekDayName = this.getSwedishWeekDayName( weekDayJavascriptDayIndex );
        const xPath = this.xpathProvider(swedishWeekDayName, label, indexNumber);

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

    private getSwedishWeekDayName( weekDay: WeekDayIndex ): string {
        let swedishWeekDayName = "";

        switch ( weekDay ) {
            case WeekDayIndex.MONDAY :
                swedishWeekDayName = "åndag";
                break;
            case WeekDayIndex.TUESDAY :
                swedishWeekDayName = "isdag";
                break;
            case WeekDayIndex.WEDNESDAY :
                swedishWeekDayName = "nsdag";
                break;
            case WeekDayIndex.THURSDAY :
                swedishWeekDayName = "orsdag";
                break;
            case WeekDayIndex.FRIDAY :
                swedishWeekDayName = "redag";
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
                .match(/(?<=vecka\s*[0]?)\d+/i)[0];
        } catch ( error ) {
            fetchError = error;
        }

        dishPriceWeekNumber = new DishPriceWeekNumber(dishDescription, priceSEK, weekIndexWeekNumber, fetchError );

        return dishPriceWeekNumber;
    }


    private getXpathDishLabelIndex( label: LabelName, indexNumber: IndexNumber ): string {

        let paragraphIndexAfterDayNameParagraph = -1;

        switch (label) {

            case LabelName.MEAL_OF_THE_DAY:
                switch (indexNumber) {
                    case IndexNumber.ONE:
                        paragraphIndexAfterDayNameParagraph = 2;
                        break;
                    default:
                        throw Error(`Bad indexNumber = ${indexNumber} for label ${label}`);
                }
                break;

            case LabelName.VEGETARIAN:
                switch (indexNumber) {
                    case IndexNumber.ONE:
                        paragraphIndexAfterDayNameParagraph = 1;
                        break;
                    default:
                        throw Error(`Bad indexNumber = ${indexNumber} for label ${label}`);
                }
                break;

            case LabelName.A_LA_CARTE:
                break;
            default:
                throw Error(`Bad label ${label}`);
        }

        return paragraphIndexAfterDayNameParagraph.toString();
    }

    private xpathProvider( weekDay: string, label: LabelName, indexNumber: IndexNumber ): IXPathDishProviderResult {

        let result: IXPathDishProviderResult;

        const labelIndex = this.getXpathDishLabelIndex( label, indexNumber );
        const commonWeekNumberXPath = `//h1[contains(.,'vecka')]`;

        switch (label) {
            case LabelName.MEAL_OF_THE_DAY:
            case LabelName.VEGETARIAN:
                result = {
                    descriptionXPath: `//p[contains(.,'${weekDay}')]/following-sibling::p[${labelIndex}]`,
                    labelXPath: null,
                    price_SEKXPath: `//h1[contains(.,'agens rätt')][contains(.,'egetariska')]`,
                    weekNumberXPath: commonWeekNumberXPath,
                };
                break;
            default:
                throw new Error(`No xpath-implementation for label: ${label}`);
        }

        return result;
    }
};
