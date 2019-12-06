import { LabelName } from "../../enum/LabelName";
import { WeekDayJavascriptDayIndex } from "../../enum/WeekDayJavascriptDayIndex";
import { IPdfFetcherHelper } from "../../interfaces/IPdfFetcherHelper";
import { IWebMealDealer } from "../../interfaces/IWebMealDealer";
import { IWebMealResult } from "../../interfaces/IWebMealResult";
import { IRegexDishProviderResult } from "../../interfaces/IRegexDishProviderResult";
import { DishPriceWeekNumber } from "./DishPriceWeekNumber";
import { WebMealResult } from "./WebMealResult";
import { resolve } from "dns";

export class RestaurangVariationDealer implements IWebMealDealer {


    private _pdfFetcherHelper: IPdfFetcherHelper = null;
    private _weekYear: string = "";
    private _weekNumberExpected: string = "";

    constructor(
        pdfFetcherHelper: IPdfFetcherHelper,
        weekYear: string,
        weekNumberExpected: string) {

        this._pdfFetcherHelper = pdfFetcherHelper;
        this._weekYear = weekYear;
        this._weekNumberExpected = weekNumberExpected;

        this.initialize();
    }

    get initialBaseMenuUrl(): string {
        return this._pdfFetcherHelper.initialBaseMenuUrl;
    }

    get actualRestaurantMenuUrl(): string {
        return this._pdfFetcherHelper.actualRestaurantMenuUrl;
    }

    public async mealsFromWeb(): Promise<IWebMealResult[]> {

        const pdfDocumentFromWeb = await this._pdfFetcherHelper.pdfDocumentFromWeb();
        const textContentFromPdfDocument =
            await this._pdfFetcherHelper.textContentFromPdfDocument(pdfDocumentFromWeb, 1);

        const mealsForAWeekPromise =  this.getWebMealResultAForAWeek( textContentFromPdfDocument );
        const mealsForAWeek = await Promise.all(mealsForAWeekPromise);

        return mealsForAWeek;
    }

    private updateCurrentHtmlFetcherHelperUrl() {

        const updatedHtmlFetcherHelperUrl =
            this._pdfFetcherHelper.initialBaseMenuUrl + `${this._weekYear}/v-${this._weekNumberExpected}-rest.pdf`;

        this._pdfFetcherHelper.actualRestaurantMenuUrl = updatedHtmlFetcherHelperUrl;
    }

    private initialize(): void {
        this.updateCurrentHtmlFetcherHelperUrl();
    }

