import { FetcherType } from "../../enum/FetcherType";
import { IndexNumber } from "../../enum/IndexNumber";
import { LabelName } from "../../enum/LabelName";
import { WeekDayIndex } from "../../enum/WeekDayIndex";
import { IHtmlDocumentParser } from "../../interfaces/IHtmlDocumentParser";
import { IMenuUrlDynamicData } from "../../interfaces/IMenuUrlDynamicData";
import { IWebMealDealerStatic } from "../../interfaces/IWebMealDealerStatic";
import { IWebMealResult } from "../../interfaces/IWebMealResult";
import { IXPathDishProviderResult } from "../../interfaces/IXpathDishProviderResult";
import { WebMealResult } from "../WebMealResult";
import { BistroALundCentralhallenLocal } from "./BistroALundCentralhallen";
import { DishPriceWeekNumber } from "./DishPriceWeekNumber";

export const BistroALundMatakutenDealer: IWebMealDealerStatic =
    class BistroALundMatakutenLocal extends BistroALundCentralhallenLocal {

    public static get baseUrlStatic(): string {
        const baseUrl = "https://www.fazer.se/api/location/menurss/current?pageId=28012&language=sv&restaurant=matakuten";
        return baseUrl;
    }

    public static get fetcherTypeNeededStatic(): FetcherType {
        return FetcherType.RSS;
    }
    public static async menuUrlStatic(
        pageWhereToFindMenuUrl: IHtmlDocumentParser, menuUrlDynamicData: IMenuUrlDynamicData): Promise<string> {
        return pageWhereToFindMenuUrl.htmlDocument.URL;
    }

    protected get restaurantIndex(): number { return 2; }

    constructor(
        dealerData: IHtmlDocumentParser,
        baseUrl: string,
        weekYear: string,
        weekNumberExpected: string) {

        super(
            dealerData,
            baseUrl,
            weekYear,
            weekNumberExpected);
    }

    public async mealsFromWeb(): Promise<IWebMealResult[]> {
        const restaurantIndex = this.restaurantIndex;
        const mealsForAWeekPromise =  this.getWebMealResultAForAWeek(restaurantIndex);
        const mealsForAWeek = await Promise.all(mealsForAWeekPromise);
        return mealsForAWeek;
    }

    protected getWebMealResultAForAWeek(restaurantIndex: number): Array<Promise<IWebMealResult>> {

        const mealsForAWeek: Array<Promise<IWebMealResult>>  = [
            super.webMealResult( restaurantIndex, WeekDayIndex.MONDAY, LabelName.MEAL_OF_THE_DAY, IndexNumber.ONE),

            super.webMealResult( restaurantIndex, WeekDayIndex.TUESDAY, LabelName.MEAL_OF_THE_DAY, IndexNumber.ONE),

            super.webMealResult( restaurantIndex, WeekDayIndex.WEDNESDAY, LabelName.MEAL_OF_THE_DAY, IndexNumber.ONE),

            super.webMealResult( restaurantIndex, WeekDayIndex.THURSDAY, LabelName.MEAL_OF_THE_DAY, IndexNumber.ONE),

            super.webMealResult( restaurantIndex, WeekDayIndex.FRIDAY, LabelName.MEAL_OF_THE_DAY, IndexNumber.ONE),
        ];

        return mealsForAWeek;
    }

};
