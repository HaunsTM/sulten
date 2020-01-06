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

export const BistroALundCentralhallenDealer: IWebMealDealerStatic =  class BistroALundCentralhallenLocal {

    public static get baseUrlStatic(): string {
        const baseUrl = "https://www.fazer.se/restauranger-cafeer-och-maltidstjanster/menyer/bistro-a-lund?restaurant=centralhallen";
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
            this.webMealResult( WeekDayIndex.MONDAY, LabelName.SALAD, IndexNumber.ONE),

            this.webMealResult( WeekDayIndex.TUESDAY, LabelName.MEAL_OF_THE_DAY, IndexNumber.ONE),
            this.webMealResult( WeekDayIndex.TUESDAY, LabelName.SALAD, IndexNumber.ONE),

            this.webMealResult( WeekDayIndex.WEDNESDAY, LabelName.MEAL_OF_THE_DAY, IndexNumber.ONE),
            this.webMealResult( WeekDayIndex.WEDNESDAY, LabelName.SALAD, IndexNumber.ONE),

            this.webMealResult( WeekDayIndex.THURSDAY, LabelName.MEAL_OF_THE_DAY, IndexNumber.ONE),
            this.webMealResult( WeekDayIndex.THURSDAY, LabelName.SALAD, IndexNumber.ONE),

            this.webMealResult( WeekDayIndex.FRIDAY, LabelName.MEAL_OF_THE_DAY, IndexNumber.ONE),
            this.webMealResult( WeekDayIndex.FRIDAY, LabelName.SALAD, IndexNumber.ONE),
        ];

        return mealsForAWeek;
    }

    private async webMealResult( weekDayJavascriptDayIndex: WeekDayIndex,
                                 label: LabelName, indexNumber: IndexNumber): Promise<IWebMealResult> {

        let dishPriceWeekNumber: DishPriceWeekNumber = null;
        let webMealResult: WebMealResult = null;

        const swedishWeekDayName = this.getSwedishWeekDayName( weekDayJavascriptDayIndex );
const restaurantIndex = 1;
        try {
            dishPriceWeekNumber =
                await this.getDishPriceWeekNumber( restaurantIndex, this.weekNumberExpected, swedishWeekDayName, label );

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

    private getSwedishWeekDayName( weekDayJavascriptDayIndex: WeekDayIndex ): string {
        let swedishWeekDayName = "";

        switch ( weekDayJavascriptDayIndex ) {
            case WeekDayIndex.MONDAY :
                swedishWeekDayName = "Måndag";
                break;
            case WeekDayIndex.TUESDAY :
                swedishWeekDayName = "Tisdag";
                break;
            case WeekDayIndex.WEDNESDAY :
                swedishWeekDayName = "Onsdag";
                break;
            case WeekDayIndex.THURSDAY :
                swedishWeekDayName = "Torsdag";
                break;
            case WeekDayIndex.FRIDAY :
                swedishWeekDayName = "Fredag";
                break;
        }
        return swedishWeekDayName;
    }

    private async getDishPriceWeekNumber(
        restaurantIndex: number, weekIndex: string,
        swedishWeekDayName: string, label: LabelName): Promise<DishPriceWeekNumber> {

        let dishDescription: string;
        let priceSEK: string;
        let weekIndexWeekNumber: string;
        let fetchError: Error;

        let dishPriceWeekNumber: DishPriceWeekNumber = null;

        const xpath = this.xpathProvider(restaurantIndex, weekIndex, swedishWeekDayName, label);

        try {
            dishDescription =
                await this.dealerData.textContentFromHtmlDocument( xpath.descriptionXPath );

            priceSEK =
                ( await this.dealerData.textContentFromHtmlDocument( xpath.price_SEKXPath ))
                .match(/\d+(?=\s?kr)/)[0];

            weekIndexWeekNumber =
                ( await this.dealerData.textContentFromHtmlDocument( xpath.weekNumberXPath ) )
                .match(/(?<=\s*Vecka\s*)\d+/)[0];

        } catch ( error ) {
            fetchError = error;
        }

        dishPriceWeekNumber = new DishPriceWeekNumber(dishDescription, priceSEK, weekIndexWeekNumber, fetchError );

        return dishPriceWeekNumber;
    }

    private xpathProvider(
        restaurantIndex: number, weekIndex: string,
        swedishWeekDayName: string, label: LabelName): IXPathDishProviderResult {

        let labelXPath: string = null;
        let baseXPath: string = `//div[contains(@class, 'lunch-menu')][p[contains(.,'ecka ${weekIndex}')]]`;
        let descriptionXPath: string = "";
        let price_SEKXPath: string = "";
        let weekNumberXPath: string = "";

        switch ( label ) {
            case LabelName.MEAL_OF_THE_DAY:
                price_SEKXPath = baseXPath + "//text()[contains(.,'agens varmrätt')][contains(.,' kr')]";
                break;
            case LabelName.SALAD:
                price_SEKXPath = baseXPath + "//text()[contains(.,'eckans sallad')][contains(.,' kr')]";
                break;
        }

        switch ( restaurantIndex ) {

            case 1:
                weekNumberXPath = baseXPath + `/p[contains(.,'ecka ${weekIndex}')][1]/strong/text()`;
                switch ( label ) {
                    case LabelName.MEAL_OF_THE_DAY:
                        descriptionXPath = baseXPath + `/p[contains(.,'ecka ${weekIndex}')][1]/following-sibling::p[contains(.,'${swedishWeekDayName}')][1]/following-sibling::p[1]//text()`;
                        break;
                    case LabelName.SALAD:
                        descriptionXPath = baseXPath + "//text()[contains(.,'eckans sallad')][contains(.,' kr')]";
                        break;
                }
                break;
            case 2:
                weekNumberXPath = baseXPath + `/p[contains(.,'EB-blocket')]/following-sibling::p[contains(.,'ecka ${weekIndex}')]//text()`;
                descriptionXPath = baseXPath + `/p[contains(.,'EB-blocket')]/following-sibling::p[contains(.,'${swedishWeekDayName}')][1]//text()`;
                break;

        }

        const result: IXPathDishProviderResult = {
            descriptionXPath: descriptionXPath,
            labelXPath: labelXPath,
            price_SEKXPath: price_SEKXPath,
            weekNumberXPath: weekNumberXPath,
        };

        return result;
    }

};
