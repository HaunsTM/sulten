import { FetcherType } from "../../enum/FetcherType";
import { LabelName } from "../../enum/LabelName";
import { WeekDayIndex } from "../../enum/WeekDayIndex";
import { IDealerResult } from "../../interfaces/IDealerResult";
import { IHtmlDocumentParser } from "../../interfaces/IHtmlDocumentParser";
import { IMenuUrlDynamicData } from "../../interfaces/IMenuUrlDynamicData";
import { IWebMealDealerStatic } from "../../interfaces/IWebMealDealerStatic";
import { IWebMealResult } from "../../interfaces/IWebMealResult";
import { IXPathDishProviderResult } from "../../interfaces/IXpathDishProviderResult";
import { DealerResult } from "../DealerResult";
import { WebMealResult } from "../WebMealResult";
import { DishPriceWeekNumber } from "./DishPriceWeekNumber";

export const RestaurangNiagaraDealer: IWebMealDealerStatic =  class RestaurangNiagaraDealerLocal {

    public static get baseUrlStatic(): string {
        const baseUrl = "https://restaurangniagara.se/lunch/";
        return baseUrl;
    }

    public static get fetcherTypeNeededStatic(): FetcherType {
        return FetcherType.HTML;
    }

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

    public async mealsFromWeb(): Promise<IDealerResult> {

        const mealsForAWeekPromise =  await this.getWebMealResultAForAWeek();
        const dealerResult = new DealerResult( RestaurangNiagaraDealer.baseUrlStatic, mealsForAWeekPromise );

        return dealerResult;
    }
    private get allLunchDays(): WeekDayIndex[] {

        const allLunchDays: WeekDayIndex[] = [
            WeekDayIndex.MONDAY,
            WeekDayIndex.TUESDAY,
            WeekDayIndex.WEDNESDAY,
            WeekDayIndex.THURSDAY,
            WeekDayIndex.FRIDAY,
        ];

        return allLunchDays;
    }

    private async getWebMealResultAForAWeek(): Promise<Array<Promise<IWebMealResult>>> {

        const webMealResults: Array<Promise<IWebMealResult>> = new Array();

        for (let i = 0, len = this.allLunchDays.length; i < len; i++) {
            const currentDaysMealResults = await this.getWebMealResultForDay(this.allLunchDays[i]);
            webMealResults.concat(currentDaysMealResults);
        }
        return webMealResults;

    }

    private async getWebMealResultForDay(day: WeekDayIndex): Promise<Array<Promise<IWebMealResult>>> {

        const webMealResults: Array<Promise<IWebMealResult>> = new Array();

        const currentSwedishWeekDayName = this.getSwedishWeekDayNameOnRestaurangNiagara(day);
        const numberOfDishesCurrentDay = await this.mealsPerWeekDay(currentSwedishWeekDayName);
        const dishLabelsCurrentDay: LabelName[] = new Array();

        for (let i = 0; i < numberOfDishesCurrentDay; i++) {
            const dishRowIndex = i + 1;
            let dishPriceWeekNumber =
                await this.getDishPriceWeekNumber( currentSwedishWeekDayName, dishRowIndex );
            let label: LabelName = null;
            let indexNumber = -1;

            try {
                label = await this.getDishLabelName( currentSwedishWeekDayName, dishRowIndex );
                dishLabelsCurrentDay.push( label );
                indexNumber =
                    dishLabelsCurrentDay.filter( (x) => x === label).length;
            } catch ( error ) {
                dishPriceWeekNumber =
                    await this.getDishPriceWeekNumber( currentSwedishWeekDayName, dishRowIndex, error );
            }
            const webMealResult =
                this.webMealResult(dishPriceWeekNumber, indexNumber, label, day);
            webMealResults.push(webMealResult);
        }

        return webMealResults;
    }

    private async webMealResult(
        dishPriceWeekNumber: DishPriceWeekNumber, indexNumber: number,
        label: LabelName, weekDay: WeekDayIndex ): Promise<IWebMealResult> {

        let webMealResult: WebMealResult = null;

        try {

            if ( dishPriceWeekNumber.fetchError ) {
                throw dishPriceWeekNumber.fetchError;
            }

            if ( this.weekNumberExpected !== dishPriceWeekNumber.weekIndexWeekNumber) {
                throw new Error(`Expected to see menu for week ${this.weekNumberExpected}, but found week ${ dishPriceWeekNumber.weekIndexWeekNumber}`);
            }

            webMealResult =
                new WebMealResult(
                    this.baseUrl, dishPriceWeekNumber.dishDescription,
                    dishPriceWeekNumber.priceSEK, indexNumber, label, weekDay,
                    dishPriceWeekNumber.weekIndexWeekNumber, this.weekYear, null);

        } catch ( e ) {
            webMealResult =
                new WebMealResult( this.baseUrl, "", "", indexNumber, label,
                weekDay , this.weekNumberExpected, this.weekYear, e);
        }

        return webMealResult;

    }

    private getSwedishWeekDayNameOnRestaurangNiagara( weekDay: WeekDayIndex ): string {
        let swedishWeekDayName = "";

        switch ( weekDay ) {
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

    private labelText2LabelNameOnNiagara( labelText: string ): LabelName {
        let dishLabel: LabelName;

        switch ( true ) {
            case /asia/gi.test(labelText):
                dishLabel = LabelName.ASIAN;
                break;
            case /green/gi.test(labelText):
                dishLabel = LabelName.VEGETARIAN;
                break;
            case /local/gi.test(labelText):
                dishLabel = LabelName.MEAL_OF_THE_DAY;
                break;
            case /salad/gi.test(labelText):
                dishLabel = LabelName.SALAD;
                break;
            case /soup/gi.test(labelText):
                dishLabel = LabelName.SOUP;
                break;
            case /övrigt/gi.test(labelText):
                dishLabel = LabelName.COFFEE;
                break;
            default:
                dishLabel = LabelName.MEAL_OF_THE_DAY;
                break;
        }

        return dishLabel;
    }
    private async getDishLabelName( swedishWeekDayName: string, dishRowIndex: number ): Promise<LabelName> {
        const xpath = this.xpathProvider( swedishWeekDayName, dishRowIndex );
        const labelText =
                await this.dealerData.textContentFromHtmlDocument( xpath.labelXPath );
        const labelName = this.labelText2LabelNameOnNiagara( labelText );

        return labelName;
    }
    private async getDishPriceWeekNumber(swedishWeekDayName: string,
                                         dishRowIndex: number, fetchError?: Error): Promise<DishPriceWeekNumber> {

        let dishDescription: string;
        let priceSEK: string;
        let weekIndexWeekNumber: string;

        let dishPriceWeekNumber: DishPriceWeekNumber = null;

        const xpath = this.xpathProvider( swedishWeekDayName, dishRowIndex );

        try {
            dishDescription =
                await this.dealerData.textContentFromHtmlDocument( xpath.descriptionXPath );

            priceSEK =
                ( await this.dealerData.textContentFromHtmlDocument( xpath.price_SEKXPath ))
                .match(/\d+(?=\s?:-)/)[0];

            weekIndexWeekNumber =
                ( await this.dealerData.textContentFromHtmlDocument( xpath.weekNumberXPath ))
                .match(/\d+/)[0];
        } catch ( error ) {
            fetchError = error;
        }

        dishPriceWeekNumber = new DishPriceWeekNumber(dishDescription, priceSEK, weekIndexWeekNumber, fetchError );

        return dishPriceWeekNumber;
    }

    private async mealsPerWeekDay(swedishWeekDayName: string): Promise<number> {

        const xpathNiagaraMenuTableRow = this.xpathNiagaraMenuTableRowsProvider( swedishWeekDayName );
        const xPathResult =  await this.dealerData.contentFromHtmlDocument( xpathNiagaraMenuTableRow );

        let node = xPathResult.iterateNext();
        let numberOfMeals = 0;

        while (node) {
            numberOfMeals ++;
            node = xPathResult.iterateNext();
        }

        return numberOfMeals;
    }

    private xpathNiagaraMenuTableRowsProvider( swedishWeekDayName: string): string {
        const xpathNiagaraTableRow = `//h3[contains(.,'${swedishWeekDayName}')]/following-sibling::table[1]//tr`;
        return xpathNiagaraTableRow;
    }

    private xpathProvider( swedishWeekDayName: string, dishRowIndex: number ): IXPathDishProviderResult {

        const result: IXPathDishProviderResult = {
            descriptionXPath:
                `${this.xpathNiagaraMenuTableRowsProvider( swedishWeekDayName )}[${ dishRowIndex }]/td[2]/text()`,
            labelXPath:
                `${this.xpathNiagaraMenuTableRowsProvider( swedishWeekDayName )}[${ dishRowIndex }]/td[1]/text()`,
            price_SEKXPath:
                `${this.xpathNiagaraMenuTableRowsProvider( swedishWeekDayName )}[${ dishRowIndex }]/td[3]/text()`,
            weekNumberXPath: `//div[contains(@class,'lunch')]/h2[contains(.,'Vecka')]`,
        };

        return result;
    }

};
