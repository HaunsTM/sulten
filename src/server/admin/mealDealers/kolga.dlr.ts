import { EnumDishLabel } from "../../enum/dishLabel.enu";
import { EnumWeekDay } from "../../enum/weekday.enu";
import { IHtmlFetcherHelper } from "../../interfaces/htmlFetcherHelper.itf";
import { IWebMealDealer } from "../../interfaces/webMealDealer.itf";
import { IWebMealResult } from "../../interfaces/webMealResult.itf";
import { IXPathDishProviderResult } from "../../interfaces/xpathDishProviderResult.itf";
import { Dish } from "../../repository/entities/dish.mdl";
import { WebMealResult } from "./webMealResult";

export class KolgaDealer implements IWebMealDealer {

    private _htmlFetcherHelper: IHtmlFetcherHelper = null;
    private _weekIndex: number = -1;

    constructor(htmlFetcherHelper: IHtmlFetcherHelper,
                weekIndex: number) {

        this._htmlFetcherHelper = htmlFetcherHelper;
        this._weekIndex = weekIndex;
    }

    public async mealsFromWeb(): Promise<IWebMealResult[]> {

        const htmlDocumentFromWeb = await this._htmlFetcherHelper.htmlDocumentFromWeb();
        const mealsForAWeekPromise =  this.getWebMealResultAForAWeek( htmlDocumentFromWeb );
        const mealsForAWeek = await Promise.all(mealsForAWeekPromise);
        return mealsForAWeek;
    }

    private getWebMealResultAForAWeek( htmlDocumentFromWeb: Document ): Array<Promise<IWebMealResult>> {

        const mealsForAWeek: Array<Promise<IWebMealResult>>  = [
            this.webMealResult( htmlDocumentFromWeb, EnumWeekDay.MONDAY, EnumDishLabel.MEAL_OF_THE_DAY, 1),
            this.webMealResult( htmlDocumentFromWeb, EnumWeekDay.MONDAY, EnumDishLabel.MEAL_OF_THE_DAY, 2),

            this.webMealResult( htmlDocumentFromWeb, EnumWeekDay.TUESDAY, EnumDishLabel.MEAL_OF_THE_DAY, 1),
            this.webMealResult( htmlDocumentFromWeb, EnumWeekDay.TUESDAY, EnumDishLabel.MEAL_OF_THE_DAY, 2),

            this.webMealResult( htmlDocumentFromWeb, EnumWeekDay.WEDNESDAY, EnumDishLabel.MEAL_OF_THE_DAY, 1),
            this.webMealResult( htmlDocumentFromWeb, EnumWeekDay.WEDNESDAY, EnumDishLabel.MEAL_OF_THE_DAY, 2),

            this.webMealResult( htmlDocumentFromWeb, EnumWeekDay.THURSDAY, EnumDishLabel.MEAL_OF_THE_DAY, 1),
            this.webMealResult( htmlDocumentFromWeb, EnumWeekDay.THURSDAY, EnumDishLabel.MEAL_OF_THE_DAY, 2),

            this.webMealResult( htmlDocumentFromWeb, EnumWeekDay.FRIDAY, EnumDishLabel.MEAL_OF_THE_DAY, 1),
            this.webMealResult( htmlDocumentFromWeb, EnumWeekDay.FRIDAY, EnumDishLabel.MEAL_OF_THE_DAY, 2),
        ];

        return mealsForAWeek;
    }

    private async webMealResult( htmlDocumentFromWeb: Document, weekDay: EnumWeekDay, label: EnumDishLabel,  menuAlternativeIndex: number): Promise<IWebMealResult> {

        let dish: Dish = null;
        let webMealResult: WebMealResult = null;

        const swedishWeekDayNameOnKolga = this.getSwedishWeekDayNameOnKolga( weekDay );

        try {
            dish = await this.getDish( htmlDocumentFromWeb, swedishWeekDayNameOnKolga, menuAlternativeIndex );

            webMealResult =
                new WebMealResult( this._htmlFetcherHelper.url, dish.description, dish.priceSEK, label, weekDay, this._weekIndex, null);
        } catch ( e ) {
            webMealResult =
                new WebMealResult( this._htmlFetcherHelper.url, "", "", label, weekDay, this._weekIndex, e);
        }

        return webMealResult;
    }

    private getSwedishWeekDayNameOnKolga( weekDay: EnumWeekDay ): string {
        let swedishWeekDayName = "";

        switch ( weekDay ) {
            case EnumWeekDay.MONDAY :
                swedishWeekDayName = "måndag";
                break;
            case EnumWeekDay.TUESDAY :
                swedishWeekDayName = "tisdag";
                break;
            case EnumWeekDay.WEDNESDAY :
                swedishWeekDayName = "onsdag";
                break;
            case EnumWeekDay.THURSDAY :
                swedishWeekDayName = "torsdag";
                break;
            case EnumWeekDay.FRIDAY :
                swedishWeekDayName = "fredag";
                break;
        }
        return swedishWeekDayName;
    }

    private async getDish( htmlDocumentFromWeb: Document, weekDayName: string, menuAlternativeIndex: number): Promise<Dish> {
        const xpath = this.xpathProvider(weekDayName, menuAlternativeIndex);

        const idDish: number = null;
        const descriptionDish = this._htmlFetcherHelper.textContentFromHtmlDocument( htmlDocumentFromWeb, xpath.descriptionXPath);
        const price_SEKDish = this._htmlFetcherHelper.textContentFromHtmlDocument( htmlDocumentFromWeb, xpath.price_SEKXPath);

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
