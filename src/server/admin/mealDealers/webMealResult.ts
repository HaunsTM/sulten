
import { IWebMealResult } from "../../interfaces/webMealResult.itf";

import { IArea } from "../../interfaces/oRModels/area.itf";
import { IDish } from "../../interfaces/oRModels/dish.itf";
import { ILabel } from "../../interfaces/oRModels/label.itf";
import { IMeal } from "../../interfaces/oRModels/meal.itf";
import { IOccurence } from "../../interfaces/oRModels/occurence.itf";
import { IRestaurant } from "../../interfaces/oRModels/restaurant.itf";
import { IWeekDay } from "../../interfaces/oRModels/weekDay.itf";
import { IWeekIndex } from "../../interfaces/oRModels/weekIndex.itf";

export class WebMealResult implements IWebMealResult {

    private _dish: IDish;
    private _label: ILabel;
    private _meal: IMeal;
    private _restaurant: IRestaurant;
    private _occurence: IOccurence;
    private _fetchError: Error;

    constructor(dish: IDish, label: ILabel, meal: IMeal,
                restaurant: IRestaurant,
                occurence: IOccurence,
                fetchError: Error) {

        this._restaurant = restaurant;
        this._dish = dish;
        this._label = label;
        this._meal = meal;
        this._occurence = occurence;

        this._fetchError = fetchError;
    }

    public get dish(): IDish {
        return this._dish;
    }

    public get label(): ILabel {
        return this._label;
    }

    public get meal(): IMeal {
        return this._meal;
    }
    public get restaurant(): IRestaurant {
        return this._restaurant;
    }

    public get area(): IArea {
        return this._restaurant.area;
    }

    public get occurence(): IOccurence {
        return this._occurence;
    }

    public get weekDay(): IWeekDay {
        return this._occurence.weekDay;
    }

    public get weekIndex(): IWeekIndex {
        return this._occurence.weekIndex;
    }

    public get fetchError(): Error {
        return this._fetchError;
    }

}
