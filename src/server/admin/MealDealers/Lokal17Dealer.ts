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

export const Lokal17Dealer: IWebMealDealerStatic =  class Lokal17Dealer {

    public static get baseUrlStatic(): string {
        const baseUrl = "https://lokal17.se/";
        return baseUrl;
    }

    public static get fetcherTypeNeededStatic(): FetcherType {
        return FetcherType.PDF;
    }

    public static async menuUrlStatic(pageWhereToFindMenuUrl: IHtmlDocumentParser): Promise<string> {
        const xPath = "//article[@id='food']//a[contains(.,'Lunchmeny')]/@href";

        const aNodeXPathResult = await pageWhereToFindMenuUrl.contentFromHtmlDocument(xPath);
        const aHref = aNodeXPathResult.iterateNext().nodeValue;
        return aHref;
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

    private getWebMealResultAForAWeek(): Array<Promise<IWebMealResult>> {

        const mealsForAWeek: Array<Promise<IWebMealResult>>  = [
            this.webMealResult( WeekDayJavascriptDayIndex.MONDAY, LabelName.MEAL_OF_THE_DAY, AlternativeIndex.ONE),
            this.webMealResult( WeekDayJavascriptDayIndex.MONDAY, LabelName.VEGETARIAN, AlternativeIndex.ONE),
            this.webMealResult( WeekDayJavascriptDayIndex.MONDAY, LabelName.DESSERT, AlternativeIndex.ONE),
            this.webMealResult( WeekDayJavascriptDayIndex.MONDAY, LabelName.DESSERT, AlternativeIndex.TWO),

            this.webMealResult( WeekDayJavascriptDayIndex.TUESDAY, LabelName.MEAL_OF_THE_DAY, AlternativeIndex.ONE),
            this.webMealResult( WeekDayJavascriptDayIndex.TUESDAY, LabelName.VEGETARIAN, AlternativeIndex.ONE),
            this.webMealResult( WeekDayJavascriptDayIndex.TUESDAY, LabelName.DESSERT, AlternativeIndex.ONE),
            this.webMealResult( WeekDayJavascriptDayIndex.TUESDAY, LabelName.DESSERT, AlternativeIndex.TWO),

            this.webMealResult( WeekDayJavascriptDayIndex.WEDNESDAY, LabelName.MEAL_OF_THE_DAY, AlternativeIndex.ONE),
            this.webMealResult( WeekDayJavascriptDayIndex.WEDNESDAY, LabelName.VEGETARIAN, AlternativeIndex.ONE),
            this.webMealResult( WeekDayJavascriptDayIndex.WEDNESDAY, LabelName.DESSERT, AlternativeIndex.ONE),
            this.webMealResult( WeekDayJavascriptDayIndex.WEDNESDAY, LabelName.DESSERT, AlternativeIndex.TWO),

            this.webMealResult( WeekDayJavascriptDayIndex.THURSDAY, LabelName.MEAL_OF_THE_DAY, AlternativeIndex.ONE),
            this.webMealResult( WeekDayJavascriptDayIndex.THURSDAY, LabelName.VEGETARIAN, AlternativeIndex.ONE),
            this.webMealResult( WeekDayJavascriptDayIndex.THURSDAY, LabelName.DESSERT, AlternativeIndex.ONE),
            this.webMealResult( WeekDayJavascriptDayIndex.THURSDAY, LabelName.DESSERT, AlternativeIndex.TWO),

            this.webMealResult( WeekDayJavascriptDayIndex.FRIDAY, LabelName.MEAL_OF_THE_DAY, AlternativeIndex.ONE),
            this.webMealResult( WeekDayJavascriptDayIndex.FRIDAY, LabelName.VEGETARIAN, AlternativeIndex.ONE),
            this.webMealResult( WeekDayJavascriptDayIndex.FRIDAY, LabelName.DESSERT, AlternativeIndex.ONE),
            this.webMealResult( WeekDayJavascriptDayIndex.FRIDAY, LabelName.DESSERT, AlternativeIndex.TWO),
        ];

        return mealsForAWeek;
    }

    private async webMealResult( weekDayJavascriptDayIndex: WeekDayJavascriptDayIndex,
                                 label: LabelName, alternativeIndex: AlternativeIndex): Promise<IWebMealResult> {

        let dishPriceWeekNumber: DishPriceWeekNumber = null;
        let webMealResult: WebMealResult = null;

        try {
            dishPriceWeekNumber =
                await this.getDishPriceWeekNumber( weekDayJavascriptDayIndex, label, alternativeIndex );

            if ( dishPriceWeekNumber.fetchError ) {
                throw dishPriceWeekNumber.fetchError;
            }

            if ( this.weekNumberExpected !== dishPriceWeekNumber.weekIndexWeekNumber) {
                throw new Error(`Expected to see menu for week ${this.weekNumberExpected}, ` +
                    `but found week ${dishPriceWeekNumber.weekIndexWeekNumber}`);
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
    private async getDishPriceWeekNumber( weekDayJavascriptDayIndex: WeekDayJavascriptDayIndex, label: LabelName,
                                          alternativeIndex: AlternativeIndex ): Promise<DishPriceWeekNumber> {

        const textContentFromPdfDocument = this.dealerData;

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

};
