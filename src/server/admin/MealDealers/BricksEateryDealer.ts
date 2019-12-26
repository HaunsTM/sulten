import { AlternativeIndex } from "../../enum/AlternativeIndex";
import { FetcherType } from "../../enum/FetcherType";
import { LabelName } from "../../enum/LabelName";
import { WeekDayIndex } from "../../enum/WeekDayIndex";
import { IHtmlDocumentParser } from "../../interfaces/IHtmlDocumentParser";
import { IWebMealDealerStatic } from "../../interfaces/IWebMealDealerStatic";
import { IWebMealResult } from "../../interfaces/IWebMealResult";
import { IXPathDishProviderResult } from "../../interfaces/IXpathDishProviderResult";
import { DishPriceWeekNumber } from "./DishPriceWeekNumber";
import { WebMealResult } from "./WebMealResult";

export const BricksEateryDealer: IWebMealDealerStatic =  class BricksEateryDealer {

    public static get baseUrlStatic(): string {
        const baseUrl = "https://brickseatery.se/lunch/";
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
            this.webMealResult( WeekDayIndex.MONDAY, LabelName.MEAL_OF_THE_DAY, AlternativeIndex.ONE),
            this.webMealResult( WeekDayIndex.MONDAY, LabelName.MEAL_OF_THE_DAY, AlternativeIndex.TWO),
            this.webMealResult( WeekDayIndex.MONDAY, LabelName.VEGETARIAN, AlternativeIndex.ONE),

            this.webMealResult( WeekDayIndex.TUESDAY, LabelName.MEAL_OF_THE_DAY, AlternativeIndex.ONE),
            this.webMealResult( WeekDayIndex.TUESDAY, LabelName.MEAL_OF_THE_DAY, AlternativeIndex.TWO),
            this.webMealResult( WeekDayIndex.TUESDAY, LabelName.VEGETARIAN, AlternativeIndex.ONE),

            this.webMealResult( WeekDayIndex.WEDNESDAY, LabelName.MEAL_OF_THE_DAY, AlternativeIndex.ONE),
            this.webMealResult( WeekDayIndex.WEDNESDAY, LabelName.MEAL_OF_THE_DAY, AlternativeIndex.TWO),
            this.webMealResult( WeekDayIndex.WEDNESDAY, LabelName.VEGETARIAN, AlternativeIndex.ONE),

            this.webMealResult( WeekDayIndex.THURSDAY, LabelName.MEAL_OF_THE_DAY, AlternativeIndex.ONE),
            this.webMealResult( WeekDayIndex.THURSDAY, LabelName.MEAL_OF_THE_DAY, AlternativeIndex.TWO),
            this.webMealResult( WeekDayIndex.THURSDAY, LabelName.VEGETARIAN, AlternativeIndex.ONE),

            this.webMealResult( WeekDayIndex.FRIDAY, LabelName.MEAL_OF_THE_DAY, AlternativeIndex.ONE),
            this.webMealResult( WeekDayIndex.FRIDAY, LabelName.MEAL_OF_THE_DAY, AlternativeIndex.TWO),
            this.webMealResult( WeekDayIndex.FRIDAY, LabelName.VEGETARIAN, AlternativeIndex.ONE),
        ];

        return mealsForAWeek;
    }

    private async webMealResult( weekDayJavascriptDayIndex: WeekDayIndex,
                                 label: LabelName, alternativeIndex: AlternativeIndex): Promise<IWebMealResult> {

        let dishPriceWeekNumber: DishPriceWeekNumber = null;
        let webMealResult: WebMealResult = null;

        const swedishDishLabelOnMiaMarias = this.getDishLabelOnBricksEatery( label, alternativeIndex );
        const swedishWeekDayName = this.getSwedishWeekDayNameOnBricksEatery( weekDayJavascriptDayIndex );

        try {
            dishPriceWeekNumber =
                await this.getDishPriceWeekNumber( swedishWeekDayName, swedishDishLabelOnMiaMarias );

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

    private getSwedishWeekDayNameOnBricksEatery( weekDay: WeekDayIndex ): string {
        let swedishWeekDayName = "";

        switch ( weekDay ) {
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

    private getDishLabelOnBricksEatery( label: LabelName, alternativeIndex: AlternativeIndex ): string {
        let dishLabel = "";

        switch ( label ) {
            case LabelName.MEAL_OF_THE_DAY:
                dishLabel = alternativeIndex === AlternativeIndex.ONE ? "Local" : "Worldwide";
                break;
            case LabelName.VEGETARIAN:
                dishLabel = "Green";
                break;
        }

        return dishLabel;
    }

    private async getDishPriceWeekNumber(
        swedishWeekDayName: string,
        dishLabel: string ): Promise<DishPriceWeekNumber> {

        let dishDescription: string;
        let priceSEK: string;
        let weekIndexWeekNumber: string;
        let fetchError: Error;

        let dishPriceWeekNumber: DishPriceWeekNumber = null;

        const xpath = this.xpathProvider( swedishWeekDayName, dishLabel );

        try {
            dishDescription =
                await this.dealerData.textContentFromHtmlDocument( xpath.descriptionXPath);

            priceSEK =
                ( await this.dealerData.textContentFromHtmlDocument( xpath.price_SEKXPath ))
                .match(/\d+(?=\s?:-)/)[0];

            weekIndexWeekNumber =
                ( await this.dealerData.textContentFromHtmlDocument( xpath.weekNumberXPath ))
                .match(/\d+/)[0];
        } catch ( error ) {
            fetchError = error;
        }

        dishPriceWeekNumber = new DishPriceWeekNumber(dishDescription, priceSEK, weekIndexWeekNumber, fetchError );

        return dishPriceWeekNumber;

    }

    private xpathProvider( swedishWeekDayName: string, dishLabel: string): IXPathDishProviderResult {

        const result: IXPathDishProviderResult = {
            descriptionXPath: `//h3[contains(.,'${swedishWeekDayName}')]/following-sibling::table[1]//tr[td[contains(.,'${dishLabel}')]]/td[2]/text()[1]`,
            price_SEKXPath: `//h3[contains(.,'${swedishWeekDayName}')]/following-sibling::table[1]//tr[td[contains(.,'${dishLabel}')]]/td[3]/text()`,
            weekNumberXPath: `//div[contains(@class,'lunch')]/h2[contains(.,'Vecka')]`,
        };

        return result;
    }

};