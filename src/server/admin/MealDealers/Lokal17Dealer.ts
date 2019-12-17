import { AlternativeIndex } from "../../enum/AlternativeIndex";
import { LabelName } from "../../enum/LabelName";
import { WeekDayJavascriptDayIndex } from "../../enum/WeekDayJavascriptDayIndex";
import { IEpochHelper } from "../../interfaces/IEpochHelper";
import { IPdfFetcherHelper } from "../../interfaces/IPdfFetcherHelper";
import { IRegexDishProviderResult } from "../../interfaces/IRegexDishProviderResult";
import { IWebMealDealer } from "../../interfaces/IWebMealDealer";
import { IWebMealResult } from "../../interfaces/IWebMealResult";
import { DishPriceWeekNumber } from "./DishPriceWeekNumber";
import { WebMealResult } from "./WebMealResult";

export class Lokal17Dealer implements IWebMealDealer {

    private _epochHelper: IEpochHelper;
    private _pdfFetcherHelper: IPdfFetcherHelper;
    private _weekYear: string;
    private _weekNumberExpected: string;

    constructor(
        pdfFetcherHelper: IPdfFetcherHelper,
        epochHelper: IEpochHelper,
        weekYear: string,
        weekNumberExpected: string) {

        this._pdfFetcherHelper = pdfFetcherHelper;
        this._epochHelper = epochHelper;
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
        const monthThatStartedTheWeek1to12 =
            this._epochHelper.getMonthThatStartedTheWeek(+this._weekYear, +this._weekNumberExpected);

        const updatedHtmlFetcherHelperUrl =
            this._pdfFetcherHelper.initialBaseMenuUrl +
            `app/uploads/${this._weekYear}/${monthThatStartedTheWeek1to12}/` +
            `Lunch-vecka-${this._weekNumberExpected}-${this._weekYear}.pdf`;
        this._pdfFetcherHelper.actualRestaurantMenuUrl = updatedHtmlFetcherHelperUrl;
    }

    private initialize(): void {
        this.updateCurrentHtmlFetcherHelperUrl();
    }

    private getSwedishWeekDayNameOnLokal17( weekDayJavascriptDayIndex: WeekDayJavascriptDayIndex ): string {
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
            this.webMealResult(
                textContentFromPdfDocument, WeekDayJavascriptDayIndex.MONDAY,
                LabelName.MEAL_OF_THE_DAY, AlternativeIndex.ONE),
            this.webMealResult(
                textContentFromPdfDocument, WeekDayJavascriptDayIndex.MONDAY,
                LabelName.VEGETARIAN, AlternativeIndex.ONE),
            this.webMealResult(
                textContentFromPdfDocument, WeekDayJavascriptDayIndex.MONDAY,
                LabelName.DESSERT, AlternativeIndex.ONE),
            this.webMealResult(
                textContentFromPdfDocument, WeekDayJavascriptDayIndex.MONDAY,
                LabelName.DESSERT, AlternativeIndex.TWO),

            this.webMealResult(
                textContentFromPdfDocument, WeekDayJavascriptDayIndex.TUESDAY,
                LabelName.MEAL_OF_THE_DAY, AlternativeIndex.ONE),
            this.webMealResult(
                textContentFromPdfDocument, WeekDayJavascriptDayIndex.TUESDAY,
                LabelName.VEGETARIAN, AlternativeIndex.ONE),
            this.webMealResult(
                textContentFromPdfDocument, WeekDayJavascriptDayIndex.TUESDAY,
                LabelName.DESSERT, AlternativeIndex.ONE),
            this.webMealResult(
                textContentFromPdfDocument, WeekDayJavascriptDayIndex.TUESDAY,
                LabelName.DESSERT, AlternativeIndex.TWO),

            this.webMealResult(
                textContentFromPdfDocument, WeekDayJavascriptDayIndex.WEDNESDAY,
                LabelName.MEAL_OF_THE_DAY, AlternativeIndex.ONE),
            this.webMealResult(
                textContentFromPdfDocument, WeekDayJavascriptDayIndex.WEDNESDAY,
                LabelName.VEGETARIAN, AlternativeIndex.ONE),
            this.webMealResult(
                textContentFromPdfDocument, WeekDayJavascriptDayIndex.WEDNESDAY,
                LabelName.DESSERT, AlternativeIndex.ONE),
            this.webMealResult(
                textContentFromPdfDocument, WeekDayJavascriptDayIndex.WEDNESDAY,
                LabelName.DESSERT, AlternativeIndex.TWO),

            this.webMealResult(
                textContentFromPdfDocument, WeekDayJavascriptDayIndex.THURSDAY,
                LabelName.MEAL_OF_THE_DAY, AlternativeIndex.ONE),
            this.webMealResult(
                textContentFromPdfDocument, WeekDayJavascriptDayIndex.THURSDAY,
                LabelName.VEGETARIAN, AlternativeIndex.ONE),
            this.webMealResult(
                textContentFromPdfDocument, WeekDayJavascriptDayIndex.THURSDAY,
                LabelName.DESSERT, AlternativeIndex.ONE),
            this.webMealResult(
                textContentFromPdfDocument, WeekDayJavascriptDayIndex.THURSDAY,
                LabelName.DESSERT, AlternativeIndex.TWO),

            this.webMealResult(
                textContentFromPdfDocument, WeekDayJavascriptDayIndex.FRIDAY,
                LabelName.MEAL_OF_THE_DAY, AlternativeIndex.ONE),
            this.webMealResult(
                textContentFromPdfDocument, WeekDayJavascriptDayIndex.FRIDAY,
                LabelName.VEGETARIAN, AlternativeIndex.ONE),
            this.webMealResult(
                textContentFromPdfDocument, WeekDayJavascriptDayIndex.FRIDAY,
                LabelName.DESSERT, AlternativeIndex.ONE),
            this.webMealResult(
                textContentFromPdfDocument, WeekDayJavascriptDayIndex.FRIDAY,
                LabelName.DESSERT, AlternativeIndex.TWO),
        ];

