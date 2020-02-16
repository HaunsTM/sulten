import { IDealerResult } from "../interfaces/IDealerResult";
import { IWebMealResult } from "../interfaces/IWebMealResult";

export class DealerResult implements IDealerResult {

    public baseUrl: string;

    private _webMealsAForAWeek: Array<Promise<IWebMealResult>>;
    private  _webMealResultsForAWeek: IWebMealResult[];

    constructor(baseUrl: string, webMealsAForAWeek: Array<Promise<IWebMealResult>>) {
        this.baseUrl = baseUrl;
        this._webMealsAForAWeek = webMealsAForAWeek;
    }

    public async fetchMealResultsFromActiveDealers(): Promise<void> {
        if (!this._webMealResultsForAWeek) {
            this._webMealResultsForAWeek =
                await Promise.all(this._webMealsAForAWeek.map((p) => p.catch((e) => e)));
        }
    }
    public get mealsFromWeb(): IWebMealResult[] {
        const mealsFromWeb =
        this.mealResultsFromActiveDealers
                .filter((result) => !(result instanceof Error))
                .filter( (element) => {
                    const isValid = element.isValid;
                    return isValid;
                });
        return mealsFromWeb;
    }
    public get errors(): Error[] {
        const errors =
            this.mealResultsFromActiveDealers
                .filter((result) => {
                    return (result instanceof Error);
                }) as unknown as Error[];
        return errors;
    }

    private get mealResultsFromActiveDealers(): IWebMealResult[] {
        if (!this._webMealResultsForAWeek) {
            throw new Error(`Meals for url ${this.baseUrl} is not yet fetched!`);
        }
        return this._webMealResultsForAWeek;
    }
}
