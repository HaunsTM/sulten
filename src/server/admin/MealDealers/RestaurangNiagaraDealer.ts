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

export const RestaurangNiagaraDealer: IWebMealDealerStatic =  class RestaurangNiagaraDealerLocal {

    public static get baseUrlStatic(): string {
        const baseUrl = "https://restaurangniagara.se/lunch/";
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
            this.webMealResult( WeekDayIndex.MONDAY, LabelName.VEGETARIAN, AlternativeIndex.ONE),
            this.webMealResult( WeekDayIndex.MONDAY, LabelName.ASIAN, AlternativeIndex.ONE),
            this.webMealResult( WeekDayIndex.MONDAY, LabelName.ASIAN, AlternativeIndex.TWO),
            this.webMealResult( WeekDayIndex.MONDAY, LabelName.SALAD, AlternativeIndex.ONE),
            this.webMealResult( WeekDayIndex.MONDAY, LabelName.SOUP, AlternativeIndex.ONE),
            this.webMealResult( WeekDayIndex.MONDAY, LabelName.COFFEE, AlternativeIndex.ONE),

            this.webMealResult( WeekDayIndex.TUESDAY, LabelName.MEAL_OF_THE_DAY, AlternativeIndex.ONE),
            this.webMealResult( WeekDayIndex.TUESDAY, LabelName.VEGETARIAN, AlternativeIndex.ONE),
            this.webMealResult( WeekDayIndex.TUESDAY, LabelName.ASIAN, AlternativeIndex.ONE),
            this.webMealResult( WeekDayIndex.TUESDAY, LabelName.ASIAN, AlternativeIndex.TWO),
            this.webMealResult( WeekDayIndex.TUESDAY, LabelName.SALAD, AlternativeIndex.ONE),
            this.webMealResult( WeekDayIndex.TUESDAY, LabelName.SOUP, AlternativeIndex.ONE),
            this.webMealResult( WeekDayIndex.TUESDAY, LabelName.COFFEE, AlternativeIndex.ONE),

            this.webMealResult( WeekDayIndex.WEDNESDAY, LabelName.MEAL_OF_THE_DAY, AlternativeIndex.ONE),
            this.webMealResult( WeekDayIndex.WEDNESDAY, LabelName.VEGETARIAN, AlternativeIndex.ONE),
            this.webMealResult( WeekDayIndex.WEDNESDAY, LabelName.ASIAN, AlternativeIndex.ONE),
            this.webMealResult( WeekDayIndex.WEDNESDAY, LabelName.ASIAN, AlternativeIndex.TWO),
            this.webMealResult( WeekDayIndex.WEDNESDAY, LabelName.SALAD, AlternativeIndex.ONE),
            this.webMealResult( WeekDayIndex.WEDNESDAY, LabelName.SOUP, AlternativeIndex.ONE),
            this.webMealResult( WeekDayIndex.WEDNESDAY, LabelName.COFFEE, AlternativeIndex.ONE),

            this.webMealResult( WeekDayIndex.THURSDAY, LabelName.MEAL_OF_THE_DAY, AlternativeIndex.ONE),
            this.webMealResult( WeekDayIndex.THURSDAY, LabelName.VEGETARIAN, AlternativeIndex.ONE),
            this.webMealResult( WeekDayIndex.THURSDAY, LabelName.ASIAN, AlternativeIndex.ONE),
            this.webMealResult( WeekDayIndex.THURSDAY, LabelName.ASIAN, AlternativeIndex.TWO),
            this.webMealResult( WeekDayIndex.THURSDAY, LabelName.SALAD, AlternativeIndex.ONE),
            this.webMealResult( WeekDayIndex.THURSDAY, LabelName.SOUP, AlternativeIndex.ONE),
            this.webMealResult( WeekDayIndex.THURSDAY, LabelName.COFFEE, AlternativeIndex.ONE),

            this.webMealResult( WeekDayIndex.FRIDAY, LabelName.MEAL_OF_THE_DAY, AlternativeIndex.ONE),
            this.webMealResult( WeekDayIndex.FRIDAY, LabelName.VEGETARIAN, AlternativeIndex.ONE),
            this.webMealResult( WeekDayIndex.FRIDAY, LabelName.ASIAN, AlternativeIndex.ONE),
            this.webMealResult( WeekDayIndex.FRIDAY, LabelName.ASIAN, AlternativeIndex.TWO),
            this.webMealResult( WeekDayIndex.FRIDAY, LabelName.SALAD, AlternativeIndex.ONE),
            this.webMealResult( WeekDayIndex.FRIDAY, LabelName.SOUP, AlternativeIndex.ONE),
            this.webMealResult( WeekDayIndex.FRIDAY, LabelName.COFFEE, AlternativeIndex.ONE),
        ];

        return mealsForAWeek;
    }

    private async webMealResult( weekDayJavascriptDayIndex: WeekDayIndex,
                                 label: LabelName, alternativeIndex: AlternativeIndex): Promise<IWebMealResult> {

        let dishPriceWeekNumber: DishPriceWeekNumber = null;
        let webMealResult: WebMealResult = null;

        const swedishDishLabel = this.getDishLabelOnBricksEatery( label, alternativeIndex );
        const swedishWeekDayName = this.getSwedishWeekDayNameOnRestaurangNiagara( weekDayJavascriptDayIndex );

        try {
            dishPriceWeekNumber =
                await this.getDishPriceWeekNumber( swedishWeekDayName, swedishDishLabel );

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

    private getSwedishWeekDayNameOnRestaurangNiagara( weekDay: WeekDayIndex ): string {
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
                dishLabel = "Local";
                break;
            case LabelName.VEGETARIAN:
                dishLabel = "Green";
                break;
            case LabelName.ASIAN:

                switch ( alternativeIndex ) {

                    case AlternativeIndex.ONE:
                        dishLabel = "Asia Ichi";
                        break;
                    case AlternativeIndex.TWO:
                        dishLabel = "Asia Yee";
                        break;
                }
                break;
            case LabelName.SALAD:
                dishLabel = "Salad";
                break;
            case LabelName.SOUP:
                dishLabel = "Soup";
                break;
            case LabelName.COFFEE:
                dishLabel = "Övrigt";
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

    private caseInsensitiveXpathContains(text: string) {
        const caseInsensitiveXpathContains = `contains(
            translate(., 'ABCDEFGHIJKLMNOPQRSTUÜVWXYZÅÄÖ', 'abcdefghijklmnopqrstuüvwxyzåäö'),
            '${text}'
          )`;
        return caseInsensitiveXpathContains;
    }
    private xpathProvider( swedishWeekDayName: string, dishLabel: string): IXPathDishProviderResult {

        const result: IXPathDishProviderResult = {
            descriptionXPath:
                `//h3[contains(.,'${swedishWeekDayName}')]/following-sibling::table[1]//tr[td[${this.caseInsensitiveXpathContains(dishLabel.toLowerCase())}]]/td[2]/text()`,
            price_SEKXPath:
                `//h3[contains(.,'${swedishWeekDayName}')]/following-sibling::table[1]//tr[td[${this.caseInsensitiveXpathContains(dishLabel.toLowerCase())}]]/td[3]/text()`,
            weekNumberXPath: `//div[contains(@class,'lunch')]/h2[contains(.,'Vecka')]`,
        };

        return result;
    }

};
