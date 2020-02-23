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

export const RestaurangOresundsterminalenDealer: IWebMealDealerStatic =  class RestaurangOresundsterminalenDealerLocal {

    public static get baseUrlStatic(): string {
        const baseUrl = "https://www.oresundsterminalen.se/sv/veckomeny";
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
        const dealerResult = new DealerResult( RestaurangOresundsterminalenDealer.baseUrlStatic, mealsForAWeekPromise );

        return dealerResult;
    }

    private getWebMealResultAForAWeek(): Array<Promise<IWebMealResult>> {

        const mealsForAWeek: Array<Promise<IWebMealResult>>  = [
            this.webMealResult( WeekDayIndex.MONDAY, LabelName.MEAL_OF_THE_DAY, IndexNumber.ONE),
            this.webMealResult( WeekDayIndex.MONDAY, LabelName.MEAL_OF_THE_DAY, IndexNumber.TWO),
            this.webMealResult( WeekDayIndex.MONDAY, LabelName.MEAL_OF_THE_DAY, IndexNumber.THREE),
            this.webMealResult( WeekDayIndex.MONDAY, LabelName.DESSERT, IndexNumber.ONE),

            this.webMealResult( WeekDayIndex.TUESDAY, LabelName.MEAL_OF_THE_DAY, IndexNumber.ONE),
            this.webMealResult( WeekDayIndex.TUESDAY, LabelName.MEAL_OF_THE_DAY, IndexNumber.TWO),
            this.webMealResult( WeekDayIndex.TUESDAY, LabelName.MEAL_OF_THE_DAY, IndexNumber.THREE),
            this.webMealResult( WeekDayIndex.TUESDAY, LabelName.DESSERT, IndexNumber.ONE),

            this.webMealResult( WeekDayIndex.WEDNESDAY, LabelName.MEAL_OF_THE_DAY, IndexNumber.ONE),
            this.webMealResult( WeekDayIndex.WEDNESDAY, LabelName.MEAL_OF_THE_DAY, IndexNumber.TWO),
            this.webMealResult( WeekDayIndex.WEDNESDAY, LabelName.MEAL_OF_THE_DAY, IndexNumber.THREE),
            this.webMealResult( WeekDayIndex.WEDNESDAY, LabelName.DESSERT, IndexNumber.ONE),

            this.webMealResult( WeekDayIndex.THURSDAY, LabelName.MEAL_OF_THE_DAY, IndexNumber.ONE),
            this.webMealResult( WeekDayIndex.THURSDAY, LabelName.MEAL_OF_THE_DAY, IndexNumber.TWO),
            this.webMealResult( WeekDayIndex.THURSDAY, LabelName.MEAL_OF_THE_DAY, IndexNumber.THREE),
            this.webMealResult( WeekDayIndex.THURSDAY, LabelName.DESSERT, IndexNumber.ONE),

            this.webMealResult( WeekDayIndex.FRIDAY, LabelName.MEAL_OF_THE_DAY, IndexNumber.ONE),
            this.webMealResult( WeekDayIndex.FRIDAY, LabelName.MEAL_OF_THE_DAY, IndexNumber.TWO),
            this.webMealResult( WeekDayIndex.FRIDAY, LabelName.MEAL_OF_THE_DAY, IndexNumber.THREE),
            this.webMealResult( WeekDayIndex.FRIDAY, LabelName.DESSERT, IndexNumber.ONE),

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
            dishDescription = dishDescriptionUnsanitized.match(/(?<=[:])\s*(.+)/)[1];

            const priceSEKUnsanitized = label !== LabelName.DESSERT ? 
                await this.dealerData.textContentFromHtmlDocument(xPath.price_SEKXPath) : "";
            priceSEK = label !== LabelName.DESSERT ? priceSEKUnsanitized.match(/\d+(?=\s?:-)/)[0] : free;

            const weekIndexWeekNumberUnsanitized =
                await this.dealerData.textContentFromHtmlDocument(xPath.weekNumberXPath);
            weekIndexWeekNumber =
                weekIndexWeekNumberUnsanitized.match(/(?<=ecka\s*[0]?)\d+/i)[0];

        } catch ( error ) {
            fetchError = error;
        }

        dishPriceWeekNumber = new DishPriceWeekNumber(dishDescription, priceSEK, weekIndexWeekNumber, fetchError );

        return dishPriceWeekNumber;
    }

    private getXpathDishLabelNameOnOresundsTerminalen( label: LabelName, indexNumber: IndexNumber ): string {

        let xpathDishLabelNameOnOresundsTerminalen = "";

        switch (label) {

            case LabelName.MEAL_OF_THE_DAY:
                switch (indexNumber) {
                    case IndexNumber.ONE:
                        xpathDishLabelNameOnOresundsTerminalen = "lternativ 1";
                        break;
                    case IndexNumber.TWO:
                        xpathDishLabelNameOnOresundsTerminalen = "lternativ 2";
                        break;
                    case IndexNumber.THREE:
                        xpathDishLabelNameOnOresundsTerminalen = "lternativ 3";
                        break;
                    default:
                        throw Error(`Bad indexNumber = ${indexNumber} for label ${label}`);
                }
                break;

            case LabelName.DESSERT:
                switch (indexNumber) {
                    case IndexNumber.ONE:
                        xpathDishLabelNameOnOresundsTerminalen = "fterrätt";
                        break;
                    default:
                        throw Error(`Bad indexNumber = ${indexNumber} for label ${label}`);
                }
                break;

            default:
                throw Error(`Bad label ${label}`);
        }

        return xpathDishLabelNameOnOresundsTerminalen;
    }

    private xpathProvider(
        dayIndex: WeekDayIndex, label: LabelName, indexNumber: IndexNumber ): IXPathDishProviderResult {

        let result: IXPathDishProviderResult;

        const xpathDishLabelNameOnOresundsTerminalen =
            this.getXpathDishLabelNameOnOresundsTerminalen( label, indexNumber );
        const currentWeekDayName = this.getWeekDayName(dayIndex);
        const searchLimiter = dayIndex < 5 ? this.getWeekDayName(dayIndex + 1) : "salladsbuffé";

        const commonXpathDishLabelRow =
            `(` +
            `	//p[contains(.,'${currentWeekDayName}')]` + // example: monday
            `	|` + // or
            `	//p[preceding-sibling::*[contains(.,'${currentWeekDayName}')] and following-sibling::*[contains(.,'${searchLimiter}')]]` + // example: "between monday and tuesday" or "between friday and salladsbuffé"
            `)[1]` + // select the first (the only interesting) or the only one node
            `//text()[contains(.,'${xpathDishLabelNameOnOresundsTerminalen}')]`; // look for the menu alternative

        result = {
            descriptionXPath: commonXpathDishLabelRow,
            labelXPath: null,
            price_SEKXPath: label !== LabelName.DESSERT ? `//text()[contains(.,':-')]` : "",
            weekNumberXPath: `//span/text()[contains(.,'eny')][contains(.,'vecka')]`,
        };
        return result;
    }
};
