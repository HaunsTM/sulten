import { FetcherType } from "../../enum/FetcherType";
import { IndexNumber } from "../../enum/IndexNumber";
import { LabelName } from "../../enum/LabelName";
import { WeekDayIndex } from "../../enum/WeekDayIndex";
import { IDealerResult } from "../../interfaces/IDealerResult";
import { IHtmlDocumentParser } from "../../interfaces/IHtmlDocumentParser";
import { IMenuUrlDynamicData } from "../../interfaces/IMenuUrlDynamicData";
import { IWebMealDealerStatic } from "../../interfaces/IWebMealDealerStatic";
import { IWebMealResult } from "../../interfaces/IWebMealResult";
import { DealerResult } from "../DealerResult";
import { BistroALundCentralhallenLocal } from "./BistroALundCentralhallen";

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

    public async mealsFromWeb(): Promise<IDealerResult> {
        const restaurantIndex = this.restaurantIndex;
        const mealsForAWeekPromise =  this.getWebMealResultAForAWeek(restaurantIndex);
        const dealerResult = new DealerResult( BistroALundMatakutenDealer.baseUrlStatic, mealsForAWeekPromise );

        return dealerResult;
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
