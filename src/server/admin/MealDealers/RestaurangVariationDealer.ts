import { AlternativeIndex } from "../../enum/AlternativeIndex";
import { FetcherType } from "../../enum/FetcherType";
import { LabelName } from "../../enum/LabelName";
import { WeekDayJavascriptDayIndex } from "../../enum/WeekDayJavascriptDayIndex";
import { IHtmlDocumentParser } from "../../interfaces/IHtmlDocumentParser";
import { IHtmlFetcherHelper } from "../../interfaces/IHtmlFetcherHelper";
import { IPdfFetcherHelper } from "../../interfaces/IPdfFetcherHelper";
import { IRegexDishProviderResult } from "../../interfaces/IRegexDishProviderResult";
import { IWebMealDealerStatic } from "../../interfaces/IWebMealDealerStatic";
import { IWebMealResult } from "../../interfaces/IWebMealResult";
import { DishPriceWeekNumber } from "./DishPriceWeekNumber";
import { WebMealResult } from "./WebMealResult";

export const RestaurangVariationDealer: IWebMealDealerStatic =  class RestaurangVariationDealer {

    public static get baseUrlStatic(): string {
        const baseUrl = "https://www.nyavariation.se/matsedel/";
        return baseUrl;
    }

    public static get fetcherTypeNeededStatic(): FetcherType {
        return FetcherType.PDF;
    }

    public static async menuUrlStatic(pageWhereToFindMenuUrl: IHtmlDocumentParser): Promise<string> {
        const xPath = "//h2[contains(.,'matsedel')]/a/@href";

        const aNodeXPathResult = await pageWhereToFindMenuUrl.contentFromHtmlDocument(xPath);
        const aHref = aNodeXPathResult.iterateNext().nodeValue;
        const baseUrl = new URL(pageWhereToFindMenuUrl.htmlDocument.URL);

        const menuUrl = `${baseUrl.protocol}//${baseUrl.host}${aHref}`;

        return menuUrl;
    }

    private baseUrl: string;
    private dealerData: string = "";
    private weekNumberExpected: string = "";
    private weekYear: string = "";

    constructor(
        dealerData: string,
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

    private getWebMealResultAForAWeek(): Array<Promise<IWebMealResult>> {

        const mealsForAWeek: Array<Promise<IWebMealResult>>  = [
            this.webMealResult( WeekDayJavascriptDayIndex.MONDAY,
                                LabelName.MEAL_OF_THE_DAY, 1, AlternativeIndex.ONE),
            this.webMealResult( WeekDayJavascriptDayIndex.MONDAY,
                                LabelName.MEAL_OF_THE_DAY, 2, AlternativeIndex.TWO),
            this.webMealResult( WeekDayJavascriptDayIndex.MONDAY,
                                LabelName.VEGETARIAN, 3, AlternativeIndex.ONE),
            this.webMealResult( WeekDayJavascriptDayIndex.MONDAY,
                                LabelName.SALAD, 4, AlternativeIndex.ONE),

            this.webMealResult( WeekDayJavascriptDayIndex.TUESDAY,
                                LabelName.MEAL_OF_THE_DAY, 1, AlternativeIndex.ONE),
            this.webMealResult( WeekDayJavascriptDayIndex.TUESDAY,
                                LabelName.MEAL_OF_THE_DAY, 2, AlternativeIndex.TWO),
            this.webMealResult( WeekDayJavascriptDayIndex.TUESDAY,
                                LabelName.VEGETARIAN, 3, AlternativeIndex.ONE),
            this.webMealResult( WeekDayJavascriptDayIndex.TUESDAY,
                                LabelName.SALAD, 4, AlternativeIndex.ONE),

            this.webMealResult( WeekDayJavascriptDayIndex.WEDNESDAY,
                                LabelName.MEAL_OF_THE_DAY, 1, AlternativeIndex.ONE),
            this.webMealResult( WeekDayJavascriptDayIndex.WEDNESDAY,
                                LabelName.MEAL_OF_THE_DAY, 2, AlternativeIndex.TWO),
            this.webMealResult( WeekDayJavascriptDayIndex.WEDNESDAY,
                                LabelName.VEGETARIAN, 3, AlternativeIndex.ONE),
            this.webMealResult( WeekDayJavascriptDayIndex.WEDNESDAY,
                                LabelName.SALAD, 4, AlternativeIndex.ONE),

            this.webMealResult( WeekDayJavascriptDayIndex.THURSDAY,
                                LabelName.MEAL_OF_THE_DAY, 1, AlternativeIndex.ONE),
            this.webMealResult( WeekDayJavascriptDayIndex.THURSDAY,
                                LabelName.MEAL_OF_THE_DAY, 2, AlternativeIndex.TWO),
            this.webMealResult( WeekDayJavascriptDayIndex.THURSDAY,
                                LabelName.VEGETARIAN, 3, AlternativeIndex.ONE),
            this.webMealResult( WeekDayJavascriptDayIndex.THURSDAY,
                                LabelName.SALAD, 4, AlternativeIndex.ONE),

            this.webMealResult( WeekDayJavascriptDayIndex.FRIDAY,
                                LabelName.MEAL_OF_THE_DAY, 1, AlternativeIndex.ONE),
            this.webMealResult( WeekDayJavascriptDayIndex.FRIDAY,
                                LabelName.MEAL_OF_THE_DAY, 2, AlternativeIndex.TWO),
            this.webMealResult( WeekDayJavascriptDayIndex.FRIDAY,
                                LabelName.VEGETARIAN, 3, AlternativeIndex.ONE),
            this.webMealResult( WeekDayJavascriptDayIndex.THURSDAY,
                                LabelName.SALAD, 4, AlternativeIndex.ONE),
        ];

        return mealsForAWeek;
    }

    private async webMealResult( weekDayJavascriptDayIndex: WeekDayJavascriptDayIndex,
                                 label: LabelName, menuOrderIndex: number,
                                 alternativeIndex: AlternativeIndex): Promise<IWebMealResult> {

        let dishPriceWeekNumber: DishPriceWeekNumber = null;
        let webMealResult: WebMealResult = null;

        try {
            dishPriceWeekNumber =
                await this.getDishPriceWeekNumber( weekDayJavascriptDayIndex, menuOrderIndex );

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

    private async getDishPriceWeekNumber( weekDayJavascriptDayIndex: WeekDayJavascriptDayIndex,
                                          menuAlternativeIndex: number): Promise<DishPriceWeekNumber> {

        const textContentFromPdfDocument = this.dealerData;

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

};
