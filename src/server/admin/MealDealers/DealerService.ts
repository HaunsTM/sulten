import { FetcherType } from "../../enum/FetcherType";
import { logger } from "../../helpers/default.logger";
import { HtmlDocumentParser } from "../../helpers/HtmlDocumentParser";
import { HtmlFetcher } from "../../helpers/HtmlFetcher";
import { PdfFetcher } from "../../helpers/PdfFetcher";
import { IHtmlDocumentParser } from "../../interfaces/IHtmlDocumentParser";
import { IWebMealDealer } from "../../interfaces/IWebMealDealer";
import { IWebMealResult } from "../../interfaces/IWebMealResult";
import { RestaurantService } from "../../repository/RestaurantService";

import { IWebMealDealerStatic } from "../../interfaces/IWebMealDealerStatic";
import { GlasklartDealer } from "./GlasklartDealer";
import { KolgaDealer } from "./KolgaDealer";
import { Lokal17Dealer } from "./Lokal17Dealer";
import { MiamariasDealer } from "./MiamariasDealer";
import { RestaurangVariationDealer } from "./RestaurangVariationDealer";

export class DealerService {

    public allDealers(): IWebMealDealerStatic[] {

        const allDealers: IWebMealDealerStatic[] = [
            GlasklartDealer,
            KolgaDealer,
            Lokal17Dealer,
            MiamariasDealer,
            RestaurangVariationDealer,
        ];

        return allDealers;
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

        const activeDealers = Promise.all(activeDealersStatic.map( (d) => {
            const webMealDealer = this.dealerDataFactory(d.baseUrlStatic, d, weekYear, weekIndex );
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
        const menuUrl = await mealDealer.menuUrlStatic(htmlDocumentParser);

        let webMealDealerStatic: IWebMealDealer = null;

        switch ( mealDealer.fetcherTypeNeededStatic ) {
            case FetcherType.PDF:
                const dealerDataForPdfDocument = await this.dealerDataForPdfDocument(menuUrl);
                webMealDealerStatic =
                    new mealDealer(dealerDataForPdfDocument, initialRestaurantUrl, weekYear, weekIndex);
                break;
            case FetcherType.HTML:
                const dealerDataForHtmlDocument = await this.dealerDataForHtmlDocument(menuUrl);
                webMealDealerStatic =
                    new mealDealer(dealerDataForHtmlDocument, initialRestaurantUrl, weekYear, weekIndex);
                break;
        }

        return webMealDealerStatic;
    }

    private async dealerDataForPdfDocument(menuUrl: string): Promise<string> {

        const pdfFetcher = new PdfFetcher( menuUrl );
        const pageNumber = 1;
        const textContentFromPdfDocument =  await pdfFetcher.textContentFromPdfDocument(pageNumber);

        return textContentFromPdfDocument;
    }

    private async dealerDataForHtmlDocument( menuUrl: string ): Promise<IHtmlDocumentParser> {

        const htmlFetcher = new HtmlFetcher( menuUrl );
        const htmlDocument = await htmlFetcher.htmlDocumentFromWeb();
        const htmlDocumentParser = new HtmlDocumentParser( htmlDocument );

        return htmlDocumentParser;
    }
}
