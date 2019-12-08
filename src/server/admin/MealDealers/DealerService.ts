import { HtmlFetcher } from "../../helpers/HtmlFetcher";
import { PdfFetcher } from "../../helpers/PdfFetcher";
import { IWebMealDealer } from "../../interfaces/IWebMealDealer";
import { IWebMealResult } from "../../interfaces/IWebMealResult";
import { RestaurantService } from "../../repository/RestaurantService";

import { GlasklartDealer } from "./GlasklartDealer";
import { KolgaDealer } from "./KolgaDealer";
import { MiamariasDealer } from "./MiamariasDealer";
import { RestaurangVariationDealer } from "./RestaurangVariationDealer";

export class DealerService {

    public allDealers(weekYear: string, weekIndex: string): IWebMealDealer[] {
        const allDealers: IWebMealDealer[] = [

            new KolgaDealer( new HtmlFetcher("https://kolga.gastrogate.com/lunch/"), weekYear, weekIndex ),
            new GlasklartDealer( new HtmlFetcher("https://glasklart.eu/sv/lunch/"), weekYear, weekIndex ),
            new MiamariasDealer( new HtmlFetcher("http://www.miamarias.nu/"), weekYear, weekIndex ),
            new RestaurangVariationDealer( new PdfFetcher("https://www.nyavariation.se/files/matsedel/"), weekYear, weekIndex ),
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

        const allDealers = this.allDealers(weekYear, weekIndex);

        const activeDealers = allDealers.filter( (dealer) => {
            return activeRestaurantsUrls.includes(dealer.initialBaseMenuUrl);
        });

        return activeDealers;
    }

    public async mealsFromActiveDealers(weekYear: string, weekIndex: string): Promise<IWebMealResult[]> {

        const activeDealers = await this.activeDealers(weekYear, weekIndex);
        const activeDealersMenuFetcherJobs = activeDealers.map( (d) => { 
            return d.mealsFromWeb();
        });

        const mealsFromActiveDealers = (await Promise.all(activeDealersMenuFetcherJobs)).flatMap( (d) => d);

        return mealsFromActiveDealers;
    }

}
