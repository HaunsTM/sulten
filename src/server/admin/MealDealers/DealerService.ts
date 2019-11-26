import { HtmlFetcher } from "../../helpers/HtmlFetcher";
import { IWebMealDealer } from "../../interfaces/IWebMealDealer";

import { GlasklartDealer } from "./GlasklartDealer";
import { KolgaDealer } from "./KolgaDealer";
import { MiamariasDealer } from "./MiamariasDealer";
import { Restaurant } from "src/server/repository/entities/Restaurant";
import { RestaurantService } from "src/server/repository/RestaurantService";

export class DealerService {

    public allDealers(weekYear: string, weekIndex: string): IWebMealDealer[] {
        const allDealers: IWebMealDealer[] = [

            new KolgaDealer( new HtmlFetcher("https://kolga.gastrogate.com/lunch/"), weekYear, weekIndex ),
            new MiamariasDealer( new HtmlFetcher("http://www.miamarias.nu/"), weekYear, weekIndex ),
            new GlasklartDealer( new HtmlFetcher("https://glasklart.eu/sv/lunch/"), weekYear, weekIndex ),
        ];

        return allDealers;
    }

    public async restaurants(active: boolean): Promise<Restaurant[]> {
        var rs = new RestaurantService();
    }

}
