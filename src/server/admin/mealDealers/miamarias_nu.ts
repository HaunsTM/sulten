import { EnumDishLabel } from "../../enum/dishLabel.enu";
import { EnumWeekDay } from "../../enum/weekday.enu";
import { IHtmlFetcherHelper } from "../../interfaces/htmlFetcherHelper.itf";
import { IWebMealResult } from "../../interfaces/webMealResult.itf";
import { IWebMenuDealer } from "../../interfaces/webMenuDealer.itf";
import { IXPathDishProviderResult } from "../../interfaces/xpathDishProviderResult.itf";
import { Dish } from "../../oRModels/dish.mdl";
import { WebMealResult } from "./webMealResult";

export class Miamarias_Nu implements IWebMenuDealer {

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
            this.webMealResult( htmlDocumentFromWeb, EnumWeekDay.MONDAY, EnumDishLabel.FISH_AND_SEAFOOD),
            this.webMealResult( htmlDocumentFromWeb,EnumWeekDay.MONDAY, EnumDishLabel.MEAT),
            this.webMealResult( htmlDocumentFromWeb,EnumWeekDay.MONDAY, EnumDishLabel.VEGETARIAN),
            
            this.webMealResult( htmlDocumentFromWeb,EnumWeekDay.TUESDAY, EnumDishLabel.FISH_AND_SEAFOOD),
            this.webMealResult( htmlDocumentFromWeb,EnumWeekDay.TUESDAY, EnumDishLabel.MEAT),
            this.webMealResult( htmlDocumentFromWeb,EnumWeekDay.TUESDAY, EnumDishLabel.VEGETARIAN),
            
            this.webMealResult( htmlDocumentFromWeb,EnumWeekDay.WEDNESDAY, EnumDishLabel.FISH_AND_SEAFOOD),
            this.webMealResult( htmlDocumentFromWeb,EnumWeekDay.WEDNESDAY, EnumDishLabel.MEAT),
            this.webMealResult( htmlDocumentFromWeb,EnumWeekDay.WEDNESDAY, EnumDishLabel.VEGETARIAN),
            
            this.webMealResult( htmlDocumentFromWeb,EnumWeekDay.THURSDAY, EnumDishLabel.FISH_AND_SEAFOOD),
            this.webMealResult( htmlDocumentFromWeb,EnumWeekDay.THURSDAY, EnumDishLabel.MEAT),
            this.webMealResult( htmlDocumentFromWeb,EnumWeekDay.THURSDAY, EnumDishLabel.VEGETARIAN),
            
            this.webMealResult( htmlDocumentFromWeb,EnumWeekDay.FRIDAY, EnumDishLabel.FISH_AND_SEAFOOD),
            this.webMealResult( htmlDocumentFromWeb,EnumWeekDay.FRIDAY, EnumDishLabel.MEAT),
            this.webMealResult( htmlDocumentFromWeb,EnumWeekDay.FRIDAY, EnumDishLabel.VEGETARIAN),
        ];

        return mealsForAWeek;
    }

    private async webMealResult( htmlDocumentFromWeb: Document, weekDay: EnumWeekDay, label: EnumDishLabel ): Promise<IWebMealResult> {

        let dish: Dish = null;
        let webMealResult: WebMealResult = null;
        
        let swedishDishLabelOnMiaMarias = this.getSwedishDishLabelOnMiaMarias( label );
        let swedishWeekDayName = this.getSwedishWeekDayNameOnMiaMarias( weekDay );

        try {
            dish = await this.getDish( htmlDocumentFromWeb, swedishWeekDayName, swedishDishLabelOnMiaMarias );
            webMealResult =
                new WebMealResult( this._htmlFetcherHelper.url, dish.description, dish.price_SEK, label, weekDay, this._weekIndex, null);
        } catch ( e ) {
            console.log(e.message);
            webMealResult =
                new WebMealResult( this._htmlFetcherHelper.url, "", "", label, weekDay, this._weekIndex, e);
        }

        return webMealResult;
    }

    private getSwedishWeekDayNameOnMiaMarias( weekDay: EnumWeekDay ): string {
        let swedishWeekDayName = "";

        switch ( weekDay ) { 
            case EnumWeekDay.MONDAY :
                swedishWeekDayName = "Måndag";
                break;
            case EnumWeekDay.TUESDAY :
                swedishWeekDayName = "Tisdag";
                break;
            case EnumWeekDay.WEDNESDAY :
                swedishWeekDayName = "Onsdag";
                break;
            case EnumWeekDay.THURSDAY :
                swedishWeekDayName = "Torsdag";
                break;
            case EnumWeekDay.FRIDAY :
                swedishWeekDayName = "Fredag";
                break;
        }
        return swedishWeekDayName;
    } 

    private getSwedishDishLabelOnMiaMarias( label: EnumDishLabel ): string {
        let swedishDishLabel = "";

        switch ( label ) {
            case EnumDishLabel.FISH_AND_SEAFOOD:
                swedishDishLabel = "Fisk";
                break;
            case EnumDishLabel.MEAT:
                swedishDishLabel = "Kött";
                break;
            case EnumDishLabel.VEGETARIAN:
                swedishDishLabel = "Vegetarisk";
                break;
        }

        return swedishDishLabel;
    }

    private async getDish( htmlDocumentFromWeb: Document, swedishWeekDayName: string, swedishDishLabelOnMiaMarias: string ): Promise<Dish> {
        const xpath = this.xpathProvider( swedishWeekDayName, swedishDishLabelOnMiaMarias );

        const idDish: number = null;
        let descriptionDish = "";
        let price_SEKDish = "";

        try {
            descriptionDish = this._htmlFetcherHelper.textContentFromHtmlDocument( htmlDocumentFromWeb, xpath.descriptionXPath );
        } catch ( e ) {
            console.log(e.message);
        }
        try {
            price_SEKDish = ( this._htmlFetcherHelper.textContentFromHtmlDocument( htmlDocumentFromWeb, xpath.price_SEKXPath )).match(/\d+(?=\s?kr)/)[0];

        } catch ( e ) {
            console.log(e.message);
        }

        return new Dish( idDish, descriptionDish, price_SEKDish);
    }

    private xpathProvider( swedishWeekDayName: string, swedishDishLabelOnMiaMarias: string): IXPathDishProviderResult {

        const result: IXPathDishProviderResult = {
            descriptionXPath: `//h5[contains(.,'${swedishWeekDayName}')]/ancestor::div[contains(@class,"et_pb_module")]//tr[td[contains(.,'${swedishDishLabelOnMiaMarias}')][contains(.,"kr")]]/following-sibling::tr`,
            price_SEKXPath: `//h5[contains(.,'${swedishWeekDayName}')]/ancestor::div[contains(@class,"et_pb_module")]//tr[td[contains(.,'${swedishDishLabelOnMiaMarias}')][contains(.,"kr")]]`,
        };

        return result;
    }

}
