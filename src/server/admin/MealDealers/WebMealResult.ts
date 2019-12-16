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

    constructor()
    constructor(menuUrl: string, dishDescription: string, priceSEK: string,
                labelName: LabelName, weekDay: WeekDayJavascriptDayIndex,  weekNumber: string,
                weekYear: string, fetchError: Error)
    constructor(menuUrl?: string, dishDescription?: string, priceSEK?: string,
                labelName?: LabelName, weekDay?: WeekDayJavascriptDayIndex,  weekNumber?: string,
                weekYear?: string, fetchError?: Error) {

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
        return this._dishDescription.trim();
    }
    public set dishDescription(value: string) {
        this._dishDescription = value;
    }

    public get price_SEK(): string {
        return this._priceSEK.trim();
    }
    public set price_SEK(value: string) {
        this._priceSEK = value;
    }

    public get labelName(): LabelName {
        return this._labelName;
    }
    public set labelName(value: LabelName) {
        this._labelName = value;
    }

    public get menuUrl(): string {
        return this._menuUrl.trim();
    }
    public set menuUrl(value: string) {
        this._menuUrl = value;
    }

    public get weekDayJavascriptDayIndex(): WeekDayJavascriptDayIndex {
        return this._weekDayJavascriptDayIndex;
    }
    public set weekDayJavascriptDayIndex(value: WeekDayJavascriptDayIndex) {
        this._weekDayJavascriptDayIndex = value;
    }

    public get weekNumber(): string {
        return this._weekNumber.trim();
    }
    public set weekNumber(value: string) {
        this._weekNumber = value;
    }

    public get weekYear(): string {
        return this._weekYear.trim();
    }
    public set weekYear(value: string) {
        this._weekYear = value;
    }

    public get fetchError(): Error {
        return this._fetchError;
    }
    public set fetchError(value: Error) {
        this._fetchError = value;
    }

}
