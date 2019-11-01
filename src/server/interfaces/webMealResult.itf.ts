import { IDish } from "./oRModels/dish.itf";
import { ILabel } from "./oRModels/label.itf";
import { IWeekDay } from "./oRModels/weekDay.itf";
import { IWeekIndex } from "./oRModels/weekIndex.itf";

export interface IWebMealResult {

    fetchUrl: string;

    dish: IDish;

    label: ILabel;

    weekDay: IWeekDay;

    weekIndex: IWeekIndex;

    fetchError: Error;

}
