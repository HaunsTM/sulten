import { FetcherType } from "../enum/FetcherType";
import { logger } from "../helpers/default.logger";
import { HtmlDocumentParser } from "../helpers/HtmlDocumentParser";
import { HtmlFetcher } from "../helpers/HtmlFetcher";
import { PdfFetcher } from "../helpers/PdfFetcher";
import { IHtmlDocumentParser } from "../interfaces/IHtmlDocumentParser";
import { IWebMealDealer } from "../interfaces/IWebMealDealer";
import { IWebMealResult } from "../interfaces/IWebMealResult";
import { RestaurantService } from "../repository/RestaurantService";

import { JSONAPIFetcher } from "../helpers/JSONAPIFetcher";
import { RSSFetcher } from "../helpers/RSSFetcher";
import { IDealerResult } from "../interfaces/IDealerResult";
import { IWebMealDealerStatic } from "../interfaces/IWebMealDealerStatic";
import { DealerCollection } from "./DealerCollection";
import { DealerResult } from "./DealerResult";

export class DealerService {

    public static errorsFromActiveDealers(resultsFromActiveDealers: IDealerResult[]): Error[] {

        const errorsFromActiveDealers = resultsFromActiveDealers
            .flatMap( (d) => {
                const mealsFromWeb = d.errors;
                return mealsFromWeb;
            })
            .filter((d) => { return d; });

        return errorsFromActiveDealers;
    }

    public static mealsFromActiveDealers(resultsFromActiveDealers: IDealerResult[]): IWebMealResult[] {

        const mealsFromActiveDealers = resultsFromActiveDealers
            .flatMap( (d) => {
                const mealsFromWeb = d.mealsFromWeb;
                return mealsFromWeb;
            })
            .filter((d) => { return d; });

        return mealsFromActiveDealers;
    }

    public static generalErrorsFromActiveDealers(resultsFromActiveDealers: IDealerResult[]): Error[] {

        const generalErrorsFromActiveDealers = resultsFromActiveDealers
            .flatMap( (d) => {
                const mealsFromWeb = d.generalError;
                return mealsFromWeb;
            })
            .filter( (d) => { return d; } );

        return generalErrorsFromActiveDealers;
    }

    public static dealerFetchAndDbInsertReport(resultsFromActiveDealers: IDealerResult[]): string {
        const errorsFromActiveDealers = DealerService.errorsFromActiveDealers(resultsFromActiveDealers);
        const mealsFromActiveDealers = DealerService.mealsFromActiveDealers(resultsFromActiveDealers);
        const generalErrorsFromActiveDealers = DealerService.generalErrorsFromActiveDealers(resultsFromActiveDealers);

        const dealerFetchAndDbInsertReport =
            `<html>
                <head></head>
                <body>
                    <article>
                        <p>Fetched ${mealsFromActiveDealers.length} meals (${errorsFromActiveDealers.length} errors).</p>
                        <h3>Success: </h3>
                        <table>
                            <th>
                                <tr style="background: yellow"><td>menuUrl</td><td>fetchError</td><td>weekDayJavascriptDayIndex</td><td>dishDescription</td><td>price_SEK</td></tr>
                            </th>
                            ${mealsFromActiveDealers.flatMap( (m) => {
                                return `<tr><td>${m.menuUrl}</td><td>${m.fetchError}</td><td>${m.weekDayJavascriptDayIndex}</td><td>${m.dishDescription}</td><td>${m.price_SEK}</td></tr>`;
                            })}
                        </table>
                        <h3>General failure: </h3>
                        <table>
                            <th>
                                <tr style="background: yellow"><td>name</td><td>message</td><td>stack</td></tr>
                            </th>
                            ${errorsFromActiveDealers.flatMap( (m) => {
                                return `<tr><td>${m.name}</td><td>${m.message}</td><td>${m.stack}</td></tr>`;
                            })}
                            ${generalErrorsFromActiveDealers.flatMap( (m) => {
                                return `<tr><td>${m.name}</td><td>${m.message}</td><td>${m.stack}</td></tr>`;
                            })}
                        </table>
                    </article>
                </body>
            </html>`;

        return dealerFetchAndDbInsertReport;
    }

    public allDealers(): IWebMealDealerStatic[] {

        return DealerCollection.allDealers();
    }

    public async activeDealersStatic(weekYear: string, weekIndex: string): Promise<IWebMealDealerStatic[]> {
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

        return  activeDealersStatic;
    }

    public async resultsFromActiveDealers(weekYear: string, weekIndex: string): Promise<IDealerResult[]> {

        const activeDealersStatic = await this.activeDealersStatic(weekYear, weekIndex);
        const dealerResults: IDealerResult[] = [];
        for (const dS of activeDealersStatic) {
            let webMealDealer: IWebMealDealer = null;
            let preparedResult: IDealerResult = null;
            try {
                webMealDealer = await this.dealerDataFactory(dS.baseUrlStatic, dS, weekYear, weekIndex );
                const unpreparedResult = await webMealDealer.mealsFromWeb();
                await unpreparedResult.fetchMealResultsFromActiveDealers();
                preparedResult = unpreparedResult;
            } catch (error) {
                preparedResult = new DealerResult(dS.baseUrlStatic, error);
            }
            dealerResults.push(preparedResult);
          }
        return dealerResults;
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
            default:
                throw new Error(`Dealer fetcher type not implemented: ${ typeof  mealDealer.fetcherTypeNeededStatic }`);
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
