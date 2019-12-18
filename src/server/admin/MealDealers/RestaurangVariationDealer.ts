import { AlternativeIndex } from "../../enum/AlternativeIndex";
import { LabelName } from "../../enum/LabelName";
import { WeekDayJavascriptDayIndex } from "../../enum/WeekDayJavascriptDayIndex";
import { IHtmlFetcherHelper } from "../../interfaces/IHtmlFetcherHelper";
import { IPdfFetcherHelper } from "../../interfaces/IPdfFetcherHelper";
import { IRegexDishProviderResult } from "../../interfaces/IRegexDishProviderResult";
import { IWebMealDealer } from "../../interfaces/IWebMealDealer";
import { IWebMealResult } from "../../interfaces/IWebMealResult";
import { DishPriceWeekNumber } from "./DishPriceWeekNumber";
import { WebMealResult } from "./WebMealResult";

export class RestaurangVariationDealer implements IWebMealDealer {

    public static async GetRestaurangVariationDealerAsync(
        pdfFetcherHelper: IPdfFetcherHelper,
        menuUrlFetcher: IHtmlFetcherHelper,
        weekYear: string,
        weekNumberExpected: string): Promise<RestaurangVariationDealer> {

        pdfFetcherHelper.actualRestaurantMenuUrl =
            await RestaurangVariationDealer.actualRestaurantMenuUrl(menuUrlFetcher);

        const restaurangVariationDealer =
            new RestaurangVariationDealer(pdfFetcherHelper, weekYear, weekNumberExpected);

        return restaurangVariationDealer;
    }

    private static async actualRestaurantMenuUrl(menuUrlFetcher: IHtmlFetcherHelper): Promise<string> {
        const xPath = "//h2[contains(.,'matsedel')]/a/@href";

        const aNodeXPathResult = await menuUrlFetcher.contentFromHtmlDocument(xPath);
        const aHref = aNodeXPathResult.iterateNext().nodeValue;
        const baseUrl = new URL(menuUrlFetcher.initialBaseMenuUrl);

        const actualRestaurantMenuUrl = `${baseUrl.protocol}//${baseUrl.host}${aHref}`;

        return actualRestaurantMenuUrl;
    }

    private _pdfFetcherHelper: IPdfFetcherHelper = null;
    private _weekYear: string = "";
    private _weekNumberExpected: string = "";

    private constructor(
        pdfFetcherHelper: IPdfFetcherHelper,
        weekYear: string,
        weekNumberExpected: string) {

        this._pdfFetcherHelper = pdfFetcherHelper;
        this._weekYear = weekYear;
        this._weekNumberExpected = weekNumberExpected;
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
            this.webMealResult(
                textContentFromPdfDocument, WeekDayJavascriptDayIndex.MONDAY,
                LabelName.MEAL_OF_THE_DAY, 1, AlternativeIndex.ONE),
            this.webMealResult(
                textContentFromPdfDocument, WeekDayJavascriptDayIndex.MONDAY,
                LabelName.MEAL_OF_THE_DAY, 2, AlternativeIndex.TWO),
            this.webMealResult(
                textContentFromPdfDocument, WeekDayJavascriptDayIndex.MONDAY,
                LabelName.VEGETARIAN, 3, AlternativeIndex.ONE),
            this.webMealResult(
                textContentFromPdfDocument, WeekDayJavascriptDayIndex.MONDAY,
                LabelName.SALAD, 4, AlternativeIndex.ONE),

            this.webMealResult(
                textContentFromPdfDocument, WeekDayJavascriptDayIndex.TUESDAY,
                LabelName.MEAL_OF_THE_DAY, 1, AlternativeIndex.ONE),
            this.webMealResult(
                textContentFromPdfDocument, WeekDayJavascriptDayIndex.TUESDAY,
                LabelName.MEAL_OF_THE_DAY, 2, AlternativeIndex.TWO),
            this.webMealResult(
                textContentFromPdfDocument, WeekDayJavascriptDayIndex.TUESDAY,
                LabelName.VEGETARIAN, 3, AlternativeIndex.ONE),
            this.webMealResult(
                textContentFromPdfDocument, WeekDayJavascriptDayIndex.TUESDAY,
                LabelName.SALAD, 4, AlternativeIndex.ONE),

            this.webMealResult(
                textContentFromPdfDocument, WeekDayJavascriptDayIndex.WEDNESDAY,
                LabelName.MEAL_OF_THE_DAY, 1, AlternativeIndex.ONE),
            this.webMealResult(
                textContentFromPdfDocument, WeekDayJavascriptDayIndex.WEDNESDAY,
                LabelName.MEAL_OF_THE_DAY, 2, AlternativeIndex.TWO),
            this.webMealResult(
                textContentFromPdfDocument, WeekDayJavascriptDayIndex.WEDNESDAY,
                LabelName.VEGETARIAN, 3, AlternativeIndex.ONE),
            this.webMealResult(
                textContentFromPdfDocument, WeekDayJavascriptDayIndex.WEDNESDAY,
                LabelName.SALAD, 4, AlternativeIndex.ONE),

            this.webMealResult(
                textContentFromPdfDocument, WeekDayJavascriptDayIndex.THURSDAY,
                LabelName.MEAL_OF_THE_DAY, 1, AlternativeIndex.ONE),
            this.webMealResult(
                textContentFromPdfDocument, WeekDayJavascriptDayIndex.THURSDAY,
                LabelName.MEAL_OF_THE_DAY, 2, AlternativeIndex.TWO),
            this.webMealResult(
                textContentFromPdfDocument, WeekDayJavascriptDayIndex.THURSDAY,
                LabelName.VEGETARIAN, 3, AlternativeIndex.ONE),
            this.webMealResult(
                textContentFromPdfDocument, WeekDayJavascriptDayIndex.THURSDAY,
                LabelName.SALAD, 4, AlternativeIndex.ONE),

            this.webMealResult(
                textContentFromPdfDocument, WeekDayJavascriptDayIndex.FRIDAY,
                LabelName.MEAL_OF_THE_DAY, 1, AlternativeIndex.ONE),
            this.webMealResult(
                textContentFromPdfDocument, WeekDayJavascriptDayIndex.FRIDAY,
                LabelName.MEAL_OF_THE_DAY, 2, AlternativeIndex.TWO),
            this.webMealResult(
                textContentFromPdfDocument, WeekDayJavascriptDayIndex.FRIDAY,
                LabelName.VEGETARIAN, 3, AlternativeIndex.ONE),
            this.webMealResult(
                textContentFromPdfDocument, WeekDayJavascriptDayIndex.THURSDAY,
                LabelName.SALAD, 4, AlternativeIndex.ONE),
        ];

