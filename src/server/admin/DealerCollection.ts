
import { IWebMealDealerStatic } from "../interfaces/IWebMealDealerStatic";

// Lund - Brunnshög
import { BricksEateryDealer } from "./MealDealers/BricksEateryDealer";
import { ScotlandYardDealer } from "./MealDealers/ScotlandYardDealer";

// Lund - Sjukhuset
import { BistroALundCentralhallenDealer } from "./MealDealers/BistroALundCentralhallen";
import { BistroALundMatakutenDealer } from "./MealDealers/BistroALundMatakuten";
import { PathotellundRestaurangDealer } from "./MealDealers/PathotellundRestaurangDealer";

// Malmö - Sjukhuset
import { Freda49Dealer } from "./MealDealers/Freda49Dealer";
import { MotesplatsCRCDealer } from "./MealDealers/MotesplatsCRCDealer";

// Malmö - Stora Bernstorp
import { MorMarnasMatsalDealer } from "./MealDealers/MorMarnasMatsalDealer";
import { RestaurangOresundsterminalenDealer } from "./MealDealers/RestaurangOresundsterminalenDealer";

// Malmö - Västra Hamnen
import { ArstidernaByTheSeaDealer } from "./MealDealers/ArstidernaByTheSeaDealer";
import { GlasklartDealer } from "./MealDealers/GlasklartDealer";
import { Lokal17Dealer } from "./MealDealers/Lokal17Dealer";
import { MHMatsalarDealer } from "./MealDealers/MHMatsalarDealer";
import { MiamariasDealer } from "./MealDealers/MiamariasDealer";
import { RestaurangKolgaDealer } from "./MealDealers/RestaurangKolgaDealer";
import { RestaurangKPDealer } from "./MealDealers/RestaurangKPDealer";
import { RestaurangNiagaraDealer } from "./MealDealers/RestaurangNiagaraDealer";
import { RestaurangP2Dealer } from "./MealDealers/RestaurangP2Dealer";
import { RestaurangVariationDealer } from "./MealDealers/RestaurangVariationDealer";
import { StoraVarvsgatan6Dealer } from "./MealDealers/StoraVarvsgatan6Dealer";
import { WhiteSharkDealerDealer } from "./MealDealers/WhiteSharkDealer";
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

            // Malmö - Sjukhuset
            Freda49Dealer,
            MotesplatsCRCDealer,

            // Malmö - Stora Bernstorp
            MorMarnasMatsalDealer,
            RestaurangOresundsterminalenDealer,

            // Malmö - Västra Hamnen
            ArstidernaByTheSeaDealer,
            GlasklartDealer,
            Lokal17Dealer,
            MHMatsalarDealer,
            MiamariasDealer,
            RestaurangKolgaDealer,
            RestaurangKPDealer,
            RestaurangNiagaraDealer,
            RestaurangP2Dealer,
            RestaurangVariationDealer,
            StoraVarvsgatan6Dealer,
            WhiteSharkDealerDealer,
            ZenthaiDealer,

        ];

        return allDealers;
    }

}
