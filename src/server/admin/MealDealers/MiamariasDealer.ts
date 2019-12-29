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

export const MiamariasDealer: IWebMealDealerStatic =  class MiamariasDealerLocal {

    public static get baseUrlStatic(): string {
        const baseUrl = "http://www.miamarias.nu/";
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
            this.webMealResult( WeekDayIndex.MONDAY, LabelName.FISH_AND_SEAFOOD, AlternativeIndex.ONE),
            this.webMealResult( WeekDayIndex.MONDAY, LabelName.MEAT, AlternativeIndex.ONE),
            this.webMealResult( WeekDayIndex.MONDAY, LabelName.VEGETARIAN, AlternativeIndex.ONE),

            this.webMealResult( WeekDayIndex.TUESDAY, LabelName.FISH_AND_SEAFOOD, AlternativeIndex.ONE),
            this.webMealResult( WeekDayIndex.TUESDAY, LabelName.MEAT, AlternativeIndex.ONE),
            this.webMealResult( WeekDayIndex.TUESDAY, LabelName.VEGETARIAN, AlternativeIndex.ONE),

            this.webMealResult( WeekDayIndex.WEDNESDAY, LabelName.FISH_AND_SEAFOOD, AlternativeIndex.ONE),
            this.webMealResult( WeekDayIndex.WEDNESDAY, LabelName.MEAT, AlternativeIndex.ONE),
            this.webMealResult( WeekDayIndex.WEDNESDAY, LabelName.VEGETARIAN, AlternativeIndex.ONE),

            this.webMealResult( WeekDayIndex.THURSDAY, LabelName.FISH_AND_SEAFOOD, AlternativeIndex.ONE),
            this.webMealResult( WeekDayIndex.THURSDAY, LabelName.MEAT, AlternativeIndex.ONE),
            this.webMealResult( WeekDayIndex.THURSDAY, LabelName.VEGETARIAN, AlternativeIndex.ONE),

            this.webMealResult( WeekDayIndex.FRIDAY, LabelName.FISH_AND_SEAFOOD, AlternativeIndex.ONE),
            this.webMealResult( WeekDayIndex.FRIDAY, LabelName.MEAT, AlternativeIndex.ONE),
            this.webMealResult( WeekDayIndex.FRIDAY, LabelName.VEGETARIAN, AlternativeIndex.ONE),
        ];

        return mealsForAWeek;
    }

    private async webMealResult( weekDayJavascriptDayIndex: WeekDayIndex,
                                 label: LabelName, alternativeIndex: AlternativeIndex): Promise<IWebMealResult> {

        let dishPriceWeekNumber: DishPriceWeekNumber = null;
        let webMealResult: WebMealResult = null;

        const swedishDishLabelOnMiaMarias = this.getSwedishDishLabelOnMiaMarias( label );
        const swedishWeekDayName = this.getSwedishWeekDayNameOnMiaMarias( weekDayJavascriptDayIndex );

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

    private getSwedishWeekDayNameOnMiaMarias( weekDay: WeekDayIndex ): string {
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

    private getSwedishDishLabelOnMiaMarias( label: LabelName ): string {
        let swedishDishLabel = "";

        switch ( label ) {
            case LabelName.FISH_AND_SEAFOOD:
                swedishDishLabel = "Fisk";
                break;
            case LabelName.MEAT:
                swedishDishLabel = "Kött";
                break;
            case LabelName.VEGETARIAN:
                swedishDishLabel = "Vegetarisk";
                break;
        }

        return swedishDishLabel;
    }

    private async getDishPriceWeekNumber(
        swedishWeekDayName: string,
        swedishDishLabelOnMiaMarias: string ): Promise<DishPriceWeekNumber> {

        let dishDescription: string;
        let priceSEK: string;
        let weekIndexWeekNumber: string;
        let fetchError: Error;

        let dishPriceWeekNumber: DishPriceWeekNumber = null;

        const xpath = this.xpathProvider( swedishWeekDayName, swedishDishLabelOnMiaMarias );

        try {
            dishDescription =
                await this.dealerData.textContentFromHtmlDocument( xpath.descriptionXPath);

            priceSEK =
                ( await this.dealerData.textContentFromHtmlDocument( xpath.price_SEKXPath ))
                .match(/\d+(?=\s?kr)/)[0];

            weekIndexWeekNumber =
                ( await this.dealerData.textContentFromHtmlDocument( xpath.weekNumberXPath ))
                .match(/(?<=\s*Vecka\s*)\d+/)[0];
        } catch ( error ) {
            fetchError = error;
        }

        dishPriceWeekNumber = new DishPriceWeekNumber(dishDescription, priceSEK, weekIndexWeekNumber, fetchError );

        return dishPriceWeekNumber;

    }

    private xpathProvider( swedishWeekDayName: string, swedishDishLabelOnMiaMarias: string): IXPathDishProviderResult {

        const result: IXPathDishProviderResult = {
            descriptionXPath: `//h5[contains(.,'${swedishWeekDayName}')]/ancestor::div[contains(@class,"et_pb_module")]//tr[td[contains(.,'${swedishDishLabelOnMiaMarias}')][contains(.,"kr")]]/following-sibling::tr`,
            labelXPath: null,
            price_SEKXPath: `//h5[contains(.,'${swedishWeekDayName}')]/ancestor::div[contains(@class,"et_pb_module")]//tr[td[contains(.,'${swedishDishLabelOnMiaMarias}')][contains(.,"kr")]]`,
            weekNumberXPath: `//strong/span/text()[contains(.,'Vecka ')]`,
        };

        return result;
    }

};
