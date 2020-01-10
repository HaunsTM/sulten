import { FetcherType } from "../../enum/FetcherType";
import { IndexNumber } from "../../enum/IndexNumber";
import { LabelName } from "../../enum/LabelName";
import { WeekDayIndex } from "../../enum/WeekDayIndex";
import { IHtmlDocumentParser } from "../../interfaces/IHtmlDocumentParser";
import { IMenuUrlDynamicData } from "../../interfaces/IMenuUrlDynamicData";
import { IRSSFetcherHelper } from "../../interfaces/IRSSFetcherHelper";
import { IWebMealDealerStatic } from "../../interfaces/IWebMealDealerStatic";
import { IWebMealResult } from "../../interfaces/IWebMealResult";
import { IXPathDishProviderResult } from "../../interfaces/IXpathDishProviderResult";
import { WebMealResult } from "../WebMealResult";
import { DishPriceWeekNumber } from "./DishPriceWeekNumber";

export class BistroALundCentralhallenLocal {

    public static get baseUrlStatic(): string {
        const baseUrl = "https://www.fazer.se/api/location/menurss/current?pageId=28012&language=sv&restaurant=centralhallen";
        return baseUrl;
    }

    public static get fetcherTypeNeededStatic(): FetcherType {
        return FetcherType.RSS;
    }

    protected get restaurantIndex(): number { return 1; }
    public static async menuUrlStatic(
        pageWhereToFindMenuUrl: IHtmlDocumentParser, menuUrlDynamicData: IMenuUrlDynamicData): Promise<string> {
        return pageWhereToFindMenuUrl.htmlDocument.URL;
    }

    private baseUrl: string;
    private dealerData: IHtmlDocumentParser = null;
    private weekNumberExpected: string = "";
    private weekYear: string = "";

    constructor(
        dealerData: IHtmlDocumentParser,
        baseUrl: string,
        weekYear: string,
        weekNumberExpected: string) {

        this.baseUrl = baseUrl;
        this.dealerData = dealerData;
        this.weekYear = weekYear;
        this.weekNumberExpected = weekNumberExpected;
    }

    public async mealsFromWeb(): Promise<IWebMealResult[]> {
        const restaurantIndex = this.restaurantIndex;
        const mealsForAWeekPromise =  this.getWebMealResultAForAWeek(restaurantIndex);
        const mealsForAWeek = await Promise.all(mealsForAWeekPromise);
        return mealsForAWeek;
    }

