import axios, { AxiosResponse } from "axios";
import { FetcherType } from "../enum/FetcherType";
import { logger } from "../helpers/default.logger";
import { HtmlDocumentParser } from "../helpers/HtmlDocumentParser";
import { HtmlFetcher } from "../helpers/HtmlFetcher";
import { PdfFetcher } from "../helpers/PdfFetcher";
import { IHtmlDocumentParser } from "../interfaces/IHtmlDocumentParser";
import { IWebMealDealer } from "../interfaces/IWebMealDealer";
import { IWebMealResult } from "../interfaces/IWebMealResult";
import { RestaurantService } from "../repository/RestaurantService";

import Parser from "rss-parser";
import { JSONAPIFetcher } from "../helpers/JSONAPIFetcher";
import { RSSFetcher } from "../helpers/RSSFetcher";
import { IWebMealDealerStatic } from "../interfaces/IWebMealDealerStatic";
import { DealerCollection } from "./DealerCollection";

export class DealerService {

    public allDealers(): IWebMealDealerStatic[] {

        return DealerCollection.allDealers();
    }

    public async activeDealers(weekYear: string, weekIndex: string): Promise<IWebMealDealer[]> {
        const rs = new RestaurantService();

        const active = true;
        const activeRestaurants = await rs.getRestaurantsByActiveness(active);
        const activeRestaurantsUrls =
            activeRestaurants.map( (r) => {
                return r.menuUrl;
            });

        const activeDealersStatic = this.allDealers().filter( (dealer) => {
            return activeRestaurantsUrls.includes(dealer.baseUrlStatic);
        });

        const activeDealers = await Promise.all(activeDealersStatic.map( async (d) => {
            const webMealDealer = await this.dealerDataFactory(d.baseUrlStatic, d, weekYear, weekIndex );
            return webMealDealer;
        }));

        return  activeDealers;
    }

    public async mealsFromActiveDealers(weekYear: string, weekIndex: string): Promise<IWebMealResult[]> {

        const activeDealers = await this.activeDealers(weekYear, weekIndex);
        const activeDealersMenuFetcherJobs = activeDealers.map( (d) => {
            const mealsFromWeb = d.mealsFromWeb();

            return mealsFromWeb;
        });

        const mealsFromActiveDealers = (await Promise.all(activeDealersMenuFetcherJobs)).flatMap( (d) => d);

        return mealsFromActiveDealers;
    }
    private async dealerDataFactory(
        initialRestaurantUrl: string, mealDealer: IWebMealDealerStatic,
        weekYear: string, weekIndex: string): Promise<IWebMealDealer> {

        const htmlFetcher = new HtmlFetcher(initialRestaurantUrl);
        const htmlDocument = await htmlFetcher.htmlDocumentFromWeb();
        const htmlDocumentParser = new HtmlDocumentParser(htmlDocument);
        const menuUrl = await mealDealer.menuUrlStatic(htmlDocumentParser,
            {weekYear, weekIndex},
        );

        let webMealDealerStatic: IWebMealDealer = null;

        switch ( mealDealer.fetcherTypeNeededStatic ) {
            case FetcherType.HTML:
                const dealerDataForHtmlDocument = await this.dealerDataForHtmlDocument(menuUrl);
                webMealDealerStatic =
                    new mealDealer(dealerDataForHtmlDocument, initialRestaurantUrl, weekYear, weekIndex);
                break;
            case FetcherType.JSON_API:
                const dealerDataForJSONDocument = await this.dealerDataForJSONDocument(menuUrl);
                webMealDealerStatic =
                    new mealDealer(dealerDataForJSONDocument, initialRestaurantUrl, weekYear, weekIndex);
                break;
            case FetcherType.PDF:
                const dealerDataForPdfDocument = await this.dealerDataForPdfDocument(menuUrl);
                webMealDealerStatic =
                    new mealDealer(dealerDataForPdfDocument, initialRestaurantUrl, weekYear, weekIndex);
                break;
            case FetcherType.RSS:
                const dealerDataForRSSFeed = await this.dealerDataForRSSFeed(menuUrl);
                webMealDealerStatic =
                    new mealDealer(dealerDataForRSSFeed, initialRestaurantUrl, weekYear, weekIndex);
                break;
        }

        return webMealDealerStatic;
    }

    private async dealerDataForJSONDocument( menuUrl: string ): Promise<{}> {
        try {

            const jSONAPIFetcher = new JSONAPIFetcher( menuUrl );
            const json = await jSONAPIFetcher.jSONResult();

            return json;

        } catch ( e ) {
            this.logDealerDataError("dealerDataForJSONDocument()", menuUrl, e);
            return null;
        }
    }

    private async dealerDataForHtmlDocument( menuUrl: string ): Promise<IHtmlDocumentParser> {
        try {
            const htmlFetcher = new HtmlFetcher( menuUrl );
            const htmlDocument = await htmlFetcher.htmlDocumentFromWeb();
            const htmlDocumentParser = new HtmlDocumentParser( htmlDocument );

            return htmlDocumentParser;

        } catch ( e ) {
            this.logDealerDataError("dealerDataForHtmlDocument()", menuUrl, e);
            return null;
        }
    }

    private async dealerDataForPdfDocument(menuUrl: string): Promise<string> {
        try {
            const pdfFetcher = new PdfFetcher( menuUrl );
            const pageNumber = 1;
            const textContentFromPdfDocument =  await pdfFetcher.textContentFromPdfDocument(pageNumber);

            return textContentFromPdfDocument;

        } catch ( e ) {
            this.logDealerDataError("dealerDataForPdfDocument()", menuUrl, e);
            return null;
        }
    }

    private async dealerDataForRSSFeed( menuUrl: string ): Promise<IHtmlDocumentParser> {
        try {

            const rSSFetcher = new RSSFetcher( menuUrl );
            const feed = await rSSFetcher.feedFromWeb();
            if (feed.items.length < 1) { throw new Error(`No content in RSS-feed for: ${menuUrl}`); }
            const unsanitizedHtmlString = feed.items[0].content;
            const sanitizedHtmlString = HtmlDocumentParser.getUtf8HtmlString( unsanitizedHtmlString );
            const documentContent = HtmlDocumentParser.string2document( sanitizedHtmlString );

            const htmlDocumentParser = new HtmlDocumentParser( documentContent );

            return htmlDocumentParser;

        } catch ( e ) {
            this.logDealerDataError("dealerDataForRSSFeed()", menuUrl, e);
            return null;
        }
    }

    private logDealerDataError(methodName: string, menuUrl: string, e: Error): void {
        logger.error(`Error in ${methodName} ***  menuUrl: ${menuUrl} ***  errorName: ${e.name} ***  stackTrace: ${e.stack} ***  stackTrace: ${e.stack}`);
    }


}
