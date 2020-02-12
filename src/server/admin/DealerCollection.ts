
import { IWebMealDealerStatic } from "../interfaces/IWebMealDealerStatic";

// Lund - Brunnshög
import { BricksEateryDealer } from "./MealDealers/BricksEateryDealer";
import { ScotlandYardDealer } from "./MealDealers/ScotlandYardDealer";

// Lund - Sjukhuset
import { BistroALundCentralhallenDealer } from "./MealDealers/BistroALundCentralhallen";
import { BistroALundMatakutenDealer } from "./MealDealers/BistroALundMatakuten";
import { PathotellundRestaurangDealer } from "./MealDealers/PathotellundRestaurangDealer";

// Malmö - Centrum

// Malmö - Västra Hamnen
import { GlasklartDealer } from "./MealDealers/GlasklartDealer";
import { Lokal17Dealer } from "./MealDealers/Lokal17Dealer";
import { MHMatsalarDealer } from "./MealDealers/MHMatsalarDealer";
import { MiamariasDealer } from "./MealDealers/MiamariasDealer";
import { RestaurangKolgaDealer } from "./MealDealers/RestaurangKolgaDealer";
import { RestaurangKPDealer } from "./MealDealers/RestaurangKPDealer";
import { RestaurangNiagaraDealer } from "./MealDealers/RestaurangNiagaraDealer";
import { RestaurangVariationDealer } from "./MealDealers/RestaurangVariationDealer";
import { StoraVarvsgatan6Dealer } from "./MealDealers/StoraVarvsgatan6Dealer";
import { ZenthaiDealer } from "./MealDealers/ZenthaiDealer";

export class DealerCollection {

    public static allDealers(): IWebMealDealerStatic[] {

        const allDealers: IWebMealDealerStatic[] = [
            // Lund - Brunnshög
            BricksEateryDealer,
            ScotlandYardDealer,

            // Lund - Sjukhuset
            BistroALundCentralhallenDealer,
            BistroALundMatakutenDealer,
            PathotellundRestaurangDealer,

            // Malmö - Centrum

            // Malmö - Västra Hamnen
            GlasklartDealer,
            Lokal17Dealer,
            MHMatsalarDealer,
            MiamariasDealer,
            RestaurangKolgaDealer,
            RestaurangKPDealer,
            RestaurangNiagaraDealer,
            RestaurangVariationDealer,
            StoraVarvsgatan6Dealer,
            ZenthaiDealer,

        ];

        return allDealers;
    }

}
