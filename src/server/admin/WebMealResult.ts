import { IndexNumber } from "../enum/IndexNumber";
import { LabelName } from "../enum/LabelName";
import { WeekDayIndex } from "../enum/WeekDayIndex";
import { IWebMealResult } from "../interfaces/IWebMealResult";

export class WebMealResult implements IWebMealResult {

    private _indexNumber: IndexNumber;
    private _menuUrl: string;
    private _dishDescription: string;
    private _priceSEK: string;
    private _labelName: LabelName;
    private _weekDayIndex: WeekDayIndex;
    private _weekNumber: string;
    private _weekYear: string;
    private _fetchError: string;

    constructor()
    constructor(menuUrl: string, dishDescription: string, priceSEK: string,
                indexNumber: IndexNumber, labelName: LabelName, weekDayIndex: WeekDayIndex,
                weekNumber: string,  weekYear: string, fetchError: Error)
    constructor(menuUrl?: string, dishDescription?: string, priceSEK?: string,
                indexNumber?: IndexNumber, labelName?: LabelName, weekDayIndex?: WeekDayIndex,
                weekNumber?: string, weekYear?: string, fetchError?: Error) {

        this._menuUrl = menuUrl;
        this._dishDescription = dishDescription;
        this._priceSEK = priceSEK;
        this._indexNumber = indexNumber;
        this._labelName = labelName;
        this._weekDayIndex = weekDayIndex;
        this._weekNumber = weekNumber;
        this._weekYear = weekYear;

        this._fetchError = fetchError ? fetchError.stack : null;
    }

    public get indexNumber(): IndexNumber {
        return this._indexNumber;
    }
    public set indexNumber(value: IndexNumber) {
        this._indexNumber = value;
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

    public get weekDayJavascriptDayIndex(): WeekDayIndex {
        return this._weekDayIndex;
    }
    public set weekDayJavascriptDayIndex(value: WeekDayIndex) {
        this._weekDayIndex = value;
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

    public get fetchError(): string {
        return this._fetchError;
    }
    public set fetchError(value: string) {
        this._fetchError = value;
    }

    public get isValid(): boolean {

        let isValid: boolean;

        const isNotNull =
            this.menuUrl !== null &&
            this.dishDescription !== null &&
            this.price_SEK !== null &&
            this.indexNumber !== null &&
            this.labelName !== null &&
            this.weekDayJavascriptDayIndex !== null &&
            this.weekNumber !== null &&
            this.weekYear !== null;

        if (isNotNull) {

            if (this.dishDescription !== "" && (this.fetchError === null || this.fetchError === "") ) {
                isValid = true;
            } else if (this.dishDescription === "" && (this.fetchError !== null && this.fetchError !== "")) {
                isValid = true;
            } else {
                isValid = false;
            }
            
        } else {
            isValid = false;
        }

        
        return isValid;
    }

}
