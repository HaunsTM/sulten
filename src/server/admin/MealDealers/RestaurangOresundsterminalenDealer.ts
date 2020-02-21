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
import { ScotlandYardDealer } from "./ScotlandYardDealer";

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
        const dealerResult = new DealerResult( ScotlandYardDealer.baseUrlStatic, mealsForAWeekPromise );

        return dealerResult;
    }

    private getWebMealResultAForAWeek(): Array<Promise<IWebMealResult>> {

        const mealsForAWeek: Array<Promise<IWebMealResult>>  = [
            this.webMealResult( WeekDayIndex.MONDAY, LabelName.MEAL_OF_THE_DAY, IndexNumber.ONE),
            this.webMealResult( WeekDayIndex.MONDAY, LabelName.MEAL_OF_THE_DAY, IndexNumber.TWO),

            this.webMealResult( WeekDayIndex.TUESDAY, LabelName.VEGETARIAN, IndexNumber.ONE),
            this.webMealResult( WeekDayIndex.TUESDAY, LabelName.MEAL_OF_THE_DAY, IndexNumber.ONE),
            this.webMealResult( WeekDayIndex.TUESDAY, LabelName.MEAL_OF_THE_DAY, IndexNumber.TWO),

            this.webMealResult( WeekDayIndex.WEDNESDAY, LabelName.VEGETARIAN, IndexNumber.ONE),
            this.webMealResult( WeekDayIndex.WEDNESDAY, LabelName.MEAL_OF_THE_DAY, IndexNumber.ONE),
            this.webMealResult( WeekDayIndex.WEDNESDAY, LabelName.MEAL_OF_THE_DAY, IndexNumber.TWO),

            this.webMealResult( WeekDayIndex.THURSDAY, LabelName.VEGETARIAN, IndexNumber.ONE),
            this.webMealResult( WeekDayIndex.THURSDAY, LabelName.MEAL_OF_THE_DAY, IndexNumber.ONE),
            this.webMealResult( WeekDayIndex.THURSDAY, LabelName.MEAL_OF_THE_DAY, IndexNumber.TWO),

            this.webMealResult( WeekDayIndex.FRIDAY, LabelName.VEGETARIAN, IndexNumber.ONE),
            this.webMealResult( WeekDayIndex.FRIDAY, LabelName.MEAL_OF_THE_DAY, IndexNumber.ONE),
            this.webMealResult( WeekDayIndex.FRIDAY, LabelName.MEAL_OF_THE_DAY, IndexNumber.TWO),
        ];

        return mealsForAWeek;
    }

    private async webMealResult( weekDayJavascriptDayIndex: WeekDayIndex,
                                 label: LabelName, indexNumber: IndexNumber): Promise<IWebMealResult> {

        let dishPriceWeekNumber: DishPriceWeekNumber = null;
        let webMealResult: WebMealResult = null;

        const weekDayId = this.getWeekDayId( weekDayJavascriptDayIndex );
        const xPath = this.xpathProvider(weekDayId, label, indexNumber);

        try {
            dishPriceWeekNumber =
                await this.getDishPriceWeekNumber(xPath);

            if ( dishPriceWeekNumber.fetchError ) {
                throw dishPriceWeekNumber.fetchError;
            }

            if ( this.weekNumberExpected !== dishPriceWeekNumber.weekIndexWeekNumber) {
                throw new Error(`Expected to see menu for week ${this.weekNumberExpected}, but found week ${dishPriceWeekNumber.weekIndexWeekNumber}`);
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

    private getWeekDayId( weekDayJavascriptDayIndex: WeekDayIndex ): string {
        let swedishWeekDayName = "";

        switch ( weekDayJavascriptDayIndex ) {
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
                .match(/\d+(?=\s?:-)/)[0];

            weekIndexWeekNumber =
                ( await this.dealerData.textContentFromHtmlDocument(xPath.weekNumberXPath ))
                .match(/(?<=ecka\s*[0]?)\d+/i)[0];
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

    private xpathProvider( weekDayId: string, label: LabelName, indexNumber: IndexNumber ): IXPathDishProviderResult {

        let result: IXPathDishProviderResult;

        const xpathDishLabelNameOnP2 = this.getXpathDishLabelNameOnOresundsTerminalen( label, indexNumber );
        const commonXpathDishLabelRow = `//div[@id='${weekDayId}']//tr[td[contains(@class,'course_type')][contains(.,'${xpathDishLabelNameOnP2}')]]`;

        p[ [som är måndag | ligger mellan måndag och tisdag]]/text()[contains(.,'Alternativ 1')]



        som är måndag
        
        
        
        ligger mellan måndag och tisdag
        //p[preceding-sibling::*[contains(.,'åndag')] and following-sibling::*[contains(.,'isdag')]]
        result = {
            
            descriptionXPath: `p[ [som är måndag | ligger mellan måndag och tisdag]]/text()[contains(.,'Alternativ 1')]`,
            labelXPath: null,
            price_SEKXPath: `//text()[contains(.,':-')]`,
            weekNumberXPath: `//span/text()[contains(.,'eny')][contains(.,'vecka')]`,
        }
        return result;
    }

};
