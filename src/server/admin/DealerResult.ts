import { IDealerResult } from "../interfaces/IDealerResult";
import { IWebMealResult } from "../interfaces/IWebMealResult";

export class DealerResult implements IDealerResult {

    public baseUrl: string;
    private _generalError: Error = null;
    private _webMealsAForAWeek: Array<Promise<IWebMealResult>>;
    private  _webMealResultsForAWeek: IWebMealResult[];

    constructor(baseUrl: string, generalError: Error)
    constructor(baseUrl: string, webMealsAForAWeek: Array<Promise<IWebMealResult>>)
    constructor(baseUrl: string, failureOrMeals: Error | Array<Promise<IWebMealResult>>) {
        this.baseUrl = baseUrl;

        if (failureOrMeals instanceof Error) {
            this._generalError = failureOrMeals;
        } else {
            this._webMealsAForAWeek = failureOrMeals;
        }

    }

    public async fetchMealResultsFromActiveDealers(): Promise<void> {
        if (!this._webMealResultsForAWeek) {
            this._webMealResultsForAWeek =
                await Promise.all(this._webMealsAForAWeek.map((p) => p.catch((e) => e)));
        }
    }

    public get mealsFromWeb(): IWebMealResult[] {
        if ( !this._generalError ) {
            const mealsFromWeb =
                this.mealResultsFromActiveDealers
                        .filter((result) => !(result instanceof Error))
                        .filter( (element) => {
                            const isValid = element.isValid;
                            return isValid;
                        });
            return mealsFromWeb;
        } else {
            return null;
        }
    }

    public get errors(): Error[] {
        if ( !this._generalError ) {
            const errors =
                this.mealResultsFromActiveDealers
                    .filter((result) => {
                        return (result instanceof Error);
                    }) as unknown as Error[];
            return errors;
        } else {
            return null;
        }
    }

    public get generalError(): Error {
        return this._generalError;
    }

    private get mealResultsFromActiveDealers(): IWebMealResult[] {
        if (!this._webMealResultsForAWeek) {
            throw new Error(`Meals for url ${this.baseUrl} is not yet fetched!`);
        }
        return this._webMealResultsForAWeek;
    }
}
