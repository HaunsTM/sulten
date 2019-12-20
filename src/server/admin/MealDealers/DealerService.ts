import { logger } from "../../helpers/default.logger";
import { HtmlFetcher } from "../../helpers/HtmlFetcher";
import { PdfFetcher } from "../../helpers/PdfFetcher";
import { IWebMealDealer } from "../../interfaces/IWebMealDealer";
import { IWebMealResult } from "../../interfaces/IWebMealResult";
import { RestaurantService } from "../../repository/RestaurantService";

import { GlasklartDealer } from "./GlasklartDealer";
import { KolgaDealer } from "./KolgaDealer";
import { Lokal17Dealer } from "./Lokal17Dealer";
import { MiamariasDealer } from "./MiamariasDealer";
import { RestaurangVariationDealer } from "./RestaurangVariationDealer";

export class DealerService {

    public async allDealers(weekYear: string, weekIndex: string): Promise<IWebMealDealer[]> {
        const allDealers: IWebMealDealer[] = [

            new GlasklartDealer(
                new HtmlFetcher("https://glasklart.eu/sv/lunch/"), weekYear, weekIndex ),
            new KolgaDealer(
                new HtmlFetcher("https://kolga.gastrogate.com/lunch/"), weekYear, weekIndex ),
            await Lokal17Dealer.GetLokal17DealerAsync(
                new PdfFetcher("https://lokal17.se/"),
                new HtmlFetcher("https://lokal17.se/"), weekYear, weekIndex ),
            new MiamariasDealer(
                new HtmlFetcher("http://www.miamarias.nu/"), weekYear, weekIndex ),
            await RestaurangVariationDealer.GetRestaurangVariationDealerAsync(
                new PdfFetcher("https://www.nyavariation.se/matsedel/"),
                new HtmlFetcher("https://www.nyavariation.se/matsedel/"), weekYear, weekIndex ),
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

        const allDealers = await this.allDealers(weekYear, weekIndex);

        const activeDealers = allDealers.filter( (dealer) => {
            return activeRestaurantsUrls.includes(dealer.initialBaseMenuUrl);
        });

        return activeDealers;
    }

    public async mealsFromActiveDealers(weekYear: string, weekIndex: string): Promise<IWebMealResult[]> {

        const activeDealers = await this.activeDealers(weekYear, weekIndex);
        const activeDealersMenuFetcherJobs = activeDealers.map( (d) => {
            const mealsFromWeb = d.mealsFromWeb();

            //logger.debug(`Meals from active dealer url: ${d.actualRestaurantMenuUrl}. Meals ${mealsFromWeb.map( (r) => !r.fetchError ? r.dishDescription : r.fetchError ).join(", ")}`);
            return mealsFromWeb;
        });

        const mealsFromActiveDealers = (await Promise.all(activeDealersMenuFetcherJobs)).flatMap( (d) => d);

        return mealsFromActiveDealers;
    }

}
