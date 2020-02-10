import moment from "moment";
import { FetcherType } from "../../enum/FetcherType";
import { IndexNumber } from "../../enum/IndexNumber";
import { LabelName } from "../../enum/LabelName";
import { WeekDayIndex } from "../../enum/WeekDayIndex";
import { EpochHelper } from "../../helpers/EpochHelper";
import { HtmlDocumentParser } from "../../helpers/HtmlDocumentParser";
import { IEpochHelper } from "../../interfaces/IEpochHelper";
import { IHtmlDocumentParser } from "../../interfaces/IHtmlDocumentParser";
import { IMenuUrlDynamicData } from "../../interfaces/IMenuUrlDynamicData";
import { IWebMealDealerStatic } from "../../interfaces/IWebMealDealerStatic";
import { IWebMealResult } from "../../interfaces/IWebMealResult";
import { IXPathDishProviderResult } from "../../interfaces/IXpathDishProviderResult";
import { WebMealResult } from "../WebMealResult";
import { DishPriceWeekNumber } from "./DishPriceWeekNumber";

export const ScotlandYardDealer: IWebMealDealerStatic =  class ScotlandYardDealerLocal {

    public static get baseUrlStatic(): string {
        const baseUrl = "https://www.fazerfoodco.se/restauranger/restauranger/scotland-yard/";
        return baseUrl;
    }

    public static get fetcherTypeNeededStatic(): FetcherType {
        return FetcherType.JSON_API;
    }

    public static async menuUrlStatic(
        pageWhereToFindMenuUrl: IHtmlDocumentParser, menuUrlDynamicData: IMenuUrlDynamicData): Promise<string> {
        const apiUrl = "https://www.fazerfoodco.se/api/restaurant/menu/week?language=sv&restaurantPageId=188211&";
        const epochHelper = new EpochHelper();
        const dateMondayMenuWeek = epochHelper.getDate(1, +menuUrlDynamicData.weekIndex, +menuUrlDynamicData.weekYear);

        const year = (dateMondayMenuWeek.getFullYear()).toString();
        const monthIndex = (dateMondayMenuWeek.getMonth() + 1).toString();
        const date = (dateMondayMenuWeek.getDate()).toString();
        const menuUrl = `${apiUrl}&weekDate=${year}-${monthIndex}-${date}`;

        return menuUrl;
    }

    private baseUrl: string;
    private dealerData: IMenuData = null;
    private epochHelper: IEpochHelper = null;
    private weekNumberExpected: string = "";
    private weekYear: string = "";

    constructor(
        dealerData: {},
        baseUrl: string,
        weekYear: string,
        weekNumberExpected: string) {

        this.baseUrl = baseUrl;
        this.dealerData = dealerData as IMenuData;
        this.weekYear = weekYear;
        this.weekNumberExpected = weekNumberExpected;

        this.epochHelper = new EpochHelper();

    }

    public async mealsFromWeb(): Promise<IWebMealResult[]> {

        const mealsForAWeekPromise =  this.getWebMealResultAForAWeek();
        const mealsForAWeek = await Promise.all(mealsForAWeekPromise);

        return mealsForAWeek;
    }

    private getWebMealResultAForAWeek( ): Array<Promise<IWebMealResult>> {

        const mealsForAWeek: Array<Promise<IWebMealResult>>  = [
            this.webMealResult( WeekDayIndex.MONDAY, LabelName.VEGETARIAN, IndexNumber.ONE),
            this.webMealResult( WeekDayIndex.MONDAY, LabelName.MEAL_OF_THE_DAY, IndexNumber.ONE),
            this.webMealResult( WeekDayIndex.MONDAY, LabelName.MEAL_OF_THE_DAY, IndexNumber.TWO),
            this.webMealResult( WeekDayIndex.MONDAY, LabelName.SOUP, IndexNumber.ONE),

            this.webMealResult( WeekDayIndex.TUESDAY, LabelName.VEGETARIAN, IndexNumber.ONE),
            this.webMealResult( WeekDayIndex.TUESDAY, LabelName.MEAL_OF_THE_DAY, IndexNumber.ONE),
            this.webMealResult( WeekDayIndex.TUESDAY, LabelName.MEAL_OF_THE_DAY, IndexNumber.TWO),
            this.webMealResult( WeekDayIndex.TUESDAY, LabelName.SOUP, IndexNumber.ONE),

            this.webMealResult( WeekDayIndex.WEDNESDAY, LabelName.VEGETARIAN, IndexNumber.ONE),
            this.webMealResult( WeekDayIndex.WEDNESDAY, LabelName.MEAL_OF_THE_DAY, IndexNumber.ONE),
            this.webMealResult( WeekDayIndex.WEDNESDAY, LabelName.MEAL_OF_THE_DAY, IndexNumber.TWO),
            this.webMealResult( WeekDayIndex.WEDNESDAY, LabelName.SOUP, IndexNumber.ONE),

            this.webMealResult( WeekDayIndex.THURSDAY, LabelName.VEGETARIAN, IndexNumber.ONE),
            this.webMealResult( WeekDayIndex.THURSDAY, LabelName.MEAL_OF_THE_DAY, IndexNumber.ONE),
            this.webMealResult( WeekDayIndex.THURSDAY, LabelName.MEAL_OF_THE_DAY, IndexNumber.TWO),
            this.webMealResult( WeekDayIndex.THURSDAY, LabelName.SOUP, IndexNumber.ONE),

            this.webMealResult( WeekDayIndex.FRIDAY, LabelName.VEGETARIAN, IndexNumber.ONE),
            this.webMealResult( WeekDayIndex.FRIDAY, LabelName.MEAL_OF_THE_DAY, IndexNumber.ONE),
            this.webMealResult( WeekDayIndex.FRIDAY, LabelName.MEAL_OF_THE_DAY, IndexNumber.TWO),
            this.webMealResult( WeekDayIndex.FRIDAY, LabelName.SOUP, IndexNumber.ONE),
        ];

        return mealsForAWeek;
    }

    private getDateBasedOnExpectedWeek(javascriptDayIndex: number): Date {
        return this.epochHelper.getDate(javascriptDayIndex, +this.weekNumberExpected, +this.weekYear);
    }

    private async webMealResult( weekDayJavascriptDayIndex: WeekDayIndex,
                                 label: LabelName, indexNumber: IndexNumber): Promise<IWebMealResult> {

        let dishPriceWeekNumber: DishPriceWeekNumber = null;
        let webMealResult: WebMealResult = null;
        const weekDayDate = moment(this.getDateBasedOnExpectedWeek(weekDayJavascriptDayIndex)).format("YYYY-MM-DD");

        try {
            dishPriceWeekNumber =
                await this.getDishPriceWeekNumber( weekDayDate, label, indexNumber );

            if ( dishPriceWeekNumber.fetchError ) {
                throw dishPriceWeekNumber.fetchError;
            }

            if ( this.weekNumberExpected !== dishPriceWeekNumber.weekIndexWeekNumber) {
                throw new Error(`Expected to see menu for week ${this.weekNumberExpected}, but found week ${ dishPriceWeekNumber.weekIndexWeekNumber}`);
            }

            webMealResult =
                new WebMealResult(
                    this.baseUrl, dishPriceWeekNumber.dishDescription,
                    dishPriceWeekNumber.priceSEK, indexNumber, label, weekDayJavascriptDayIndex,
                    dishPriceWeekNumber.weekIndexWeekNumber, this.weekYear, null);

        } catch ( e ) {
            webMealResult =
                new WebMealResult( this.baseUrl, "", "", indexNumber, label,
                    weekDayJavascriptDayIndex, this.weekNumberExpected, this.weekYear, e);
        }

        return webMealResult;

    }

    private async getDishPriceWeekNumber(
        weekDayDate: string, label: LabelName, alternativeIndex: IndexNumber ): Promise<DishPriceWeekNumber> {

        let dishDescription: string;
        let priceSEK: string;
        let weekIndexWeekNumber: string;
        let fetchError: Error;

        let dishPriceWeekNumber: DishPriceWeekNumber = null;

        const xpath = this.xpathProvider( label, alternativeIndex );

        try {
            dishDescription =
                await this.getCurrentDishDescription(weekDayDate, xpath.descriptionXPath);

            priceSEK = "";

            weekIndexWeekNumber =
                this.currentWeekNumber.toString();
        } catch ( error ) {
            fetchError = error;
        }

        dishPriceWeekNumber = new DishPriceWeekNumber(dishDescription, priceSEK, weekIndexWeekNumber, fetchError );

        return dishPriceWeekNumber;

    }

    private getXpathDishLabelIndex( label: LabelName, indexNumber: IndexNumber ): string {

        let labelIndex = -1;

        switch (label) {

            case LabelName.VEGETARIAN:
                switch (indexNumber) {
                    case IndexNumber.ONE:
                        labelIndex = 0;
                        break;
                    default:
                        throw Error(`Bad indexNumber = ${indexNumber} for label ${label}`);
                }
                break;

            case LabelName.MEAL_OF_THE_DAY:
                switch (indexNumber) {
                    case IndexNumber.ONE:
                        labelIndex = 1;
                        break;
                    case IndexNumber.TWO:
                        labelIndex = 2;
                        break;
                    default:
                        throw Error(`Bad indexNumber = ${indexNumber} for label ${label}`);
                }
                break;

            case LabelName.SOUP:
                switch (indexNumber) {
                    case IndexNumber.ONE:
                        labelIndex = 3;
                    default:
                        throw Error(`Bad indexNumber = ${indexNumber} for label ${label}`);
                }
                break;

            default:
                throw Error(`Bad label ${label}`);
        }

        return labelIndex.toString();
    }

    private xpathProvider(label: LabelName, indexNumber: IndexNumber): IXPathDishProviderResult {

        let result: IXPathDishProviderResult;
        const labelIndex = this.getXpathDishLabelIndex(label, indexNumber);

        result = {
            descriptionXPath: `//p/text()[${labelIndex}]`,
            labelXPath: null,
            price_SEKXPath: null,
            weekNumberXPath: null,
        };

        return result;
    }

    private get currentWeekNumber(): number {
        return this.dealerData.WeekNumber;
    }

    private getCurrentLunchMenuDOM(weekDayDate: string): Document {
        const currentLunchHtml = this.dealerData.LunchMenus.find( (l) => {
            const found = l.Date === weekDayDate;
            return found;
        }).Html;
        const currentLunchDOM = HtmlDocumentParser.string2document(currentLunchHtml);
        return currentLunchDOM;
    }

    private async getCurrentDishDescription(weekDayDate: string, dishDescriptionXPath: string ): Promise<string> {
        const currentLunchDOM = this.getCurrentLunchMenuDOM(weekDayDate);
        const currentLunchDOMParser = new HtmlDocumentParser(currentLunchDOM);
        const dishDescription = await currentLunchDOMParser.textContentFromHtmlDocument(dishDescriptionXPath);
        return dishDescription;
    }
};

// tslint:disable-next-line:interface-name
interface LunchMenu {
    DayOfWeek: string;
    Date: string;
    SetMenus: any[];
    Html: string;
}

// tslint:disable-next-line:interface-name
interface RequireDietFilter {
    Name: string;
    TranslatedName: string;
    Diet: string;
    Selected: boolean;
    Inactive: boolean;
    AdditionalVisibleDiets: string[];
}

// tslint:disable-next-line:interface-name
interface ExcludeDietFilter {
    Name: string;
    TranslatedName: string;
    Diet: string;
    Selected: boolean;
    Inactive: boolean;
    AdditionalVisibleDiets: any[];
}

interface IMenuData {
    WeekNumber: number;
    LunchMenus: LunchMenu[];
    RequireDietFilters: RequireDietFilter[];
    ExcludeDietFilters: ExcludeDietFilter[];
    RestaurantDietFilters: any[];
    LastWeekMenuStartDate?: any;
    NextWeekMenuStartDate: string;
    ProductDataSheets: any[];
}
