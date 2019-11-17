import { LabelName } from "../../enum/LabelName";
import { WeekDayJavascriptDayIndex } from "../../enum/WeekDayJavascriptDayIndex";
import { IWebMealResult } from "../../interfaces/IWebMealResult";

export class WebMealResult implements IWebMealResult {

    private _menuUrl: string;
    private _dishDescription: string;
    private _dishPrice_SEK: string;
    private _labelName: LabelName;
    private _weekDayJavascriptDayIndex: WeekDayJavascriptDayIndex;
    private _weekNumber: string;
    private _fetchError: Error;

    constructor(menuUrl: string, dishDescription: string, dishPriceSEK: string,
                labelName: LabelName, weekDay: WeekDayJavascriptDayIndex,  weekNumber: string,
                fetchError: Error) {

        this._menuUrl = menuUrl;
        this._dishDescription = dishDescription;
        this._dishPrice_SEK = dishPriceSEK;
        this._labelName = labelName;
        this._weekDayJavascriptDayIndex = weekDay;
        this._weekNumber = weekNumber;

        this._fetchError = fetchError;
    }

    public get DishDescription(): string {
        return this._dishDescription;
    }

    public get DishPrice_SEK(): string {
        return this._dishPrice_SEK;
    }

    public get LabelName(): LabelName {
        return this._labelName;
    }

    public get MenuUrl(): string {
        return this._menuUrl;
    }

    public get WeekDayJavascriptDayIndex(): WeekDayJavascriptDayIndex {
        return this._weekDayJavascriptDayIndex;
    }

    public get WeekNumber(): string {
        return this._weekNumber;
    }

    public get FetchError(): Error {
        return this._fetchError;
    }

}
