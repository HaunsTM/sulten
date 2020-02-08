import { FetcherType } from "../../enum/FetcherType";
import { IndexNumber } from "../../enum/IndexNumber";
import { LabelName } from "../../enum/LabelName";
import { WeekDayIndex } from "../../enum/WeekDayIndex";
import { EpochHelper } from "../../helpers/EpochHelper";
import { IHtmlDocumentParser } from "../../interfaces/IHtmlDocumentParser";
import { IMenuUrlDynamicData } from "../../interfaces/IMenuUrlDynamicData";
import { IWebMealDealerStatic } from "../../interfaces/IWebMealDealerStatic";
import { IWebMealResult } from "../../interfaces/IWebMealResult";
import { IXPathDishProviderResult } from "../../interfaces/IXpathDishProviderResult";
import { WebMealResult } from "../WebMealResult";
import { DishPriceWeekNumber } from "./DishPriceWeekNumber";

export const RestaurangKPDealer: IWebMealDealerStatic =  class RestaurangKPDealerLocal {

    public static get baseUrlStatic(): string {
        const baseUrl = "https://restaurangkp.se/lunchbuffe/";
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

    private getWebMealResultAForAWeek(): Array<Promise<IWebMealResult>> {

        const mealsForAWeek: Array<Promise<IWebMealResult>>  = [
            this.webMealResult( WeekDayIndex.MONDAY, LabelName.MEAL_OF_THE_DAY, IndexNumber.ONE),
            this.webMealResult( WeekDayIndex.MONDAY, LabelName.MEAL_OF_THE_DAY, IndexNumber.TWO),
            this.webMealResult( WeekDayIndex.MONDAY, LabelName.VEGETARIAN, IndexNumber.ONE),

            this.webMealResult( WeekDayIndex.TUESDAY, LabelName.MEAL_OF_THE_DAY, IndexNumber.ONE),
            this.webMealResult( WeekDayIndex.TUESDAY, LabelName.MEAL_OF_THE_DAY, IndexNumber.TWO),
            this.webMealResult( WeekDayIndex.TUESDAY, LabelName.VEGETARIAN, IndexNumber.ONE),

            this.webMealResult( WeekDayIndex.WEDNESDAY, LabelName.MEAL_OF_THE_DAY, IndexNumber.ONE),
            this.webMealResult( WeekDayIndex.WEDNESDAY, LabelName.MEAL_OF_THE_DAY, IndexNumber.TWO),
            this.webMealResult( WeekDayIndex.WEDNESDAY, LabelName.VEGETARIAN, IndexNumber.ONE),

            this.webMealResult( WeekDayIndex.THURSDAY, LabelName.MEAL_OF_THE_DAY, IndexNumber.ONE),
            this.webMealResult( WeekDayIndex.THURSDAY, LabelName.MEAL_OF_THE_DAY, IndexNumber.TWO),
            this.webMealResult( WeekDayIndex.THURSDAY, LabelName.VEGETARIAN, IndexNumber.ONE),

            this.webMealResult( WeekDayIndex.FRIDAY, LabelName.MEAL_OF_THE_DAY, IndexNumber.ONE),
            this.webMealResult( WeekDayIndex.FRIDAY, LabelName.MEAL_OF_THE_DAY, IndexNumber.TWO),
            this.webMealResult( WeekDayIndex.FRIDAY, LabelName.VEGETARIAN, IndexNumber.ONE),

        ];

        return mealsForAWeek;
    }

    private async webMealResult( weekDayJavascriptDayIndex: WeekDayIndex,
                                 label: LabelName, indexNumber: IndexNumber): Promise<IWebMealResult> {

        let dishPriceWeekNumber: DishPriceWeekNumber = null;
        let webMealResult: WebMealResult = null;

        const dayDateMonth =
            this.getDayNameDateMonthNameOnRestaurangKP(
                weekDayJavascriptDayIndex, this.weekYear, this.weekNumberExpected );
        const xpathDishLabelIndex = this.getXpathDishLabelIndex( label, indexNumber );

        try {
            dishPriceWeekNumber =
                await this.getDishPriceWeekNumber( dayDateMonth, xpathDishLabelIndex );

            if ( dishPriceWeekNumber.fetchError ) {
                throw dishPriceWeekNumber.fetchError;
            }

            webMealResult =
                new WebMealResult(
                    this.baseUrl, dishPriceWeekNumber.dishDescription,
                    dishPriceWeekNumber.priceSEK, indexNumber, label, weekDayJavascriptDayIndex,
                    this.weekNumberExpected, this.weekYear, null);

        } catch ( e ) {
            webMealResult =
                new WebMealResult( this.baseUrl, "", "", indexNumber, label,
                    weekDayJavascriptDayIndex, this.weekNumberExpected, this.weekYear, e);
        }

        return webMealResult;
    }

    private getSwedishWeekDayNameOnRestaurangKP( weekDayJavascriptDayIndex: WeekDayIndex ): string {
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

    private getSwedishMonthNameOnRestaurangKP( monthIndex: number ): string {
        let month = "";

        switch ( monthIndex ) {
            case 0:
                month = "januari";
                break;
            case 1:
                month = "februari";
                break;
            case 2:
                month = "mars";
                break;
            case 3:
                month = "april";
                break;
            case 4:
                month = "maj";
                break;
            case 5:
                month = "juni";
                break;
            case 6:
                month = "juli";
                break;
            case 7:
                month = "augusti";
                break;
            case 8:
                month = "september";
                break;
            case 9:
                month = "oktober";
                break;
            case 10:
                month = "november";
                break;
            case 11:
                month = "december";
                break;
            default :
                throw new Error(`monthIndex = ${monthIndex} is not a valid index for a month!`);
                break;
        }
        return month;
    }

    private getDayNameDateMonthNameOnRestaurangKP(
        javascriptDayIndex: WeekDayIndex,  weekYear: string, weekIndex: string ): string {

        const epochHelper = new EpochHelper();
        const swedishWeekDayName = this.getSwedishWeekDayNameOnRestaurangKP( javascriptDayIndex );
        const date = epochHelper.getDate( javascriptDayIndex, parseInt( weekIndex, 10 ), parseInt( weekYear, 10 ) );
        const monthName = this.getSwedishMonthNameOnRestaurangKP( date.getMonth() );

        const dayNameDateMonthName = `${swedishWeekDayName} ${date.getDate().toString()} ${monthName}`;

        return dayNameDateMonthName;
    }

    private getXpathDishLabelIndex( label: LabelName, indexNumber: IndexNumber ): string {

        let labelIndex = -1;

        switch (label) {

            case LabelName.MEAL_OF_THE_DAY:
                switch (indexNumber) {
                    case IndexNumber.ONE:
                        labelIndex = 1;
                        break;
                    case IndexNumber.TWO:
                        labelIndex = 2;
                        break;
                    default:
                        throw Error(`Bad indexNumber = ${indexNumber} for label ${label}`);
                }
                break;

            case LabelName.VEGETARIAN:
                switch (indexNumber) {
                    case IndexNumber.ONE:
                        labelIndex = 3;
                        break;
                    default:
                        throw Error(`Bad indexNumber = ${indexNumber} for label ${label}`);
                }
                break;

            default:
                throw Error(`Bad label ${label}`);
        }

        return labelIndex.toString();
    }

    private async getDishPriceWeekNumber(
        dayDateMonth: string, xpathDishLabelIndex: string): Promise<DishPriceWeekNumber> {

        let dishDescription: string;
        let priceSEK: string;
        let weekIndexWeekNumber: string;
        let fetchError: Error;

        let dishPriceWeekNumber: DishPriceWeekNumber = null;

        const xpath = this.xpathProvider(dayDateMonth, xpathDishLabelIndex);

        try {
            dishDescription =
                await this.dealerData.textContentFromHtmlDocument( xpath.descriptionXPath );

            priceSEK =
                ( await this.dealerData.textContentFromHtmlDocument( xpath.price_SEKXPath ))
                .match(/\d+(?=\s?:-)/)[0];

            weekIndexWeekNumber = null;

        } catch ( error ) {
            fetchError = error;
        }

        dishPriceWeekNumber = new DishPriceWeekNumber(dishDescription, priceSEK, weekIndexWeekNumber, fetchError );

        return dishPriceWeekNumber;
    }

    private xpathProvider(dayDateMonth: string, xpathDishLabelIndex: string): IXPathDishProviderResult {

        const result: IXPathDishProviderResult = {
            descriptionXPath: `//table[contains(@class,'lunch_menu')]/thead[//h3[contains(.,'${dayDateMonth}')]][1]/following-sibling::tbody[1]/tr[${xpathDishLabelIndex}]/td[contains(@class,'td_title')]/text()`,
            labelXPath: null,
            price_SEKXPath: `//div[contains(@class,'above_info')][contains(.,'Lunchbuff')][contains(.,':-')]/text()`,
            weekNumberXPath: null,
        };

        return result;
    }

};
