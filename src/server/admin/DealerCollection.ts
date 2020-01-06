
import { IWebMealDealerStatic } from "../interfaces/IWebMealDealerStatic";

// Lund - Brunnshög
import { BricksEateryDealer } from "./MealDealers/BricksEateryDealer";

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
import { RestaurangNiagaraDealer } from "./MealDealers/RestaurangNiagaraDealer";
import { RestaurangVariationDealer } from "./MealDealers/RestaurangVariationDealer";
import { ZenthaiDealer } from "./MealDealers/ZenthaiDealer";

export class DealerCollection {

    public static allDealers(): IWebMealDealerStatic[] {

        const allDealers: IWebMealDealerStatic[] = [
            // Lund - Brunnshög
            BricksEateryDealer,

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
            RestaurangNiagaraDealer,
            RestaurangVariationDealer,
            ZenthaiDealer,

        ];

        return allDealers;
    }

}