        return mealsForAWeek;
    }

    private async webMealResult(
        textContentFromPdfDocument: string, weekDayJavascriptDayIndex: WeekDayJavascriptDayIndex,
        label: LabelName, menuOrderIndex: number, alternativeIndex: AlternativeIndex): Promise<IWebMealResult> {

        let dishPriceWeekNumber: DishPriceWeekNumber = null;
        let webMealResult: WebMealResult = null;

        try {
            dishPriceWeekNumber =
                await this.getDishPriceWeekNumber(
                    textContentFromPdfDocument, weekDayJavascriptDayIndex, menuOrderIndex );

            if ( dishPriceWeekNumber.fetchError ) {
                throw dishPriceWeekNumber.fetchError;
            }

            if ( this._weekNumberExpected !== dishPriceWeekNumber.weekIndexWeekNumber) {
                throw new Error(`Expected to see menu for week ${this._weekNumberExpected}, but found week ${dishPriceWeekNumber.weekIndexWeekNumber}`);
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
        textContentFromPdfDocument: string, weekDayJavascriptDayIndex: WeekDayJavascriptDayIndex,
        menuAlternativeIndex: number): Promise<DishPriceWeekNumber> {

        const dishPriceWeekNumberPromise =
            new Promise<DishPriceWeekNumber>( (res, rej) => {

                let dishDescription: string;
                let priceSEK: string;
                let weekIndexWeekNumber: string;

                let dishPriceWeekNumber: DishPriceWeekNumber = null;

                const rP = this.regexProvider(weekDayJavascriptDayIndex, menuAlternativeIndex);

                try {
                    const dishes = rP.descriptionRegex.exec(textContentFromPdfDocument);
                    dishDescription = dishes[menuAlternativeIndex];

                    // priceSEK = textContentFromPdfDocument.match(rP.price_SEKRegex)[0];
                    priceSEK = rP.price_SEKRegex.exec(textContentFromPdfDocument)[1];

                    // weekIndexWeekNumber = textContentFromPdfDocument.match(rP.weekNumberRegex)[0];
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
        weekDayJavascriptDayIndex: WeekDayJavascriptDayIndex, menuAlternativeIndex: number): IRegexDishProviderResult {

        const swedishWeekDayName = this.getSwedishWeekDayNameOnVariation( weekDayJavascriptDayIndex );

        const descriptionRegexPattern  = weekDayJavascriptDayIndex < 5 ?
            `(?<=${swedishWeekDayName} dagens buffé)(?:\\s*•\\s+([^•]+)\\b\\s+)(?:\\s*•\\s+([^•]+)\\b\\s+)(?:\\s*•\\s+([^•]+)\\b\\s+)(?:\\s*•\\s+([^•]+)\\b\\s+)(?=(?:mån|tis|ons|tors|fre)dag)`
            : `(?<=${swedishWeekDayName} dagens buffé)(?:\\s*•\\s+([^•]+)\\b\\s+)(?:\\s*•\\s+([^•]+)\\b\\s+)(?:\\s*•\\s+([^•]+)\\b\\s+)`;

        const price_SEKRegexPattern = menuAlternativeIndex < 3 ?
            `(?:DAGENS BUFFÉ.*?(\\d+)\\skr\\b)`
            : `(?:SOPPA MED SALLAD.*?(\\d+)\\skr\\b)`;

        const weekNumberRegexPattern = `(?:vecka\\s+(\\d+)\\s)`;

        const result: IRegexDishProviderResult = {
            descriptionRegex: new RegExp(descriptionRegexPattern, "gmi"),
            price_SEKRegex: new RegExp( price_SEKRegexPattern, "gm"),
            weekNumberRegex: RegExp(weekNumberRegexPattern, "gm"),
        };

        return result;
    }

}
