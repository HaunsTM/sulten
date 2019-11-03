import { EnumDishLabel } from "../../enum/dishLabel.enu";
import { EnumWeekDay } from "../../enum/weekday.enu";
import { IWebMealResult } from "../../interfaces/webMealResult.itf";

export class WebMealResult implements IWebMealResult {

    private _fetchUrl: string;
    private _dishDescription: string;
    private _dishPrice_SEK: string;
    private _dishLabel: EnumDishLabel;
    private _weekDay: EnumWeekDay;
    private _weekIndex: number;
    private _fetchError: Error;

    constructor(fetchUrl: string, dishDescription: string, dishPrice_SEK: string,
                dishLabel: EnumDishLabel, weekDay: EnumWeekDay,  weekIndex: number,
                fetchError: Error) {

        this._fetchUrl = fetchUrl;
        this._dishDescription = dishDescription;
        this._dishPrice_SEK = dishPrice_SEK;
        this._dishLabel = dishLabel;
        this._weekDay = weekDay;
        this._weekIndex = weekIndex;

        this._fetchError = fetchError;
    }

    public get dishDescription(): string {
        return this._dishDescription;
    }

    public get dishPrice_SEK(): string {
        return this._dishPrice_SEK;
    }

    public get dishLabel(): EnumDishLabel {
        return this._dishLabel;
    }

    public get weekDay(): EnumWeekDay {
        return this._weekDay;
    }

    public get weekIndex(): number {
        return this._weekIndex;
    }

    public get fetchError(): Error {
        return this._fetchError;
    }

    public get fetchUrl(): string {
        return this._fetchUrl;
    }

}
