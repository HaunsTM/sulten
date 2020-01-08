import { IDishPriceWeekNumber } from "../../interfaces/IDishPriceWeekNumber";

export class DishPriceWeekNumber implements IDishPriceWeekNumber {

    private _dishDescription: string;
    private _priceSEK: string;
    private _weekIndexWeekNumber: string;

    private _fetchError: Error;

    constructor(dishDescription: string, priceSEK: string, weekIndexWeekNumber: string,
                fetchError: Error) {

        this._dishDescription = dishDescription;
        this._priceSEK = priceSEK;
        this._weekIndexWeekNumber = weekIndexWeekNumber;

        this._fetchError = fetchError;
    }

    public get dishDescription(): string {
        return this._dishDescription;
    }

    public get priceSEK(): string {
        return this._priceSEK;
    }

    public get weekIndexWeekNumber(): string {
        return parseInt(this._weekIndexWeekNumber).toString();
    }

    public get fetchError(): Error {
        return this._fetchError;
    }

}
