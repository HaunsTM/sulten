
import { IWebMealResult } from "../../interfaces/webMealResult.itf";

import { Area } from "../../oRModels/area.mdl";
import { Dish } from "../../oRModels/dish.mdl";
import { Label } from "../../oRModels/label.mdl";
import { Occurence } from "../../oRModels/occurence.mdl";
import { Restaurant } from "../../oRModels/restaurant.mdl";
import { WeekDay } from "../../oRModels/weekDay.mdl";
import { WeekIndex } from "../../oRModels/weekIndex.mdl";

export class WebMealResult implements IWebMealResult {

    private _area: Area;
    private _dish: Dish;
    private _label: Label;
    private _meal: Restaurant;
    private _occurence: Occurence;
    private _weekDay: WeekDay;
    private _weekIndex: WeekIndex;
    private _fetchError: Error;

    constructor(area: Area, dish: Dish, label: Label, meal: Restaurant,
                occurence: Occurence, weekDay: WeekDay, weekIndex: WeekIndex,
                fetchError: Error) {
        this._area = area;
        this._dish = dish;
        this._label = label;
        this._meal = meal;
        this._occurence = occurence;
        this._weekDay = weekDay;
        this._weekIndex = weekIndex;

        this._fetchError = fetchError;
    }

    get area(): Area {
        return this._area;
    }

    public get dish(): Dish {
        return this._dish;
    }

    public get label(): Label {
        return this._label;
    }

    public get meal(): Restaurant {
        return this._meal;
    }

    public get occurence(): Occurence {
        return this._occurence;
    }

    public get weekDay(): WeekDay {
        return this._weekDay;
    }

    public get weekIndex(): WeekIndex {
        return this._weekIndex;
    }

    public get fetchError(): Error {
        return this._fetchError;
    }

}
