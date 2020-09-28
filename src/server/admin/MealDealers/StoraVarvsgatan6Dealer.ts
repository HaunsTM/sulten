import { FetcherType } from "../../enum/FetcherType";
import { IndexNumber } from "../../enum/IndexNumber";
import { LabelName } from "../../enum/LabelName";
import { WeekDayIndex } from "../../enum/WeekDayIndex";
import { EpochHelper } from "../../helpers/EpochHelper";
import { IDealerResult } from "../../interfaces/IDealerResult";
import { IEpochHelper } from "../../interfaces/IEpochHelper";
import { IHtmlDocumentParser } from "../../interfaces/IHtmlDocumentParser";
import { IMenuUrlDynamicData } from "../../interfaces/IMenuUrlDynamicData";
import { IWebMealDealerStatic } from "../../interfaces/IWebMealDealerStatic";
import { IWebMealResult } from "../../interfaces/IWebMealResult";
import { IXPathDishProviderResult } from "../../interfaces/IXpathDishProviderResult";
import { DealerResult } from "../DealerResult";
import { WebMealResult } from "../WebMealResult";
import { DishPriceWeekNumber } from "./DishPriceWeekNumber";

export const StoraVarvsgatan6Dealer: IWebMealDealerStatic =  class StoraVarvsgatan6Local {

    public static get baseUrlStatic(): string {
        const baseUrl = "https://storavarvsgatan6.se/meny.html";
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
        const dealerResult = new DealerResult( StoraVarvsgatan6Dealer.baseUrlStatic, mealsForAWeekPromise );

        return dealerResult;
    }

    private getWebMealResultAForAWeek(): Array<Promise<IWebMealResult>> {

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

    private async webMealResult( dayIndex: WeekDayIndex,
                                 label: LabelName, indexNumber: IndexNumber): Promise<IWebMealResult> {

        let dishPriceWeekNumber: DishPriceWeekNumber = null;
        let webMealResult: WebMealResult = null;

        const xPath = this.xpathProvider(dayIndex, label, indexNumber);

        try {
            dishPriceWeekNumber =
                await this.getDishPriceWeekNumber(xPath, label);

            if ( dishPriceWeekNumber.fetchError ) {
                throw dishPriceWeekNumber.fetchError;
            }

            if ( this.weekNumberExpected !== dishPriceWeekNumber.weekIndexWeekNumber) {
                throw new Error(`Expected to see menu for week ${this.weekNumberExpected}, but found week ${dishPriceWeekNumber.weekIndexWeekNumber}`);
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
        }
        return swedishWeekDayName;
    }

    private async getDishPriceWeekNumber(
        xPath: IXPathDishProviderResult, label: LabelName ): Promise<DishPriceWeekNumber> {

        let dishDescription: string;
        let priceSEK: string;
        let weekIndexWeekNumber: string;
        let fetchError: Error;

        let dishPriceWeekNumber: DishPriceWeekNumber = null;
        const free = "0";
        try {
            const dishDescriptionUnsanitized =
                await this.dealerData.textContentFromHtmlDocument(xPath.descriptionXPath);
            dishDescription = dishDescriptionUnsanitized.match(/[:]\s*(.+)\s*/)[1];

            priceSEK = free;

            const weekIndexWeekNumberUnsanitized =
                await this.dealerData.textContentFromHtmlDocument(xPath.weekNumberXPath);
            weekIndexWeekNumber =
                weekIndexWeekNumberUnsanitized.match(/(?<=ecka.*)[0]?(\d+)/i)[0];
            const i = 0;

        } catch ( error ) {
            fetchError = error;
        }

        dishPriceWeekNumber = new DishPriceWeekNumber(dishDescription, priceSEK, weekIndexWeekNumber, fetchError );

        return dishPriceWeekNumber;
    }

    private getCalculatedXPath(
        dayIndex: WeekDayIndex, label: LabelName, indexNumber: IndexNumber ): IXPathDishProviderResult {

        let descriptionXPath: string;
        let price_SEKXPath: string;

        const currentWeekDayName = this.getWeekDayName(dayIndex);

        const baseDescriptionXPath = ( searchStart: string ) => {
            const xPath =
            `//p[contains(.,"${searchStart}")]`;
            return xPath;
        };

        switch (label) {

            case LabelName.MEAL_OF_THE_DAY:
                descriptionXPath =
                    `(` +
                    `${baseDescriptionXPath(currentWeekDayName)}` +
                    `/following-sibling::p[contains(.,"agens:") and not(contains(.,"("))]` +
                    `)[1]`;
                price_SEKXPath = null;
                break;
            case LabelName.VEGETARIAN:
                descriptionXPath =
                    `(` +
                    `${baseDescriptionXPath(currentWeekDayName)}` +
                    `/following-sibling::p[contains(.,"egetarisk:") and not(contains(.,"("))]` +
                    `)[1]`;
                price_SEKXPath = null;
                break;

            default:
                throw Error(`Bad label ${label}`);
        }

        const result: IXPathDishProviderResult = {
            descriptionXPath,
            labelXPath: null,
            price_SEKXPath,
            weekNumberXPath: null,
        };

        return result;
    }

    private xpathProvider(
        dayIndex: WeekDayIndex, label: LabelName, indexNumber: IndexNumber ): IXPathDishProviderResult {

        let result: IXPathDishProviderResult;
        const calculatedXpaths = this.getCalculatedXPath(dayIndex, label, indexNumber);

        result = {
            descriptionXPath: calculatedXpaths.descriptionXPath,
            labelXPath: null,
            price_SEKXPath: calculatedXpaths.price_SEKXPath,
            weekNumberXPath: `(//span/text()[contains(.,'ecka')])[1]`,
        };
        return result;
    }
};
