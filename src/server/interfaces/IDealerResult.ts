import { IWebMealResult } from "./IWebMealResult";

export interface IDealerResult {

    baseUrl: string;
    mealsFromWeb: IWebMealResult[];
    errors: Error[];

    fetchMealResultsFromActiveDealers(): Promise<void>;
}
