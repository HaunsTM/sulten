import { IDealerResult } from "./IDealerResult";

export interface IWebMealDealer {

    mealsFromWeb(): Promise<IDealerResult>;

}
