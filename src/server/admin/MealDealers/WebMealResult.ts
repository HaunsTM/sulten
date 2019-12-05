import { LabelName } from "../../enum/LabelName";
import { WeekDayJavascriptDayIndex } from "../../enum/WeekDayJavascriptDayIndex";
import { IWebMealResult } from "../../interfaces/IWebMealResult";

export class WebMealResult implements IWebMealResult {

    private _menuUrl: string;
    private _dishDescription: string;
    private _priceSEK: string;
    private _labelName: LabelName;
    private _weekDayJavascriptDayIndex: WeekDayJavascriptDayIndex;
    private _weekNumber: string;
    private _weekYear: string;
    private _fetchError: Error;

    constructor(menuUrl: string, dishDescription: string, priceSEK: string,
                labelName: LabelName, weekDay: WeekDayJavascriptDayIndex,  weekNumber: string,
                weekYear: string, fetchError: Error) {

        this._menuUrl = menuUrl;
        this._dishDescription = dishDescription;
        this._priceSEK = priceSEK;
        this._labelName = labelName;
        this._weekDayJavascriptDayIndex = weekDay;
        this._weekNumber = weekNumber;
        this._weekYear = weekYear;

        this._fetchError = fetchError;
    }

    public get dishDescription(): string {
        return this._dishDescription;
    }

    public get price_SEK(): string {
        return this._priceSEK;
    }

    public get labelName(): LabelName {
        return this._labelName;
    }

    public get menuUrl(): string {
        return this._menuUrl;
    }

    public get weekDayJavascriptDayIndex(): WeekDayJavascriptDayIndex {
        return this._weekDayJavascriptDayIndex;
    }

    public get weekNumber(): string {
        return this._weekNumber;
    }

    public get weekYear(): string {
        return this._weekYear;
    }

    public get fetchError(): Error {
        return this._fetchError;
    }

}
