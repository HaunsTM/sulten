import { EnumDishLabel } from "../../enum/dishLabel.enu";
import { IHtmlFetcherHelper } from "../../interfaces/htmlFetcherHelper.itf";
import { IWeekDayHelper } from "../../interfaces/weekDayHelper.itf";
import { IWebMealResult } from "../../interfaces/webMealResult.itf";
import { IWebMenuDealer } from "../../interfaces/webMenuDealer.itf";
import { IXPathDishProviderResult } from "../../interfaces/xpathDishProviderResult.itf";
import { Dish } from "../../oRModels/dish.mdl";
import { Label } from "../../oRModels/label.mdl";
import { WebMealResult } from "./webMealResult";
import { WeekIndex } from "../../oRModels/weekIndex.mdl";

export class KolgaGastroGate implements IWebMenuDealer {

    private _htmlFetcherHelper: IHtmlFetcherHelper = null;
    private _weekDayHelper: IWeekDayHelper = null;
    private _weekIndex: WeekIndex = null;

    constructor(htmlFetcherHelper: IHtmlFetcherHelper,
                weekDayHelper: IWeekDayHelper,
                weekIndex: WeekIndex) {

        this._htmlFetcherHelper = htmlFetcherHelper;
        this._weekDayHelper = weekDayHelper;
        this._weekIndex = weekIndex;
    }

    public async mealsFromWeb(): Promise<IWebMealResult[]> {

        const mealsForAWeekPromise =  this.getWebMealResultAForAWeek();
        const mealsForAWeek = await Promise.all(mealsForAWeekPromise);
        return mealsForAWeek;
    }

    private getWebMealResultAForAWeek(): Array<Promise<IWebMealResult>> {

        const mealsForAWeek: Array<Promise<IWebMealResult>>  = [
            this.webMealResult("måndag", 1),
            this.webMealResult("måndag", 2),
            this.webMealResult("tisdag", 1),
            this.webMealResult("tisdag", 2),
            this.webMealResult("onsdag", 1),
            this.webMealResult("onsdag", 2),
            this.webMealResult("torsdag", 1),
            this.webMealResult("torsdag", 2),
            this.webMealResult("fredag", 1),
            this.webMealResult("fredag", 2),
        ];

        return mealsForAWeek;
    }

    private async webMealResult(weekDayName: string, menuAlternativeIndex: number): Promise<IWebMealResult> {

        const label = new Label( null, EnumDishLabel.PLAIN );
        let dish: Dish = null;
        let fetchError: Error = null;

        try {
                dish = await this.getDish( weekDayName, menuAlternativeIndex );
        } catch ( e ) {
                fetchError = e;
        }

        const weekDay =  this._weekDayHelper.getWeekDay( weekDayName );

        const webMealResult =
            new WebMealResult( this._htmlFetcherHelper.url, dish, label, weekDay, this._weekIndex, fetchError );

        return webMealResult;
    }

    private async getDish(weekDayName: string, menuAlternativeIndex: number): Promise<Dish> {
        const xpath = this.xpathProvider(weekDayName, menuAlternativeIndex);

        const idDish: number = null;
        const descriptionDish = await this._htmlFetcherHelper.textContentFromHtmlDocument(xpath.descriptionXPath);
        const price_SEKDish = await this._htmlFetcherHelper.textContentFromHtmlDocument(xpath.price_SEKXPath);

        return new Dish( idDish, descriptionDish, price_SEKDish);
    }

    private xpathProvider(weekDayName: string, menuAlternativeIndex: number): IXPathDishProviderResult {

        const result: IXPathDishProviderResult = {
            descriptionXPath: `(//table/thead[tr/th/h3[contains(.,'${weekDayName}')]]/following-sibling::tbody[1]//td[@class='td_title'])[${menuAlternativeIndex}]`,
            price_SEKXPath: `(//table/thead[tr/th/h3[contains(.,'${weekDayName}')]]/following-sibling::tbody[1]//td[@class='td_price'])[${menuAlternativeIndex}]`,
        };

        return result;
    }

}
