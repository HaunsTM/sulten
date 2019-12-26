import { AlternativeIndex } from "../../enum/AlternativeIndex";
import { FetcherType } from "../../enum/FetcherType";
import { LabelName } from "../../enum/LabelName";
import { WeekDayIndex } from "../../enum/WeekDayIndex";
import { IHtmlDocumentParser } from "../../interfaces/IHtmlDocumentParser";
import { IRegexDishProviderResult } from "../../interfaces/IRegexDishProviderResult";
import { IWebMealDealerStatic } from "../../interfaces/IWebMealDealerStatic";
import { IWebMealResult } from "../../interfaces/IWebMealResult";
import { DishPriceWeekNumber } from "./DishPriceWeekNumber";
import { WebMealResult } from "./WebMealResult";

export const Lokal17Dealer: IWebMealDealerStatic =  class Lokal17DealerLocal {

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

    private getSwedishWeekDayNameOnLokal17( weekDayJavascriptDayIndex: WeekDayIndex ): string {
        let swedishWeekDayName = "";

        switch ( weekDayJavascriptDayIndex ) {
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

    private getWebMealResultAForAWeek(): Array<Promise<IWebMealResult>> {

        const mealsForAWeek: Array<Promise<IWebMealResult>>  = [
            this.webMealResult( WeekDayIndex.MONDAY, LabelName.MEAL_OF_THE_DAY, AlternativeIndex.ONE),
            this.webMealResult( WeekDayIndex.MONDAY, LabelName.VEGETARIAN, AlternativeIndex.ONE),
            this.webMealResult( WeekDayIndex.MONDAY, LabelName.DESSERT, AlternativeIndex.ONE),
            this.webMealResult( WeekDayIndex.MONDAY, LabelName.DESSERT, AlternativeIndex.TWO),

            this.webMealResult( WeekDayIndex.TUESDAY, LabelName.MEAL_OF_THE_DAY, AlternativeIndex.ONE),
            this.webMealResult( WeekDayIndex.TUESDAY, LabelName.VEGETARIAN, AlternativeIndex.ONE),
            this.webMealResult( WeekDayIndex.TUESDAY, LabelName.DESSERT, AlternativeIndex.ONE),
            this.webMealResult( WeekDayIndex.TUESDAY, LabelName.DESSERT, AlternativeIndex.TWO),

            this.webMealResult( WeekDayIndex.WEDNESDAY, LabelName.MEAL_OF_THE_DAY, AlternativeIndex.ONE),
            this.webMealResult( WeekDayIndex.WEDNESDAY, LabelName.VEGETARIAN, AlternativeIndex.ONE),
            this.webMealResult( WeekDayIndex.WEDNESDAY, LabelName.DESSERT, AlternativeIndex.ONE),
            this.webMealResult( WeekDayIndex.WEDNESDAY, LabelName.DESSERT, AlternativeIndex.TWO),

            this.webMealResult( WeekDayIndex.THURSDAY, LabelName.MEAL_OF_THE_DAY, AlternativeIndex.ONE),
            this.webMealResult( WeekDayIndex.THURSDAY, LabelName.VEGETARIAN, AlternativeIndex.ONE),
            this.webMealResult( WeekDayIndex.THURSDAY, LabelName.DESSERT, AlternativeIndex.ONE),
            this.webMealResult( WeekDayIndex.THURSDAY, LabelName.DESSERT, AlternativeIndex.TWO),

            this.webMealResult( WeekDayIndex.FRIDAY, LabelName.MEAL_OF_THE_DAY, AlternativeIndex.ONE),
            this.webMealResult( WeekDayIndex.FRIDAY, LabelName.VEGETARIAN, AlternativeIndex.ONE),
            this.webMealResult( WeekDayIndex.FRIDAY, LabelName.DESSERT, AlternativeIndex.ONE),
            this.webMealResult( WeekDayIndex.FRIDAY, LabelName.DESSERT, AlternativeIndex.TWO),
        ];

        return mealsForAWeek;
    }

    private async webMealResult( weekDayJavascriptDayIndex: WeekDayIndex,
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
    private async getDishPriceWeekNumber( weekDayJavascriptDayIndex: WeekDayIndex, label: LabelName,
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
        weekDayJavascriptDayIndex: WeekDayIndex,
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