        return mealsForAWeek;
    }

    private async webMealResult(
        textContentFromPdfDocument: string, weekDayJavascriptDayIndex: WeekDayJavascriptDayIndex,
        label: LabelName, alternativeIndex: AlternativeIndex): Promise<IWebMealResult> {

        let dishPriceWeekNumber: DishPriceWeekNumber = null;
        let webMealResult: WebMealResult = null;

        try {
            dishPriceWeekNumber =
                await this.getDishPriceWeekNumber(
                    textContentFromPdfDocument, weekDayJavascriptDayIndex, label, alternativeIndex );

            if ( dishPriceWeekNumber.fetchError ) {
                throw dishPriceWeekNumber.fetchError;
            }

            if ( this._weekNumberExpected !== dishPriceWeekNumber.weekIndexWeekNumber) {
                throw new Error(`Expected to see menu for week ${this._weekNumberExpected}, ` +
                    `but found week ${dishPriceWeekNumber.weekIndexWeekNumber}`);
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

    private async getDishPriceWeekNumber(
        textContentFromPdfDocument: string, weekDayJavascriptDayIndex: WeekDayJavascriptDayIndex, label: LabelName,
        alternativeIndex: AlternativeIndex): Promise<DishPriceWeekNumber> {

        const dishPriceWeekNumberPromise =
            new Promise<DishPriceWeekNumber>( (res, rej) => {

                let dishDescription: string;
                let priceSEK: string;
                let weekIndexWeekNumber: string;

                let dishPriceWeekNumber: DishPriceWeekNumber = null;

                const rP = this.regexProvider(weekDayJavascriptDayIndex, label, alternativeIndex);

                try {
                    const dishes = rP.descriptionRegex.exec(textContentFromPdfDocument);
                    dishDescription = dishes[alternativeIndex];

                    priceSEK = rP.price_SEKRegex.exec(textContentFromPdfDocument)[1];

                    weekIndexWeekNumber = rP.weekNumberRegex.exec(textContentFromPdfDocument)[1];
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

    private regexProvider(
        weekDayJavascriptDayIndex: WeekDayJavascriptDayIndex,
        label: LabelName, menuAlternativeIndex: number): IRegexDishProviderResult {

        const swedishWeekDayName = this.getSwedishWeekDayNameOnLokal17( weekDayJavascriptDayIndex );
        let descriptionRegexPattern = "";
        let price_SEKRegexPattern = "";

        switch (label) {
            case LabelName.MEAL_OF_THE_DAY:
                descriptionRegexPattern  = weekDayJavascriptDayIndex < 5 ?
                    `(?<=${swedishWeekDayName})\\s+(.+?)\\s+(?=(?:tis|ons|tors|fre)dag|Vegetarisk)`
                    : `(?<=${swedishWeekDayName}ar)\\s+(.+?)(?=\\d+kr)`;
                price_SEKRegexPattern = weekDayJavascriptDayIndex < 5 ?
                    `(?<=${swedishWeekDayName}).+?(\\d+)kr`
                    : `(?<=${swedishWeekDayName}ar).+?(\\d+)kr`;
                break;

            case LabelName.VEGETARIAN :
                    descriptionRegexPattern = `(?<=Vegetarisk)\\s+(.+?)(?=\\d+kr)`;
                    price_SEKRegexPattern = `(?<=Vegetarisk).+?(\\d+)kr`;
                    break;
            case LabelName.DESSERT:
                descriptionRegexPattern =
                    `(?<=Något Sött)(?:\\s\\s(.+?))(?:\\s\\s(.+?))?(?=\\d+kr)`;
                price_SEKRegexPattern = `(?<=Något Sött).+?(\\d+)kr`;
                break;
        }

        const weekNumberRegexPattern = `(?<=LUNCH VECKA)\\s+(\\d+)`;

        const result: IRegexDishProviderResult = {
            descriptionRegex: new RegExp(descriptionRegexPattern, "gmi"),
            price_SEKRegex: new RegExp( price_SEKRegexPattern, "gmi"),
            weekNumberRegex: RegExp(weekNumberRegexPattern, "gm"),
        };

        return result;
    }

}
