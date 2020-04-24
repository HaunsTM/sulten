import { FetcherType } from "../../enum/FetcherType";
import { IndexNumber } from "../../enum/IndexNumber";
import { LabelName } from "../../enum/LabelName";
import { WeekDayIndex } from "../../enum/WeekDayIndex";
import { IDealerResult } from "../../interfaces/IDealerResult";
import { IHtmlDocumentParser } from "../../interfaces/IHtmlDocumentParser";
import { IMenuUrlDynamicData } from "../../interfaces/IMenuUrlDynamicData";
import { IRegexDishProviderResult } from "../../interfaces/IRegexDishProviderResult";
import { IWebMealDealerStatic } from "../../interfaces/IWebMealDealerStatic";
import { IWebMealResult } from "../../interfaces/IWebMealResult";
import { DealerResult } from "../DealerResult";
import { WebMealResult } from "../WebMealResult";
import { DishPriceWeekNumber } from "./DishPriceWeekNumber";

export const PathotellundRestaurangDealer: IWebMealDealerStatic =  class PathotellundRestaurangDealerLocal {

    public static get baseUrlStatic(): string {
        const baseUrl = "https://www.amica.se/regionskane";

        return baseUrl;
    }

    public static get fetcherTypeNeededStatic(): FetcherType {
        return FetcherType.PDF;
    }

    public static async menuUrlStatic(
        pageWhereToFindMenuUrl: IHtmlDocumentParser, menuUrlDynamicData: IMenuUrlDynamicData): Promise<string> {
 
        const menuUrl = `https://www.amica.se/siteassets/menyer-och-restauranger/kavlinge-produktionskok/meny-a-kost-matsedel-v.-${menuUrlDynamicData.weekIndex}-2020.pdf`
        
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

    public async mealsFromWeb(): Promise<IDealerResult> {

        const mealsForAWeekPromise =
            this.getWebMealResultAForAWeek();

        const dealerResult =
            new DealerResult( PathotellundRestaurangDealer.baseUrlStatic, mealsForAWeekPromise );

        return dealerResult;
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
        let swedishLabelName = "";

        switch ( label ) {
            case LabelName.MEAL_OF_THE_DAY :
                swedishLabelName = `Lunch`;
                break;
            case LabelName.VEGETARIAN :
                swedishLabelName = `Dagens gröna`;
                break;
            case LabelName.SUPPER :
                swedishLabelName = `Middag`;
                break;
            case LabelName.DESSERT :
                swedishLabelName = `Dessert`;
                break;
            default:
                throw Error("Not implemented dishlabel");
                break;
        }
        return swedishLabelName;
    }

    private getWebMealResultAForAWeek(): Array<Promise<IWebMealResult>> {

        const mealsForAWeek: Array<Promise<IWebMealResult>>  = [
            this.webMealResult( WeekDayIndex.MONDAY, LabelName.MEAL_OF_THE_DAY, IndexNumber.ONE),
            this.webMealResult( WeekDayIndex.MONDAY, LabelName.MEAL_OF_THE_DAY, IndexNumber.TWO),
            this.webMealResult( WeekDayIndex.MONDAY, LabelName.VEGETARIAN, IndexNumber.ONE),
            this.webMealResult( WeekDayIndex.MONDAY, LabelName.VEGETARIAN, IndexNumber.TWO),
            this.webMealResult( WeekDayIndex.MONDAY, LabelName.SUPPER, IndexNumber.ONE),
            this.webMealResult( WeekDayIndex.MONDAY, LabelName.SUPPER, IndexNumber.TWO),
            this.webMealResult( WeekDayIndex.MONDAY, LabelName.DESSERT, IndexNumber.ONE),
            this.webMealResult( WeekDayIndex.MONDAY, LabelName.DESSERT, IndexNumber.TWO),

            this.webMealResult( WeekDayIndex.TUESDAY, LabelName.MEAL_OF_THE_DAY, IndexNumber.ONE),
            this.webMealResult( WeekDayIndex.TUESDAY, LabelName.MEAL_OF_THE_DAY, IndexNumber.TWO),
            this.webMealResult( WeekDayIndex.TUESDAY, LabelName.VEGETARIAN, IndexNumber.ONE),
            this.webMealResult( WeekDayIndex.TUESDAY, LabelName.VEGETARIAN, IndexNumber.TWO),
            this.webMealResult( WeekDayIndex.TUESDAY, LabelName.SUPPER, IndexNumber.ONE),
            this.webMealResult( WeekDayIndex.TUESDAY, LabelName.SUPPER, IndexNumber.TWO),
            this.webMealResult( WeekDayIndex.TUESDAY, LabelName.DESSERT, IndexNumber.ONE),
            this.webMealResult( WeekDayIndex.TUESDAY, LabelName.DESSERT, IndexNumber.TWO),

            this.webMealResult( WeekDayIndex.WEDNESDAY, LabelName.MEAL_OF_THE_DAY, IndexNumber.ONE),
            this.webMealResult( WeekDayIndex.WEDNESDAY, LabelName.MEAL_OF_THE_DAY, IndexNumber.TWO),
            this.webMealResult( WeekDayIndex.WEDNESDAY, LabelName.VEGETARIAN, IndexNumber.ONE),
            this.webMealResult( WeekDayIndex.WEDNESDAY, LabelName.VEGETARIAN, IndexNumber.TWO),
            this.webMealResult( WeekDayIndex.WEDNESDAY, LabelName.SUPPER, IndexNumber.ONE),
            this.webMealResult( WeekDayIndex.WEDNESDAY, LabelName.SUPPER, IndexNumber.TWO),
            this.webMealResult( WeekDayIndex.WEDNESDAY, LabelName.DESSERT, IndexNumber.ONE),
            this.webMealResult( WeekDayIndex.WEDNESDAY, LabelName.DESSERT, IndexNumber.TWO),

            this.webMealResult( WeekDayIndex.THURSDAY, LabelName.MEAL_OF_THE_DAY, IndexNumber.ONE),
            this.webMealResult( WeekDayIndex.THURSDAY, LabelName.MEAL_OF_THE_DAY, IndexNumber.TWO),
            this.webMealResult( WeekDayIndex.THURSDAY, LabelName.VEGETARIAN, IndexNumber.ONE),
            this.webMealResult( WeekDayIndex.THURSDAY, LabelName.VEGETARIAN, IndexNumber.TWO),
            this.webMealResult( WeekDayIndex.THURSDAY, LabelName.SUPPER, IndexNumber.ONE),
            this.webMealResult( WeekDayIndex.THURSDAY, LabelName.SUPPER, IndexNumber.TWO),
            this.webMealResult( WeekDayIndex.THURSDAY, LabelName.DESSERT, IndexNumber.ONE),
            this.webMealResult( WeekDayIndex.THURSDAY, LabelName.DESSERT, IndexNumber.TWO),

            this.webMealResult( WeekDayIndex.FRIDAY, LabelName.MEAL_OF_THE_DAY, IndexNumber.ONE),
            this.webMealResult( WeekDayIndex.FRIDAY, LabelName.MEAL_OF_THE_DAY, IndexNumber.TWO),
            this.webMealResult( WeekDayIndex.FRIDAY, LabelName.VEGETARIAN, IndexNumber.ONE),
            this.webMealResult( WeekDayIndex.FRIDAY, LabelName.VEGETARIAN, IndexNumber.TWO),
            this.webMealResult( WeekDayIndex.FRIDAY, LabelName.SUPPER, IndexNumber.ONE),
            this.webMealResult( WeekDayIndex.FRIDAY, LabelName.SUPPER, IndexNumber.TWO),
            this.webMealResult( WeekDayIndex.FRIDAY, LabelName.DESSERT, IndexNumber.ONE),
            this.webMealResult( WeekDayIndex.FRIDAY, LabelName.DESSERT, IndexNumber.TWO),

            this.webMealResult( WeekDayIndex.SATURDAY, LabelName.MEAL_OF_THE_DAY, IndexNumber.ONE),
            this.webMealResult( WeekDayIndex.SATURDAY, LabelName.MEAL_OF_THE_DAY, IndexNumber.TWO),
            this.webMealResult( WeekDayIndex.SATURDAY, LabelName.VEGETARIAN, IndexNumber.ONE),
            this.webMealResult( WeekDayIndex.SATURDAY, LabelName.VEGETARIAN, IndexNumber.TWO),
            this.webMealResult( WeekDayIndex.SATURDAY, LabelName.SUPPER, IndexNumber.ONE),
            this.webMealResult( WeekDayIndex.SATURDAY, LabelName.SUPPER, IndexNumber.TWO),
            this.webMealResult( WeekDayIndex.SATURDAY, LabelName.DESSERT, IndexNumber.ONE),
            this.webMealResult( WeekDayIndex.SATURDAY, LabelName.DESSERT, IndexNumber.TWO),

            this.webMealResult( WeekDayIndex.SUNDAY, LabelName.MEAL_OF_THE_DAY, IndexNumber.ONE),
            this.webMealResult( WeekDayIndex.SUNDAY, LabelName.MEAL_OF_THE_DAY, IndexNumber.TWO),
            this.webMealResult( WeekDayIndex.SUNDAY, LabelName.VEGETARIAN, IndexNumber.ONE),
            this.webMealResult( WeekDayIndex.SUNDAY, LabelName.VEGETARIAN, IndexNumber.TWO),
            this.webMealResult( WeekDayIndex.SUNDAY, LabelName.SUPPER, IndexNumber.ONE),
            this.webMealResult( WeekDayIndex.SUNDAY, LabelName.SUPPER, IndexNumber.TWO),
            this.webMealResult( WeekDayIndex.SUNDAY, LabelName.DESSERT, IndexNumber.ONE),
            this.webMealResult( WeekDayIndex.SUNDAY, LabelName.DESSERT, IndexNumber.TWO),
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
                const rP = this.regexProvider( label, indexNumber);

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

        const descriptionRegexPattern = `(?<=${swedishWeekDayName})\\s+(.+?)\\s+(?=(?:Tis|Ons|Tors|Fre|Lör|Sön)dag|A-kost|$)`;

        const weekNumberRegexPattern = `(?<=\\s+Vecka)\\s+(\\d+)`;

        const result: IRegexDishProviderResult = {
            descriptionRegex: new RegExp(descriptionRegexPattern, "gmi"),
            price_SEKRegex: new RegExp( price_SEKRegexPattern, "gmi"),
            weekNumberRegex: RegExp(weekNumberRegexPattern, "gmi"),
        };

        return result;
    }

    private regexProvider( label: LabelName, indexNumber: IndexNumber ): IRegexDishProviderResult {

        const price_SEKRegexPattern = "";
        let descriptionRegexPattern = "";

        switch ( label ) {
            case LabelName.VEGETARIAN:
                descriptionRegexPattern =
                    `^(?:.*?(?:${this.getSwedishLabelNameOnPathotellundRestaurang( label )})){${indexNumber.toString()}}`;
                break;
            default:
                descriptionRegexPattern =
                    `(?:${this.getSwedishLabelNameOnPathotellundRestaurang( label )}\\s+${indexNumber.toString()})`;
                break;
        }

        descriptionRegexPattern += 
            `\\s+(.+?)\\s*?` + 
            `(?=(?:${ this.getSwedishLabelNameOnPathotellundRestaurang( LabelName.MEAL_OF_THE_DAY )}\\s+\\d` + '|' + `${this.getSwedishLabelNameOnPathotellundRestaurang( LabelName.VEGETARIAN )}` + '|' + `${this.getSwedishLabelNameOnPathotellundRestaurang( LabelName.SUPPER )}\\s+\\d` + '|' + `${this.getSwedishLabelNameOnPathotellundRestaurang( LabelName.DESSERT )}\\s+\\d` + '|' + '$)' + ')';


        const weekNumberRegexPattern = `(?<=\\s+[Vv]ecka)\\s+(\\d+)`;

        const result: IRegexDishProviderResult = {
            descriptionRegex: new RegExp(descriptionRegexPattern, "gmi"),
            price_SEKRegex: new RegExp( price_SEKRegexPattern, "gmi"),
            weekNumberRegex: RegExp(weekNumberRegexPattern, "gm"),
        };

        return result;
    }

};