    private getSwedishWeekDayNameOnVariation( weekDayJavascriptDayIndex: WeekDayJavascriptDayIndex ): string {
        let swedishWeekDayName = "";

        switch ( weekDayJavascriptDayIndex ) {
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

    private getWebMealResultAForAWeek( textContentFromPdfDocument: string ): Array<Promise<IWebMealResult>> {

        const mealsForAWeek: Array<Promise<IWebMealResult>>  = [
            this.webMealResult( textContentFromPdfDocument, WeekDayJavascriptDayIndex.MONDAY, LabelName.MEAL_OF_THE_DAY, 0),
            this.webMealResult( textContentFromPdfDocument, WeekDayJavascriptDayIndex.MONDAY, LabelName.MEAL_OF_THE_DAY, 1),
            this.webMealResult( textContentFromPdfDocument, WeekDayJavascriptDayIndex.MONDAY, LabelName.VEGETARIAN, 2),
            this.webMealResult( textContentFromPdfDocument, WeekDayJavascriptDayIndex.MONDAY, LabelName.SALAD, 3),


            this.webMealResult( textContentFromPdfDocument, WeekDayJavascriptDayIndex.TUESDAY, LabelName.MEAL_OF_THE_DAY, 0),
            this.webMealResult( textContentFromPdfDocument, WeekDayJavascriptDayIndex.TUESDAY, LabelName.MEAL_OF_THE_DAY, 1),
            this.webMealResult( textContentFromPdfDocument, WeekDayJavascriptDayIndex.TUESDAY, LabelName.VEGETARIAN, 2),
            this.webMealResult( textContentFromPdfDocument, WeekDayJavascriptDayIndex.TUESDAY, LabelName.SALAD, 3),


            this.webMealResult( textContentFromPdfDocument, WeekDayJavascriptDayIndex.WEDNESDAY, LabelName.MEAL_OF_THE_DAY, 0),
            this.webMealResult( textContentFromPdfDocument, WeekDayJavascriptDayIndex.WEDNESDAY, LabelName.MEAL_OF_THE_DAY, 1),
            this.webMealResult( textContentFromPdfDocument, WeekDayJavascriptDayIndex.WEDNESDAY, LabelName.VEGETARIAN, 2),
            this.webMealResult( textContentFromPdfDocument, WeekDayJavascriptDayIndex.WEDNESDAY, LabelName.SALAD, 3),


            this.webMealResult( textContentFromPdfDocument, WeekDayJavascriptDayIndex.THURSDAY, LabelName.MEAL_OF_THE_DAY, 0),
            this.webMealResult( textContentFromPdfDocument, WeekDayJavascriptDayIndex.THURSDAY, LabelName.MEAL_OF_THE_DAY, 1),
            this.webMealResult( textContentFromPdfDocument, WeekDayJavascriptDayIndex.THURSDAY, LabelName.VEGETARIAN, 2),
            this.webMealResult( textContentFromPdfDocument, WeekDayJavascriptDayIndex.THURSDAY, LabelName.SALAD, 3),

            this.webMealResult( textContentFromPdfDocument, WeekDayJavascriptDayIndex.FRIDAY, LabelName.MEAL_OF_THE_DAY, 0),
            this.webMealResult( textContentFromPdfDocument, WeekDayJavascriptDayIndex.FRIDAY, LabelName.MEAL_OF_THE_DAY, 1),
            this.webMealResult( textContentFromPdfDocument, WeekDayJavascriptDayIndex.FRIDAY, LabelName.VEGETARIAN, 2),
            this.webMealResult( textContentFromPdfDocument, WeekDayJavascriptDayIndex.FRIDAY, LabelName.SALAD, 3),
        ];

        return mealsForAWeek;
    }

    private async webMealResult(
        textContentFromPdfDocument: string, weekDayJavascriptDayIndex: WeekDayJavascriptDayIndex,
        label: LabelName, menuAlternativeIndex: number): Promise<IWebMealResult> {

        let dishPriceWeekNumber: DishPriceWeekNumber = null;
        let webMealResult: WebMealResult = null;

        const swedishWeekDayName = this.getSwedishWeekDayNameOnVariation( weekDayJavascriptDayIndex );

        try {
            dishPriceWeekNumber =
                await this.getDishPriceWeekNumber(
                    textContentFromPdfDocument, swedishWeekDayName, menuAlternativeIndex );

            if ( dishPriceWeekNumber.fetchError ) {
                throw dishPriceWeekNumber.fetchError;
            }

            if ( this._weekNumberExpected !== dishPriceWeekNumber.weekIndexWeekNumber) {
                throw new Error(`Expected to see menu for week ${this._weekNumberExpected}, but found week ${dishPriceWeekNumber.weekIndexWeekNumber}`);
            }

            webMealResult =
                new WebMealResult(
                    this.initialBaseMenuUrl, dishPriceWeekNumber.dishDescription,
                    dishPriceWeekNumber.priceSEK, label, weekDayJavascriptDayIndex,
                    dishPriceWeekNumber.weekIndexWeekNumber, this._weekYear, null);

        } catch ( e ) {
            webMealResult =
                new WebMealResult( this.initialBaseMenuUrl, "", "", label,
                    weekDayJavascriptDayIndex, this._weekNumberExpected, this._weekYear, e);
        }

        return webMealResult;
    }

    private async getDishPriceWeekNumber(
        textContentFromPdfDocument: string, weekDayName: string,
        menuAlternativeIndex: number): Promise<DishPriceWeekNumber> {

        const dishPriceWeekNumberPromise =
            new Promise<DishPriceWeekNumber>( (res, rej) => {

                let dishDescription: string;
                let priceSEK: string;
                let weekIndexWeekNumber: string;

                let dishPriceWeekNumber: DishPriceWeekNumber = null;

                const rP = this.regexProvider(weekDayName, menuAlternativeIndex);

                try {
                    dishDescription = textContentFromPdfDocument.match(rP.descriptionRegex)[menuAlternativeIndex];

                    priceSEK = textContentFromPdfDocument.match(rP.price_SEKRegex)[0];

                    weekIndexWeekNumber = textContentFromPdfDocument.match(rP.descriptionRegex)[0];
                    dishPriceWeekNumber =
                        new DishPriceWeekNumber(dishDescription, priceSEK, weekIndexWeekNumber, null );

                    res(dishPriceWeekNumber);

                } catch ( error ) {
                    dishPriceWeekNumber =
                        new DishPriceWeekNumber(dishDescription, priceSEK, weekIndexWeekNumber, error );
                    rej(dishPriceWeekNumber);
                }
            });

        return dishPriceWeekNumberPromise;
    }

    private regexProvider(weekDayName: string, menuAlternativeIndex: number): IRegexDishProviderResult {

        const result: IRegexDishProviderResult = {
            descriptionRegex: new RegExp(`(?<=${weekDayName} Dagens buffé  )(?:•\\s+([^•]+)[^•]+)(?:•\\s+([^•]+)[^•]+)(?:•\\s+([^•]+)[^•]+)(?:•\\s+([^•]+)[^•]+)`, "gm"),
            price_SEKRegex: menuAlternativeIndex < 3 ? RegExp(`DAGENS BUFFÉ.*?(\\d+)\\skr\\b`, "gm") : RegExp(`SOPPA MED SALLAD.*?(\\d+)\\skr\\b`, "gm"),
            weekNumberRegex: RegExp(`vecka\\s+(\\d+)\\s`, "gm"),
        };

        return result;
    }

}
