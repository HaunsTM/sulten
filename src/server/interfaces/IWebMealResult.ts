import { LabelName } from "../enum/LabelName";
import { WeekDayJavascriptDayIndex } from "../enum/WeekDayJavascriptDayIndex";

export interface IWebMealResult {

    DishDescription: string;

    DishPrice_SEK: string;

    LabelName: LabelName;

    MenuUrl: string;

    WeekDayJavascriptDayIndex: WeekDayJavascriptDayIndex;

    WeekNumber: string;

    FetchError: Error;

}
