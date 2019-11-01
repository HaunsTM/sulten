import { IWebMealResult } from "../../interfaces/webMealResult.itf";
import { IDish } from "../../interfaces/oRModels/dish.itf";
import { ILabel } from "../../interfaces/oRModels/label.itf";
import { IWeekDay } from "../../interfaces/oRModels/weekDay.itf";
import { IWeekIndex } from "../../interfaces/oRModels/weekIndex.itf";

export class WebMealResult implements IWebMealResult {

    private _dish: IDish;
    private _label: ILabel;
    private _weekDay: IWeekDay;
    private _weekIndex: IWeekIndex;
    private _fetchError: Error;
    private _fetchUrl: string;

    constructor(fetchUrl: string, dish: IDish, label: ILabel, weekDay: IWeekDay,
                weekIndex: IWeekIndex,
                fetchError: Error) {

        this._fetchUrl = fetchUrl;
        this._dish = dish;
        this._label = label;
        this._weekDay = weekDay;
        this._weekIndex = weekIndex;

        this._fetchError = fetchError;
    }

    public get dish(): IDish {
        return this._dish;
    }

    public get label(): ILabel {
        return this._label;
    }

    public get weekDay(): IWeekDay {
        return this._weekDay;
    }

    public get weekIndex(): IWeekIndex {
        return this._weekIndex;
    }

    public get fetchError(): Error {
        return this._fetchError;
    }

    public get fetchUrl(): string {
        return this._fetchUrl;
    }

}
