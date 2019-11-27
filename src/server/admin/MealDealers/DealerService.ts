import { HtmlFetcher } from "../../helpers/HtmlFetcher";
import { IWebMealDealer } from "../../interfaces/IWebMealDealer";

import { GlasklartDealer } from "./GlasklartDealer";
import { KolgaDealer } from "./KolgaDealer";
import { MiamariasDealer } from "./MiamariasDealer";
import { RestaurantService } from "../../repository/RestaurantService";
import { Restaurant } from "../../repository/entities/Restaurant";

export class DealerService {

    public allDealers(weekYear: string, weekIndex: string): IWebMealDealer[] {
        const allDealers: IWebMealDealer[] = [

            new KolgaDealer( new HtmlFetcher("https://kolga.gastrogate.com/lunch/"), weekYear, weekIndex ),
            new MiamariasDealer( new HtmlFetcher("http://www.miamarias.nu/"), weekYear, weekIndex ),
            new GlasklartDealer( new HtmlFetcher("https://glasklart.eu/sv/lunch/"), weekYear, weekIndex ),
        ];

        return allDealers;
    }

    public async activeDealers(weekYear: string, weekIndex: string): IWebMealDealer[] {
        const rs = new RestaurantService();

        const active = true;
        const activeRestaurants = await rs.getRestaurantsByActiveness(active);
        const activeRestaurantsUrls = activeRestaurants.map( (r) => { return r.MenuUrl; });
        
        const allDealers = this.allDealers(weekYear, weekIndex);
        const allDealersUrls = allDealers.filter( (d) => { return d.mealsFromWeb})

        const activeDealers = 
    }


}
