import { FetcherType } from "../../enum/FetcherType";
import { IndexNumber } from "../../enum/IndexNumber";
import { LabelName } from "../../enum/LabelName";
import { WeekDayIndex } from "../../enum/WeekDayIndex";
import { IDealerResult } from "../../interfaces/IDealerResult";
import { IHtmlDocumentParser } from "../../interfaces/IHtmlDocumentParser";
import { IMenuUrlDynamicData } from "../../interfaces/IMenuUrlDynamicData";
import { IWebMealDealerStatic } from "../../interfaces/IWebMealDealerStatic";
import { IWebMealResult } from "../../interfaces/IWebMealResult";
import { IXPathDishProviderResult } from "../../interfaces/IXpathDishProviderResult";
import { DealerResult } from "../DealerResult";
import { WebMealResult } from "../WebMealResult";
import { DishPriceWeekNumber } from "./DishPriceWeekNumber";

export const SkrylleRestaurangDealer: IWebMealDealerStatic =  class SkrylleRestaurangDealerLocal {

    public static get baseUrlStatic(): string {
        const baseUrl = "http://www.skryllerestaurang.se/";
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

    public async mealsFromWeb(): Promise<IDealerResult> {
        const mealsForAWeekPromise =  this.getWebMealResultAForAWeek();
        const dealerResult = new DealerResult( SkrylleRestaurangDealer.baseUrlStatic, mealsForAWeekPromise );

        return dealerResult;
    }

    private getWebMealResultAForAWeek( ): Array<Promise<IWebMealResult>> {

        const mealsForAWeek: Array<Promise<IWebMealResult>>  = [
            this.webMealResult( WeekDayIndex.MONDAY, LabelName.MEAL_OF_THE_DAY, IndexNumber.ONE),
            this.webMealResult( WeekDayIndex.MONDAY, LabelName.VEGETARIAN, IndexNumber.ONE),
            this.webMealResult( WeekDayIndex.MONDAY, LabelName.MEAT, IndexNumber.ONE),
            this.webMealResult( WeekDayIndex.MONDAY, LabelName.FISH_AND_SEAFOOD, IndexNumber.ONE),

            this.webMealResult( WeekDayIndex.TUESDAY, LabelName.MEAL_OF_THE_DAY, IndexNumber.ONE),
            this.webMealResult( WeekDayIndex.TUESDAY, LabelName.VEGETARIAN, IndexNumber.ONE),
            this.webMealResult( WeekDayIndex.TUESDAY, LabelName.MEAT, IndexNumber.ONE),
            this.webMealResult( WeekDayIndex.TUESDAY, LabelName.FISH_AND_SEAFOOD, IndexNumber.ONE),

            this.webMealResult( WeekDayIndex.WEDNESDAY, LabelName.MEAL_OF_THE_DAY, IndexNumber.ONE),
            this.webMealResult( WeekDayIndex.WEDNESDAY, LabelName.VEGETARIAN, IndexNumber.ONE),
            this.webMealResult( WeekDayIndex.WEDNESDAY, LabelName.MEAT, IndexNumber.ONE),
            this.webMealResult( WeekDayIndex.WEDNESDAY, LabelName.FISH_AND_SEAFOOD, IndexNumber.ONE),

            this.webMealResult( WeekDayIndex.THURSDAY, LabelName.MEAL_OF_THE_DAY, IndexNumber.ONE),
            this.webMealResult( WeekDayIndex.THURSDAY, LabelName.VEGETARIAN, IndexNumber.ONE),
            this.webMealResult( WeekDayIndex.THURSDAY, LabelName.MEAT, IndexNumber.ONE),
            this.webMealResult( WeekDayIndex.THURSDAY, LabelName.FISH_AND_SEAFOOD, IndexNumber.ONE),

            this.webMealResult( WeekDayIndex.FRIDAY, LabelName.MEAL_OF_THE_DAY, IndexNumber.ONE),
            this.webMealResult( WeekDayIndex.FRIDAY, LabelName.VEGETARIAN, IndexNumber.ONE),
            this.webMealResult( WeekDayIndex.FRIDAY, LabelName.MEAT, IndexNumber.ONE),
            this.webMealResult( WeekDayIndex.FRIDAY, LabelName.FISH_AND_SEAFOOD, IndexNumber.ONE),

            this.webMealResult( WeekDayIndex.SATURDAY, LabelName.MEAL_OF_THE_DAY, IndexNumber.ONE),
            this.webMealResult( WeekDayIndex.SATURDAY, LabelName.VEGETARIAN, IndexNumber.ONE),
            this.webMealResult( WeekDayIndex.SATURDAY, LabelName.MEAT, IndexNumber.ONE),
            this.webMealResult( WeekDayIndex.SATURDAY, LabelName.FISH_AND_SEAFOOD, IndexNumber.ONE),

            this.webMealResult( WeekDayIndex.SUNDAY, LabelName.MEAL_OF_THE_DAY, IndexNumber.ONE),
            this.webMealResult( WeekDayIndex.SUNDAY, LabelName.VEGETARIAN, IndexNumber.ONE),
            this.webMealResult( WeekDayIndex.SUNDAY, LabelName.MEAT, IndexNumber.ONE),
            this.webMealResult( WeekDayIndex.SUNDAY, LabelName.FISH_AND_SEAFOOD, IndexNumber.ONE),
        ];

        return mealsForAWeek;
    }

    private async webMealResult(
        dayIndex: WeekDayIndex,
        label: LabelName, indexNumber: IndexNumber ): Promise<IWebMealResult> {

        let dishPriceWeekNumber: DishPriceWeekNumber = null;
        let webMealResult: WebMealResult = null;

        const xPath = this.xpathProvider(dayIndex, label, indexNumber);

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
                    dishPriceWeekNumber.priceSEK, indexNumber, label, dayIndex,
                    dishPriceWeekNumber.weekIndexWeekNumber, this.weekYear, null);

        } catch ( e ) {
            webMealResult =
                new WebMealResult( this.baseUrl, "", "", indexNumber, label,
                dayIndex, this.weekNumberExpected, this.weekYear, e);
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

            const dishDescriptionUnsanitized =
                await this.dealerData.textContentFromHtmlDocument(xPath.descriptionXPath);
            dishDescription = dishDescriptionUnsanitized.match(/.+/)[0];

            const priceSEKUnsanitized =
                await this.dealerData.textContentFromHtmlDocument(xPath.price_SEKXPath);
            priceSEK = priceSEKUnsanitized.match(/\d+/)[0];

            const weekIndexWeekNumberUnsanitized =
                await this.dealerData.textContentFromHtmlDocument(xPath.weekNumberXPath);
            weekIndexWeekNumber =
                weekIndexWeekNumberUnsanitized.match(/(?<=(ecka|[v][.]?)\s*[0]?)\d+/i)[0];

        } catch ( error ) {
            fetchError = error;
        }

        dishPriceWeekNumber = new DishPriceWeekNumber(dishDescription, priceSEK, weekIndexWeekNumber, fetchError );

        return dishPriceWeekNumber;
    }

    private getXpathDishHeader( dayIndex: WeekDayIndex, label: LabelName, indexNumber: IndexNumber ): string {

        let dishHeader = "";

        switch (label) {

            case LabelName.MEAL_OF_THE_DAY:
                dishHeader = this.getWeekDayName(dayIndex);
                break;

            case LabelName.VEGETARIAN:
                dishHeader = "egetarisk";
                break;

            case LabelName.MEAT:
                dishHeader = "ött";
                break;

            case LabelName.FISH_AND_SEAFOOD:
                dishHeader = "Fisk";
                break;

            default:
                throw Error(`Bad label ${label}`);
        }

        return dishHeader;
    }

    private getWeekDayName( dayIndex: WeekDayIndex ): string {
        let swedishWeekDayName = "";

        switch ( dayIndex ) {
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
            case WeekDayIndex.SATURDAY :
                swedishWeekDayName = "ördag";
                break;
            case WeekDayIndex.SUNDAY :
                swedishWeekDayName = "öndag";
                break;
            default:
                throw Error(`Bad day index ${dayIndex}`);
        }
        return swedishWeekDayName;
    }

    private xpathProvider(
        dayIndex: WeekDayIndex, label: LabelName, indexNumber: IndexNumber ): IXPathDishProviderResult {

        let result: IXPathDishProviderResult;

        const dishHeader = this.getXpathDishHeader( dayIndex, label, indexNumber );

        result = {
            descriptionXPath: `//h3[contains(.,'${dishHeader}')]/following-sibling::p[1]`,
            labelXPath: null,
            price_SEKXPath: `//h3[contains(.,'${dishHeader}')]/span`,
            weekNumberXPath: `//h2[contains(.,'eckans lunch')]`,
        };

        return result;
    }
};
