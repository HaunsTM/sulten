import { AlternativeIndex } from "../../enum/AlternativeIndex";
import { LabelName } from "../../enum/LabelName";
import { WeekDayJavascriptDayIndex } from "../../enum/WeekDayJavascriptDayIndex";
import { IHtmlFetcherHelper } from "../../interfaces/IHtmlFetcherHelper";
import { IWebMealDealer } from "../../interfaces/IWebMealDealer";
import { IWebMealResult } from "../../interfaces/IWebMealResult";
import { IXPathDishProviderResult } from "../../interfaces/IXpathDishProviderResult";
import { DishPriceWeekNumber } from "./DishPriceWeekNumber";
import { WebMealResult } from "./WebMealResult";

export class MiamariasDealer implements IWebMealDealer {

    private _htmlFetcherHelper: IHtmlFetcherHelper = null;
    private _weekYear: string = "";
    private _weekNumberExpected: string = "";

    constructor(
        htmlFetcherHelper: IHtmlFetcherHelper,
        weekYear: string,
        weekNumberExpected: string) {

        this._htmlFetcherHelper = htmlFetcherHelper;
        this._weekYear = weekYear;
        this._weekNumberExpected = weekNumberExpected;
    }

    get initialBaseMenuUrl(): string {
        return this._htmlFetcherHelper.initialBaseMenuUrl;
    }

    get actualRestaurantMenuUrl(): string {
        return this._htmlFetcherHelper.actualRestaurantMenuUrl;
    }

    public async mealsFromWeb(): Promise<IWebMealResult[]> {

        const mealsForAWeekPromise =  this.getWebMealResultAForAWeek( );
        const mealsForAWeek = await Promise.all(mealsForAWeekPromise);

        return mealsForAWeek;
    }

    private getWebMealResultAForAWeek( ): Array<Promise<IWebMealResult>> {

        const mealsForAWeek: Array<Promise<IWebMealResult>>  = [
            this.webMealResult( WeekDayJavascriptDayIndex.MONDAY,
                LabelName.FISH_AND_SEAFOOD, AlternativeIndex.ONE),
            this.webMealResult( WeekDayJavascriptDayIndex.MONDAY,
                LabelName.MEAT, AlternativeIndex.ONE),
            this.webMealResult( WeekDayJavascriptDayIndex.MONDAY,
                LabelName.VEGETARIAN, AlternativeIndex.ONE),

            this.webMealResult( WeekDayJavascriptDayIndex.TUESDAY,
                LabelName.FISH_AND_SEAFOOD, AlternativeIndex.ONE),
            this.webMealResult( WeekDayJavascriptDayIndex.TUESDAY,
                LabelName.MEAT, AlternativeIndex.ONE),
            this.webMealResult( WeekDayJavascriptDayIndex.TUESDAY,
                LabelName.VEGETARIAN, AlternativeIndex.ONE),

            this.webMealResult( WeekDayJavascriptDayIndex.WEDNESDAY,
                LabelName.FISH_AND_SEAFOOD, AlternativeIndex.ONE),
            this.webMealResult( WeekDayJavascriptDayIndex.WEDNESDAY,
                LabelName.MEAT, AlternativeIndex.ONE),
            this.webMealResult( WeekDayJavascriptDayIndex.WEDNESDAY,
                LabelName.VEGETARIAN, AlternativeIndex.ONE),

            this.webMealResult( WeekDayJavascriptDayIndex.THURSDAY,
                LabelName.FISH_AND_SEAFOOD, AlternativeIndex.ONE),
            this.webMealResult( WeekDayJavascriptDayIndex.THURSDAY,
                LabelName.MEAT, AlternativeIndex.ONE),
            this.webMealResult( WeekDayJavascriptDayIndex.THURSDAY,
                LabelName.VEGETARIAN, AlternativeIndex.ONE),

            this.webMealResult( WeekDayJavascriptDayIndex.FRIDAY,
                LabelName.FISH_AND_SEAFOOD, AlternativeIndex.ONE),
            this.webMealResult( WeekDayJavascriptDayIndex.FRIDAY,
                LabelName.MEAT, AlternativeIndex.ONE),
            this.webMealResult( WeekDayJavascriptDayIndex.FRIDAY,
                LabelName.VEGETARIAN, AlternativeIndex.ONE),
        ];

        return mealsForAWeek;
    }

    private async webMealResult( weekDayJavascriptDayIndex: WeekDayJavascriptDayIndex,
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

            if ( this._weekNumberExpected !== dishPriceWeekNumber.weekIndexWeekNumber) {
                throw new Error(`Expected to see menu for week ${this._weekNumberExpected}, but found week ${ dishPriceWeekNumber.weekIndexWeekNumber}`);
            }

            webMealResult =
                new WebMealResult(
                    this.initialBaseMenuUrl, dishPriceWeekNumber.dishDescription,
                    dishPriceWeekNumber.priceSEK, alternativeIndex, label, weekDayJavascriptDayIndex,
                    dishPriceWeekNumber.weekIndexWeekNumber, this._weekYear, null);

        } catch ( e ) {
            webMealResult =
                new WebMealResult( this.initialBaseMenuUrl, "", "", alternativeIndex, label,
                    weekDayJavascriptDayIndex, this._weekNumberExpected, this._weekYear, e);
        }

        return webMealResult;

    }

    private getSwedishWeekDayNameOnMiaMarias( weekDay: WeekDayJavascriptDayIndex ): string {
        let swedishWeekDayName = "";

        switch ( weekDay ) {
            case WeekDayJavascriptDayIndex.MONDAY :
                swedishWeekDayName = "Måndag";
                break;
            case WeekDayJavascriptDayIndex.TUESDAY :
                swedishWeekDayName = "Tisdag";
                break;
            case WeekDayJavascriptDayIndex.WEDNESDAY :
                swedishWeekDayName = "Onsdag";
                break;
            case WeekDayJavascriptDayIndex.THURSDAY :
                swedishWeekDayName = "Torsdag";
                break;
            case WeekDayJavascriptDayIndex.FRIDAY :
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
                await this._htmlFetcherHelper.textContentFromHtmlDocument( xpath.descriptionXPath);

            priceSEK =
                ( await this._htmlFetcherHelper.textContentFromHtmlDocument( xpath.price_SEKXPath ))
                .match(/\d+(?=\s?kr)/)[0];

            weekIndexWeekNumber =
                ( await this._htmlFetcherHelper.textContentFromHtmlDocument( xpath.weekNumberXPath ))
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
            price_SEKXPath: `//h5[contains(.,'${swedishWeekDayName}')]/ancestor::div[contains(@class,"et_pb_module")]//tr[td[contains(.,'${swedishDishLabelOnMiaMarias}')][contains(.,"kr")]]`,
            weekNumberXPath: `//strong/span/text()[contains(.,'Vecka ')]`,
        };

        return result;
    }

}