    public async webMealResult( restaurantIndex: number, weekDayJavascriptDayIndex: WeekDayIndex,
                                label: LabelName, indexNumber: IndexNumber): Promise<IWebMealResult> {

        let dishPriceWeekNumber: DishPriceWeekNumber = null;
        let webMealResult: WebMealResult = null;

        const swedishWeekDayName = this.getSwedishWeekDayName( weekDayJavascriptDayIndex );

        try {
            dishPriceWeekNumber =
                await this.getDishPriceWeekNumber(
                    restaurantIndex, this.weekNumberExpected, swedishWeekDayName, label );

            if ( dishPriceWeekNumber.fetchError ) {
                throw dishPriceWeekNumber.fetchError;
            }

            if ( this.weekNumberExpected !== dishPriceWeekNumber.weekIndexWeekNumber) {
                throw new Error(`Expected to see menu for week ${this.weekNumberExpected}, but found week ${dishPriceWeekNumber.weekIndexWeekNumber}`);
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

    protected getWebMealResultAForAWeek(restaurantIndex: number): Array<Promise<IWebMealResult>> {

        const mealsForAWeek: Array<Promise<IWebMealResult>>  = [
            this.webMealResult( restaurantIndex, WeekDayIndex.MONDAY, LabelName.MEAL_OF_THE_DAY, IndexNumber.ONE),
            this.webMealResult( restaurantIndex, WeekDayIndex.MONDAY, LabelName.SALAD, IndexNumber.ONE),

            this.webMealResult( restaurantIndex, WeekDayIndex.TUESDAY, LabelName.MEAL_OF_THE_DAY, IndexNumber.ONE),
            this.webMealResult( restaurantIndex, WeekDayIndex.TUESDAY, LabelName.SALAD, IndexNumber.ONE),

            this.webMealResult( restaurantIndex, WeekDayIndex.WEDNESDAY, LabelName.MEAL_OF_THE_DAY, IndexNumber.ONE),
            this.webMealResult( restaurantIndex, WeekDayIndex.WEDNESDAY, LabelName.SALAD, IndexNumber.ONE),

            this.webMealResult( restaurantIndex, WeekDayIndex.THURSDAY, LabelName.MEAL_OF_THE_DAY, IndexNumber.ONE),
            this.webMealResult( restaurantIndex, WeekDayIndex.THURSDAY, LabelName.SALAD, IndexNumber.ONE),

            this.webMealResult( restaurantIndex, WeekDayIndex.FRIDAY, LabelName.MEAL_OF_THE_DAY, IndexNumber.ONE),
            this.webMealResult( restaurantIndex, WeekDayIndex.FRIDAY, LabelName.SALAD, IndexNumber.ONE),
        ];

        return mealsForAWeek;
    }

    private getSwedishWeekDayName( weekDayJavascriptDayIndex: WeekDayIndex ): string {
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

    private async getDishPriceWeekNumber(
        restaurantIndex: number, weekIndex: string,
        swedishWeekDayName: string, label: LabelName): Promise<DishPriceWeekNumber> {

        let dishDescription: string;
        let priceSEK: string;
        let weekIndexWeekNumber: string;
        let fetchError: Error;

        let dishPriceWeekNumber: DishPriceWeekNumber = null;

        const xpath = this.xpathProvider(restaurantIndex, weekIndex, swedishWeekDayName, label);

        const dishFilter = new RegExp(`(?:^${swedishWeekDayName})?[ ]*(.+)`, "g");
        try {
            const dishDescriptionRaw =
            ( await this.dealerData.textContentFromHtmlDocument( xpath.descriptionXPath ) );

            dishDescription = dishFilter.exec( dishDescriptionRaw )[1];

            priceSEK =
                ( await this.dealerData.textContentFromHtmlDocument( xpath.price_SEKXPath ) )
                .match(/\d+(?=\s?kr)/)[0];

            weekIndexWeekNumber =
                ( await this.dealerData.textContentFromHtmlDocument( xpath.weekNumberXPath ) )
                .match(/(?<=\s*Vecka\s*)\d+/)[0];

        } catch ( error ) {
            fetchError = error;
        }

        dishPriceWeekNumber = new DishPriceWeekNumber(dishDescription, priceSEK, weekIndexWeekNumber, fetchError );

        return dishPriceWeekNumber;
    }

    private xpathProvider(
        restaurantIndex: number, weekIndex: string,
        swedishWeekDayName: string, label: LabelName): IXPathDishProviderResult {

        const labelXPath: string = null;
        let descriptionXPath: string = "";
        let price_SEKXPath: string = "";
        let weekNumberXPath: string = "";

        switch ( label ) {
            case LabelName.MEAL_OF_THE_DAY:
                price_SEKXPath = "//text()[contains(.,'agens varmrätt')][contains(.,' kr')]";
                break;
            case LabelName.SALAD:
                price_SEKXPath = "//text()[contains(.,'eckans sallad')][contains(.,' kr')]";
                break;
        }

        switch ( restaurantIndex ) {

            case 1:
                weekNumberXPath = `//p[contains(.,'ecka ${weekIndex}')][1]/strong/text()`;
                switch ( label ) {
                    case LabelName.MEAL_OF_THE_DAY:
                        descriptionXPath = `//p[contains(.,'ecka ${weekIndex}')][1]/following-sibling::p[contains(.,'${swedishWeekDayName}')][1]/following-sibling::p[1]//text()`;
                        break;
                    case LabelName.SALAD:
                        descriptionXPath =
                            `//p[contains(.,'ecka ${weekIndex}')][1]/following-sibling::p[contains(.,'Fredag')][1]` +
                            "/following-sibling::p[contains(.,'eckans sallad')]/following-sibling::p[1]//text()";
                        break;
                }
                break;
            case 2:
                weekNumberXPath = `//p[contains(.,'EB-blocket')]/following-sibling::p[contains(.,'ecka ${weekIndex}')]//text()`;
                descriptionXPath = `//p[contains(.,'EB-blocket')]/following-sibling::p[contains(.,'${swedishWeekDayName}')][1]//text()`;
                break;

        }

        const result: IXPathDishProviderResult = {
            descriptionXPath,
            labelXPath,
            price_SEKXPath,
            weekNumberXPath,
        };

        return result;
    }

}

export const BistroALundCentralhallenDealer: IWebMealDealerStatic = BistroALundCentralhallenLocal;
