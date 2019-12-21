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

export const KolgaDealer: IWebMealDealerStatic =  class KolgaDealer {

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

    private getWebMealResultAForAWeek(): Array<Promise<IWebMealResult>> {

        const mealsForAWeek: Array<Promise<IWebMealResult>>  = [
            this.webMealResult( WeekDayJavascriptDayIndex.MONDAY, LabelName.MEAL_OF_THE_DAY, AlternativeIndex.ONE),
            this.webMealResult( WeekDayJavascriptDayIndex.MONDAY, LabelName.MEAL_OF_THE_DAY, AlternativeIndex.TWO),

            this.webMealResult( WeekDayJavascriptDayIndex.TUESDAY, LabelName.MEAL_OF_THE_DAY, AlternativeIndex.ONE),
            this.webMealResult( WeekDayJavascriptDayIndex.TUESDAY, LabelName.MEAL_OF_THE_DAY, AlternativeIndex.TWO),

            this.webMealResult( WeekDayJavascriptDayIndex.WEDNESDAY, LabelName.MEAL_OF_THE_DAY, AlternativeIndex.ONE),
            this.webMealResult( WeekDayJavascriptDayIndex.WEDNESDAY, LabelName.MEAL_OF_THE_DAY, AlternativeIndex.TWO),

            this.webMealResult( WeekDayJavascriptDayIndex.THURSDAY, LabelName.MEAL_OF_THE_DAY, AlternativeIndex.ONE),
            this.webMealResult( WeekDayJavascriptDayIndex.THURSDAY, LabelName.MEAL_OF_THE_DAY, AlternativeIndex.TWO),

            this.webMealResult( WeekDayJavascriptDayIndex.FRIDAY, LabelName.MEAL_OF_THE_DAY, AlternativeIndex.ONE),
            this.webMealResult( WeekDayJavascriptDayIndex.FRIDAY, LabelName.MEAL_OF_THE_DAY, AlternativeIndex.TWO),
        ];

        return mealsForAWeek;
    }

    private async webMealResult( weekDayJavascriptDayIndex: WeekDayJavascriptDayIndex,
                                 label: LabelName, alternativeIndex: AlternativeIndex): Promise<IWebMealResult> {

        let dishPriceWeekNumber: DishPriceWeekNumber = null;
        let webMealResult: WebMealResult = null;

        const swedishWeekDayNameOnKolga = this.getSwedishWeekDayNameOnKolga( weekDayJavascriptDayIndex );

        try {
            dishPriceWeekNumber =
                await this.getDishPriceWeekNumber( swedishWeekDayNameOnKolga, alternativeIndex );

            if ( dishPriceWeekNumber.fetchError ) {
                throw dishPriceWeekNumber.fetchError;
            }

            if ( this.weekNumberExpected !== dishPriceWeekNumber.weekIndexWeekNumber) {
                throw new Error(`Expected to see menu for week ${this.weekNumberExpected}, but found week ${dishPriceWeekNumber.weekIndexWeekNumber}`);
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

    private getSwedishWeekDayNameOnKolga( weekDayJavascriptDayIndex: WeekDayJavascriptDayIndex ): string {
        let swedishWeekDayName = "";

        switch ( weekDayJavascriptDayIndex ) {
            case WeekDayJavascriptDayIndex.MONDAY :
                swedishWeekDayName = "måndag";
                break;
            case WeekDayJavascriptDayIndex.TUESDAY :
                swedishWeekDayName = "tisdag";
                break;
            case WeekDayJavascriptDayIndex.WEDNESDAY :
                swedishWeekDayName = "onsdag";
                break;
            case WeekDayJavascriptDayIndex.THURSDAY :
                swedishWeekDayName = "torsdag";
                break;
            case WeekDayJavascriptDayIndex.FRIDAY :
                swedishWeekDayName = "fredag";
                break;
        }
        return swedishWeekDayName;
    }

    private async getDishPriceWeekNumber(  weekDayName: string,
                                           menuAlternativeIndex: number): Promise<DishPriceWeekNumber> {

        let dishDescription: string;
        let priceSEK: string;
        let weekIndexWeekNumber: string;
        let fetchError: Error;

        let dishPriceWeekNumber: DishPriceWeekNumber = null;

        const xpath = this.xpathProvider(weekDayName, menuAlternativeIndex);

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

    private xpathProvider(weekDayName: string, alternativeIndex: AlternativeIndex): IXPathDishProviderResult {

        const result: IXPathDishProviderResult = {
            descriptionXPath: `(//table/thead[tr/th/h3[contains(.,'${weekDayName}')]]/following-sibling::tbody[1]//td[@class='td_title'])[${alternativeIndex}]`,
            price_SEKXPath: `(//table/thead[tr/th/h3[contains(.,'${weekDayName}')]]/following-sibling::tbody[1]//td[@class='td_price'])[${alternativeIndex}]`,
            weekNumberXPath: `//a[contains(@class,'btn btn-info dropdown-toggle')]/text()[contains(.,'Vecka ')]`,
        };

        return result;
    }

};
