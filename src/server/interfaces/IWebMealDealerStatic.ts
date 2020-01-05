import { FetcherType } from "../enum/FetcherType";
import { IHtmlDocumentParser } from "./IHtmlDocumentParser";
import { IMenuUrlDynamicData } from "./IMenuUrlDynamicData";
import { IWebMealDealer } from "./IWebMealDealer";

export interface IWebMealDealerStatic {
    fetcherTypeNeededStatic: FetcherType;

    baseUrlStatic: string;
    new(
        dealerData: any,
        baseUrl: string,
        weekYear: string,
        weekNumberExpected: string): IWebMealDealer;
    menuUrlStatic(
        pageWhereToFindMenuUrl: IHtmlDocumentParser, menuUrlDynamicData: IMenuUrlDynamicData): Promise<string>;
}
