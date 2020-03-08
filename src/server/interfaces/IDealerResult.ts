import { IWebMealResult } from "./IWebMealResult";

export interface IDealerResult {

    baseUrl: string;
    mealsFromWeb: IWebMealResult[];
    errors: Error[];

    generalError: Error;

    fetchMealResultsFromActiveDealers(): Promise<void>;
}
