import { LabelName } from "../enum/LabelName";
import { WeekDayJavascriptDayIndex } from "../enum/WeekDayJavascriptDayIndex";

export interface IWebMealResult {

    DishDescription: string;

    Price_SEK: string;

    LabelName: LabelName;

    MenuUrl: string;

    WeekDayJavascriptDayIndex: WeekDayJavascriptDayIndex;

    WeekNumber: string;

    WeekYear: string;

    FetchError: Error;

}
