import { FetcherType } from "../../enum/FetcherType";
import { IndexNumber } from "../../enum/IndexNumber";
import { LabelName } from "../../enum/LabelName";
import { WeekDayIndex } from "../../enum/WeekDayIndex";
import { IHtmlDocumentParser } from "../../interfaces/IHtmlDocumentParser";
import { IMenuUrlDynamicData } from "../../interfaces/IMenuUrlDynamicData";
import { IRegexDishProviderResult } from "../../interfaces/IRegexDishProviderResult";
import { IWebMealDealerStatic } from "../../interfaces/IWebMealDealerStatic";
import { IWebMealResult } from "../../interfaces/IWebMealResult";
import { WebMealResult } from "../WebMealResult";
import { DishPriceWeekNumber } from "./DishPriceWeekNumber";

export const PathotellundRestaurangDealer: IWebMealDealerStatic =  class PathotellundRestaurangDealerLocal {

    public static get baseUrlStatic(): string {
        const baseUrl = "https://vardgivare.skane.se/patientadministration/maltider-och-matsedlar/";

        return baseUrl;
    }

    public static get fetcherTypeNeededStatic(): FetcherType {
        return FetcherType.PDF;
    }

    public static async menuUrlStatic(
        pageWhereToFindMenuUrl: IHtmlDocumentParser, menuUrlDynamicData: IMenuUrlDynamicData): Promise<string> {
        const xPath = `//a[@href[contains(.,'lund')]][@href[contains(.,'pdf')]][text()[contains(.,'vecka ${menuUrlDynamicData.weekIndex}')]]/@href`;

        const aNodeXPathResult = await pageWhereToFindMenuUrl.contentFromHtmlDocument(xPath);
        const aHref = aNodeXPathResult.iterateNext().nodeValue;
        const menuUrl = pageWhereToFindMenuUrl.htmlDocument.defaultView.location.origin + aHref;
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
        const mealsForAWeekWithPossibleNullValues = await Promise.all(mealsForAWeekPromise);

        const mealsForAWeek = mealsForAWeekWithPossibleNullValues
            .filter( (element) => {
                const validResult = element.isValid;

                return validResult;
            } );

        return mealsForAWeek;
    }

    private getSwedishWeekDayNameOnPathotellundRestaurang( weekDayJavascriptDayIndex: WeekDayIndex ): string {
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
            case WeekDayIndex.SATURDAY :
                swedishWeekDayName = "Lördag";
                break;
            case WeekDayIndex.SUNDAY :
                swedishWeekDayName = "Söndag";
                break;
            default:
                throw Error("Not implemented week day");
                break;
        }
        return swedishWeekDayName;
    }
    private getSwedishLabelNameOnPathotellundRestaurang( label: LabelName ): string {
        let swedishWeekDayName = "";

        switch ( label ) {
            case LabelName.MEAL_OF_THE_DAY :
                swedishWeekDayName = "Lunch";
                break;
            case LabelName.VEGETARIAN :
                swedishWeekDayName = "Vegetariskt alternativ";
                break;
            case LabelName.DESSERT :
                swedishWeekDayName = "Dessert";
                break;
            default:
                throw Error("Not implemented dishlabel");
                break;
        }
        return swedishWeekDayName;
    }

    private getWebMealResultAForAWeek(): Array<Promise<IWebMealResult>> {

        const mealsForAWeek: Array<Promise<IWebMealResult>>  = [
            this.webMealResult( WeekDayIndex.MONDAY, LabelName.MEAL_OF_THE_DAY, IndexNumber.ONE),
            this.webMealResult( WeekDayIndex.MONDAY, LabelName.VEGETARIAN, IndexNumber.ONE),
            this.webMealResult( WeekDayIndex.MONDAY, LabelName.DESSERT, IndexNumber.ONE),

            this.webMealResult( WeekDayIndex.TUESDAY, LabelName.MEAL_OF_THE_DAY, IndexNumber.ONE),
            this.webMealResult( WeekDayIndex.TUESDAY, LabelName.VEGETARIAN, IndexNumber.ONE),
            this.webMealResult( WeekDayIndex.TUESDAY, LabelName.DESSERT, IndexNumber.ONE),

            this.webMealResult( WeekDayIndex.WEDNESDAY, LabelName.MEAL_OF_THE_DAY, IndexNumber.ONE),
            this.webMealResult( WeekDayIndex.WEDNESDAY, LabelName.VEGETARIAN, IndexNumber.ONE),
            this.webMealResult( WeekDayIndex.WEDNESDAY, LabelName.DESSERT, IndexNumber.ONE),

            this.webMealResult( WeekDayIndex.THURSDAY, LabelName.MEAL_OF_THE_DAY, IndexNumber.ONE),
            this.webMealResult( WeekDayIndex.THURSDAY, LabelName.VEGETARIAN, IndexNumber.ONE),
            this.webMealResult( WeekDayIndex.THURSDAY, LabelName.DESSERT, IndexNumber.ONE),

            this.webMealResult( WeekDayIndex.FRIDAY, LabelName.MEAL_OF_THE_DAY, IndexNumber.ONE),
            this.webMealResult( WeekDayIndex.FRIDAY, LabelName.VEGETARIAN, IndexNumber.ONE),
            this.webMealResult( WeekDayIndex.FRIDAY, LabelName.DESSERT, IndexNumber.ONE),

            this.webMealResult( WeekDayIndex.SATURDAY, LabelName.MEAL_OF_THE_DAY, IndexNumber.ONE),
            this.webMealResult( WeekDayIndex.SATURDAY, LabelName.VEGETARIAN, IndexNumber.ONE),
            this.webMealResult( WeekDayIndex.SATURDAY, LabelName.DESSERT, IndexNumber.ONE),

            this.webMealResult( WeekDayIndex.SUNDAY, LabelName.MEAL_OF_THE_DAY, IndexNumber.ONE),
            this.webMealResult( WeekDayIndex.SUNDAY, LabelName.VEGETARIAN, IndexNumber.ONE),
            this.webMealResult( WeekDayIndex.SUNDAY, LabelName.DESSERT, IndexNumber.ONE),
        ];

        return mealsForAWeek;
    }

    private async webMealResult( weekDayJavascriptDayIndex: WeekDayIndex,
                                 label: LabelName, indexNumber: IndexNumber): Promise<IWebMealResult> {

        let dishPriceWeekNumber: DishPriceWeekNumber = null;
        let webMealResult: WebMealResult = null;

        try {
            dishPriceWeekNumber =
                await this.getDishPriceWeekNumber( weekDayJavascriptDayIndex, label, indexNumber );

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
                    dishPriceWeekNumber.priceSEK, indexNumber, label, weekDayJavascriptDayIndex,
                    dishPriceWeekNumber.weekIndexWeekNumber, this.weekYear, null);

        } catch ( error ) {
            webMealResult =
                new WebMealResult( this.baseUrl, "", "", indexNumber, label,
                    weekDayJavascriptDayIndex, this.weekNumberExpected, this.weekYear, error.fetchError);
        }

        return webMealResult;
    }
    private async getDishPriceWeekNumber( weekDayJavascriptDayIndex: WeekDayIndex, label: LabelName,
                                          indexNumber: IndexNumber ): Promise<DishPriceWeekNumber> {

        const textContentFromPdfDocument = this.dealerData;

        const dishPriceWeekNumberPromise =
            new Promise<DishPriceWeekNumber>( (res, rej) => {

                let dishDescription: string;
                let priceSEK: string;
                let weekIndexWeekNumber: string;

                let dishPriceWeekNumber: DishPriceWeekNumber = null;

                const rPAMAD = this.regexProviderAllMealsADay(weekDayJavascriptDayIndex);
                const rP = this.regexProvider(label);

                try {
                    const allMealsADay = rPAMAD.descriptionRegex.exec(textContentFromPdfDocument)[1];
                    const dishDescriptionExecuted =
                    rP.descriptionRegex.exec(allMealsADay);
                    dishDescription = dishDescriptionExecuted ? dishDescriptionExecuted[1] : "";

                    priceSEK = ""; // rP.price_SEKRegex.exec(textContentFromPdfDocument)[1];

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

    private regexProviderAllMealsADay( weekDayJavascriptDayIndex: WeekDayIndex ): IRegexDishProviderResult {

        const swedishWeekDayName = this.getSwedishWeekDayNameOnPathotellundRestaurang( weekDayJavascriptDayIndex );

        const price_SEKRegexPattern = "";

        const descriptionRegexPattern = `(?<=${swedishWeekDayName})\\s+(.+?)\\s+(?=(?:Tis|Ons|Tors|Fre|Lör|Sön)dag|Boka bord)`;

        const weekNumberRegexPattern = `(?<=\\s+Vecka)\\s+(\\d+)`;

        const result: IRegexDishProviderResult = {
            descriptionRegex: new RegExp(descriptionRegexPattern, "gmi"),
            price_SEKRegex: new RegExp( price_SEKRegexPattern, "gmi"),
            weekNumberRegex: RegExp(weekNumberRegexPattern, "gmi"),
        };

        return result;
    }

    private regexProvider( label: LabelName ): IRegexDishProviderResult {

        const swedishLabelName = this.getSwedishLabelNameOnPathotellundRestaurang( label );

        const price_SEKRegexPattern = "";

        const descriptionRegexPattern = `(?:${swedishLabelName}:)\\s+(.+?)\\s*?(?=Lunch|Dessert|Middag|Vegetariskt alternativ|$)`;

        const weekNumberRegexPattern = `(?<=\\s+[Vv]ecka)\\s+(\\d+)`;

        const result: IRegexDishProviderResult = {
            descriptionRegex: new RegExp(descriptionRegexPattern, "gmi"),
            price_SEKRegex: new RegExp( price_SEKRegexPattern, "gmi"),
            weekNumberRegex: RegExp(weekNumberRegexPattern, "gm"),
        };

        return result;
    }

};
